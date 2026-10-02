import { test } from "node:test";
import assert from "node:assert/strict";
import { seedState } from "../lib/data";
import {
  addToCart,
  checkoutItems,
  changeOrderStatus,
  compatibleYear,
} from "../lib/demo-actions";

test("cart quantities respect stock and checkout rejects stale inventory", () => {
  const state = seedState();
  addToCart(state, "p1", 500);
  assert.equal(state.cart[0].quantity, state.products[0].stock);
  assert.equal(checkoutItems(state)[0].product.id, "p1");
  state.products[0].stock = 0;
  assert.throws(() => checkoutItems(state), /Availability changed/);
  assert.throws(() => addToCart(state, "v1"), /no longer available/);
});

test("manual payments must be verified before fulfilment", () => {
  const order = seedState().orders[0];
  assert.throws(() => changeOrderStatus(order, "Shipped"), /Verify/);
  changeOrderStatus(order, "Mark Payment Verified");
  assert.equal(order.payment, "Verified");
  assert.equal(order.status, "Preparing");
  changeOrderStatus(order, "Shipped");
  assert.equal(order.status, "Shipped");
  assert.match(order.history.at(-1)!, /Shipped/);
});

test("seeds cover payment scenarios and keep marketplace cars out of the store", () => {
  const state = seedState();
  assert.equal(new Set(state.orders.map((o) => o.status)).size, 7);
  assert.ok(state.vehicles.some((v) => !v.showPhone));
  assert.ok(state.vehicles.some((v) => v.status === "Pending Review"));
  assert.ok(
    state.vehicles.every((v) => !state.products.some((p) => p.id === v.id)),
  );
  state.products[0].title = "Changed";
  assert.notEqual(seedState().products[0].title, "Changed");
});

test("compatibility year filters use inclusive supported ranges", () => {
  assert.equal(compatibleYear("Toyota Corolla · 2014–2021", 2014), true);
  assert.equal(compatibleYear("Toyota Corolla · 2014–2021", 2021), true);
  assert.equal(compatibleYear("Toyota Corolla · 2014–2021", 2024), false);
});
