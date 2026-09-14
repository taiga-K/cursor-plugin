package coding

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"strconv"
	"strings"
	"testing"
	"time"
)

func TestLabelsOwnership(t *testing.T) {
	input := []Label{{Name: "priority", Aliases: []string{"urgent"}}}
	labels := NewLabels(input)
	input[0].Name = "changed"
	input[0].Aliases[0] = "changed"
	returned := labels.Values()
	if returned[0].Name != "priority" || returned[0].Aliases[0] != "urgent" {
		t.Fatalf("input mutation escaped ownership: %+v", returned)
	}
	returned[0].Name = "changed again"
	returned[0].Aliases[0] = "changed again"
	got := labels.Values()
	if got[0].Name != "priority" || got[0].Aliases[0] != "urgent" {
		t.Fatalf("returned mutation escaped ownership: %+v", got)
	}
}

func TestLabelsZeroAndJSON(t *testing.T) {
	var zero Labels
	if len(zero.Values()) != 0 {
		t.Fatalf("zero Labels = %v, want empty", zero.Values())
	}
	// Transport contracts can distinguish nil and explicitly empty slices.
	for _, tc := range []struct {
		name   string
		labels Labels
		want   string
	}{
		{name: "nil", labels: zero, want: "null"},
		{name: "explicit_empty", labels: NewLabels([]Label{}), want: "[]"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			got, err := json.Marshal(tc.labels.Values())
			if err != nil {
				t.Fatal(err)
			}
			if string(got) != tc.want {
				t.Errorf("JSON empty contract = %s, want %s", got, tc.want)
			}
		})
	}
}

func TestFullSliceStillSharesElements(t *testing.T) {
	source := []int{1, 2, 3}
	limited := source[:2:2]
	limited[0] = 7
	if source[0] != 7 {
		t.Fatal("full slice must still share existing elements")
	}
	limited = append(limited, 9)
	if source[2] != 3 || limited[2] != 9 {
		t.Fatalf("append across capacity: source=%v limited=%v", source, limited)
	}
}

func TestParseLimitErrorBoundary(t *testing.T) {
	_, err := ParseLimit("invalid")
	if !errors.Is(err, ErrInvalidLimit) {
		t.Fatalf("classification = %v, want ErrInvalidLimit", err)
	}
	var external *strconv.NumError
	if errors.As(err, &external) {
		t.Fatalf("ParseLimit exposed an implementation error: %v", external)
	}
	_, err = ParseLimit("1")
	if err != nil {
		t.Fatalf("success error = %v, want nil", err)
	}
}

type readFailure struct {
	err error
}

func (r readFailure) Read([]byte) (int, error) {
	return 0, r.err
}

func TestReadPayload(t *testing.T) {
	for _, tc := range []struct {
		name  string
		input string
		limit int
		want  string
		err   error
	}{
		{name: "empty", limit: 1},
		{name: "exact_limit", input: "abc", limit: 3, want: "abc"},
		{name: "overflow", input: "abcd", limit: 3, err: ErrTooLarge},
		{name: "invalid_limit", limit: 0, err: ErrInvalidLimit},
		{name: "negative_limit", limit: -1, err: ErrInvalidLimit},
		{name: "overflowing_probe", limit: int(^uint(0) >> 1), err: ErrInvalidLimit},
	} {
		t.Run(tc.name, func(t *testing.T) {
			got, err := ReadPayload(strings.NewReader(tc.input), tc.limit)
			if string(got) != tc.want || !errors.Is(err, tc.err) {
				t.Errorf("ReadPayload(%q, %d) = (%q, %v), want (%q, %v)",
					tc.input, tc.limit, got, err, tc.want, tc.err)
			}
		})
	}
	_, err := ReadPayload(readFailure{err: io.ErrUnexpectedEOF}, 4)
	if !errors.Is(err, io.ErrUnexpectedEOF) {
		t.Fatalf("read error = %v, want wrapped io.ErrUnexpectedEOF", err)
	}
}

func waitDone(t *testing.T, done <-chan struct{}) {
	t.Helper()
	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("Forward did not terminate")
	}
}

func assertClosed(t *testing.T, output <-chan int) {
	t.Helper()
	select {
	case value, ok := <-output:
		if ok {
			t.Fatalf("output after completion = %d, want closed", value)
		}
	default:
		t.Fatal("output remains open after completion")
	}
}

func TestForwardNormal(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	input := make(chan int, 2)
	input <- 3
	input <- 8
	close(input)
	output, done := Forward(ctx, input)
	for _, want := range []int{3, 8} {
		select {
		case got, ok := <-output:
			if !ok || got != want {
				t.Fatalf("forwarded value = (%d, %v), want (%d, true)", got, ok, want)
			}
		case <-time.After(2 * time.Second):
			t.Fatal("Forward did not deliver input")
		}
	}
	waitDone(t, done)
	assertClosed(t, output)
}

func TestForwardCancelWhileReceiving(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	output, done := Forward(ctx, nil)
	cancel()
	waitDone(t, done)
	assertClosed(t, output)
}

func TestForwardCancelWhileSending(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	input := make(chan int)
	output, done := Forward(ctx, input)
	select {
	case input <- 42: // Handshake proves the worker has received the value.
	case <-time.After(2 * time.Second):
		t.Fatal("Forward did not receive input")
	}
	// There is deliberately no output receiver: only cancellation can unblock it.
	cancel()
	waitDone(t, done)
	assertClosed(t, output)
}
