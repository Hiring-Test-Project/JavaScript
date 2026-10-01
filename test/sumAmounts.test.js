import assert from "node:assert/strict";
import { test } from "node:test";
import { settle } from "../src/sumAmounts.js";

function ob(id, amountDue, priority) {
  return { id, amountDue, priority };
}

function settlement(unapplied, ...pairs) {
  return {
    lines: pairs.map(([id, applied]) => ({ id, applied })),
    unapplied,
  };
}

test("empty list leaves the payment unapplied", () => {
  assert.deepEqual(settle(100, []), settlement(100));
});

test("a payment that covers every obligation leaves the rest unapplied", () => {
  assert.deepEqual(
    settle(500, [ob(1, 100, 1), ob(2, 40, 3), ob(3, 60, 2)]),
    settlement(300, [1, 100], [2, 40], [3, 60]),
  );
});

test("a higher priority is paid first", () => {
  assert.deepEqual(
    settle(60, [ob(1, 80, 1), ob(2, 50, 9), ob(3, 25, 9)]),
    settlement(0, [1, 0], [2, 50], [3, 10]),
  );
});

test("the same priority pays the earlier row first", () => {
  assert.deepEqual(
    settle(10, [ob(1, 50, 1), ob(2, 30, 1), ob(3, 20, 1)]),
    settlement(0, [1, 10], [2, 0], [3, 0]),
  );
});

test("a remainder spills to the next priority", () => {
  assert.deepEqual(
    settle(120, [ob(1, 100, 1), ob(2, 40, 5), ob(3, 60, 5)]),
    settlement(0, [1, 20], [2, 40], [3, 60]),
  );
});

test("a duplicate id is rejected", () => {
  assert.throws(
    () => settle(5, [ob(1, 10, 1), ob(1, 4, 2)]),
    /duplicate/i,
  );
});
