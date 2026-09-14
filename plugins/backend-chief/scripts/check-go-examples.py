#!/usr/bin/env python3
"""Compile the Go examples from the references and exercise their contracts.

Requires a local Go 1.26+ toolchain and race support. All generated modules,
mutations, and build caches are temporary; no network or project edits are used.
Language versions under one toolchain are not historical toolchain runs.
"""

import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]


def run(args, cwd, env, *, expected_failure=False):
    result = subprocess.run(
        args, cwd=cwd, env=env, text=True, capture_output=True, timeout=60
    )
    output = result.stdout + result.stderr
    if expected_failure:
        if result.returncode == 0:
            raise RuntimeError(f"unexpected success: {args}\n{output}")
    elif result.returncode:
        raise RuntimeError(f"failed: {args}\n{output}")
    print(f"{'EXPECTED FAILURE' if expected_failure else 'PASS'}: {' '.join(args)}")
    return output


def extract_examples(destination):
    count = 0
    for source in sorted((ROOT / "references/go").glob("*.md")):
        text = source.read_text()
        matches = list(re.finditer(
            r"<!-- go-example: ([a-z_]+\.go) -->\n```go\n(.*?)\n```",
            text, re.DOTALL,
        ))
        if len(matches) != len(re.findall(r"^```go$", text, re.MULTILINE)):
            raise RuntimeError(f"unmarked Go example: {source}")
        for match in matches:
            target = destination / match[1]
            if target.exists():
                raise RuntimeError(f"duplicate example: {target.name}")
            target.write_text(match[2] + "\n")
            count += 1
    if not count:
        raise RuntimeError("no Go examples found")
    print(f"Extracted {count} Go examples from references")


def write_module(directory, version):
    (directory / "go.mod").write_text(f"module example.test/coding\n\ngo {version}\n")


def check_loop_semantics(directory, env):
    probe = directory / "loop-probe"
    probe.mkdir()
    (probe / "main.go").write_text('''package main

import "fmt"

func main() {
	var declared []func() int
	for _, value := range []int{1, 2, 3} {
		declared = append(declared, func() int { return value })
	}
	var assigned []func() int
	var value int
	for _, value = range []int{1, 2, 3} {
		assigned = append(assigned, func() int { return value })
	}
	fmt.Println(declared[0](), declared[1](), declared[2]())
	fmt.Println(assigned[0](), assigned[1](), assigned[2]())
}
''')
    for version, want in [("1.21", "3 3 3\n3 3 3\n"), ("1.22", "1 2 3\n3 3 3\n")]:
        write_module(probe, version)
        got = run(["go", "run", "."], probe, env)
        if got != want:
            raise RuntimeError(f"loop semantics go {version}: {got!r}, want {want!r}")
        print(f"PASS: declared versus assigned range variables, go {version}")


def check_api_versions(directory, env):
    probe = directory / "api-probe"
    probe.mkdir()
    (probe / "api_test.go").write_text('''package coding

import (
	"errors"
	"fmt"
	"testing"
)

type problem struct{}

func (*problem) Error() string { return "problem" }

func TestModernAPI(t *testing.T) {
	original := &problem{}
	got, ok := errors.AsType[*problem](fmt.Errorf("operation: %w", original))
	if !ok || got != original || *new(8) != 8 {
		t.Fatal("Go 1.26 API/initialization contract failed")
	}
}
''')
    write_module(probe, "1.26")
    run(["go", "test", "./..."], probe, env)
    write_module(probe, "1.25")
    output = run(["go", "test", "./..."], probe, env, expected_failure=True)
    if "go1.26" not in output:
        raise RuntimeError(f"expected language version diagnostic, got: {output}")
    # Remove new(expr) to isolate the standard-library API's minimum version.
    code = (probe / "api_test.go").read_text().replace(" || *new(8) != 8", "")
    (probe / "api_test.go").write_text(code)
    output = run(["go", "vet", "./..."], probe, env, expected_failure=True)
    if "AsType" not in output or "go1.26" not in output:
        raise RuntimeError(f"expected AsType version diagnostic, got: {output}")


