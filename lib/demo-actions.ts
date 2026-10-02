import type { DemoState, Order } from "./data";

export function addToCart(s: DemoState, id: string, quantity = 1) {
  const product = s.products.find((p) => p.id === id && p.published);
  if (!product || product.stock < 1)
    throw new Error("This item is no longer available.");
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new Error("Choose a valid quantity.");
  const row = s.cart.find((r) => r.id === id);
  if (row) row.quantity = Math.min(product.stock, row.quantity + quantity);
  else s.cart.push({ id, quantity: Math.min(product.stock, quantity) });
}

export function checkoutItems(s: DemoState) {
  if (!s.cart.length) throw new Error("Your bag is empty.");
  return s.cart.map((row) => {
    const product = s.products.find((p) => p.id === row.id && p.published);
    if (!product || row.quantity > product.stock || row.quantity < 1) {
      throw new Error(
        "Availability changed. Review the quantities in your bag.",
      );
    }
    return { product: structuredClone(product), quantity: row.quantity };
  });
}

export function changeOrderStatus(order: Order, action: string) {
  if (
    ["Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(
      action,
    ) &&
    order.payment !== "Verified"
  ) {
    throw new Error(
      "Verify the payment before preparing or shipping this order.",
    );
  }
  if (action === "Mark Payment Verified") {
    order.payment = "Verified";
    order.status = "Preparing";
  } else if (action === "Mark Not Verified") {
    order.payment = "Not Verified";
    order.status = "Pending Payment";
  } else if (action === "Needs Attention") {
    order.payment = "Needs Attention";
    order.status = action;
  } else {
    order.status = action;
  }
  order.history.push(
    `${action} · ${new Date().toLocaleTimeString("en-PK", { timeZone: "Asia/Karachi" })}`,
  );
}

export function compatibleYear(compatibility: string, year: number) {
  const range = compatibility.match(/(\d{4})[–-](\d{4})/);
  return !!range && year >= Number(range[1]) && year <= Number(range[2]);
}
