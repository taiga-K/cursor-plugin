// Example organism stories with state coverage + play. Verified: 2026-09-12.
// Copy beside the component as OrdersList.stories.tsx and wire the real component.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { http, HttpResponse } from "msw";

// import { OrdersList } from "./OrdersList";

function OrdersListStub(props: {
  status: "ready" | "loading" | "empty" | "error" | "disabled" | "degraded";
}) {
  if (props.status === "loading") return <p role="status">読み込み中</p>;
  if (props.status === "empty") return <p>注文はまだありません</p>;
  if (props.status === "error") return <p role="alert">取得に失敗しました</p>;
  if (props.status === "degraded") {
    return (
      <div>
        <ul aria-label="注文一覧"><li>キーボード</li></ul>
        <p role="status">おすすめを取得できません</p>
      </div>
    );
  }
  return (
    <div>
      <ul aria-label="注文一覧"><li>キーボード</li></ul>
      <button type="button" disabled={props.status === "disabled"}>再読み込み</button>
    </div>
  );
}

const meta = {
  title: "orders/OrdersList",
  component: OrdersListStub,
  args: { status: "ready" },
} satisfies Meta<typeof OrdersListStub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("list", { name: "注文一覧" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "再読み込み" }));
  },
};

export const Loading: Story = { args: { status: "loading" } };
export const Empty: Story = { args: { status: "empty" } };
export const ErrorState: Story = { args: { status: "error" } };
export const Disabled: Story = { args: { status: "disabled" } };
export const Degraded: Story = {
  args: { status: "degraded" },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/recommendations", () =>
          HttpResponse.json({ message: "timeout" }, { status: 504 }),
        ),
      ],
    },
  },
};