def check_dependency_direction(directory, env):
    probe = directory / "dependency-probe"
    (probe / "domain").mkdir(parents=True)
    (probe / "adapter").mkdir()
    write_module(probe, "1.21")
    (probe / "domain/stock.go").write_text('''package domain

type StockReader interface {
	Stock(string) (int, error)
}
''')
    (probe / "adapter/stock.go").write_text('''package adapter

import "example.test/coding/domain"

type Memory struct{}

var _ domain.StockReader = (*Memory)(nil)

func (*Memory) Stock(string) (int, error) { return 0, nil }
''')
    run(["go", "test", "./..."], probe, env)
    with (probe / "domain/reverse.go").open("w") as file:
        file.write('package domain\nimport _ "example.test/coding/adapter"\n')
    output = run(["go", "test", "./..."], probe, env, expected_failure=True)
    if "import cycle" not in output:
        raise RuntimeError(f"expected import cycle, got: {output}")


def check_mutations(directory, env):
    # Each negative control must fail the behavioral assertion, not compilation.
    mutations = [
        ("types.go", "return Labels{values: cloneLabels(values)}", "return Labels{values: values}",
         "TestLabelsOwnership", "input mutation escaped ownership"),
        ("types.go", "return cloneLabels(l.values)", "return l.values",
         "TestLabelsOwnership", "returned mutation escaped ownership"),
        ("errors.go", 'fmt.Errorf("parse limit: %w", ErrInvalidLimit)',
         'fmt.Errorf("parse limit: %v", ErrInvalidLimit)',
         "TestParseLimitErrorBoundary", "want ErrInvalidLimit"),
        ("concurrency.go", "\t\t\t\tcase <-ctx.Done():\n\t\t\t\t\treturn\n", "",
         "TestForwardCancelWhileSending", "Forward did not terminate"),
    ]
    for name, before, after, test, diagnostic in mutations:
        target = directory / name
        original = target.read_text()
        if original.count(before) != 1:
            raise RuntimeError(f"mutation needs updating: {name}, {test}")
        try:
            target.write_text(original.replace(before, after))
            output = run(["go", "test", "-count=1", "-timeout=10s", "-run", f"^{test}$", "."],
                         directory, env, expected_failure=True)
            if diagnostic not in output:
                raise RuntimeError(f"negative control failed for wrong reason: {output}")
        finally:
            target.write_text(original)


def main():
    with tempfile.TemporaryDirectory(prefix="backend-go-examples-") as scratch:
        directory = Path(scratch)
        env = os.environ.copy()
        env.update(GOTOOLCHAIN="local", GOWORK="off", GOPROXY="off", GOSUMDB="off",
                   GOFLAGS="", GOEXPERIMENT="", GOCACHE=str(directory / "cache"))
        version = run(["go", "version"], directory, env).strip()
        match = re.search(r"go1\.(\d+)", version)
        if not match or int(match[1]) < 26:
            raise RuntimeError(f"local Go 1.26+ required: {version}")
        print(version)
        extract_examples(directory)
        shutil.copyfile(ROOT / "evals/go-coding/contracts_test.go", directory / "contracts_test.go")
        go_files = sorted(path.name for path in directory.glob("*.go"))
        unformatted = run(["gofmt", "-l", *go_files], directory, env)
        if unformatted:
            raise RuntimeError(f"unformatted examples or fixtures:\n{unformatted}")
        for language in ["1.21", "1.22", "1.26"]:
            write_module(directory, language)
            run(["go", "vet", "./..."], directory, env)
            run(["go", "test", "-count=1", "-timeout=20s", "./..."], directory, env)
            print(f"PASS: examples with go {language} module declaration")
        run(["go", "test", "-race", "-count=1", "-timeout=20s", "./..."], directory, env)
        run(["go", "doc", "ParseLimit"], directory, env)
        check_mutations(directory, env)
        check_loop_semantics(directory, env)
        check_api_versions(directory, env)
        check_dependency_direction(directory, env)
        print("Go examples and negative controls passed; skill response evaluation is separate.")


if __name__ == "__main__":
    main()
