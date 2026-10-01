# Settle a payment

Apply one inbound payment, in minor units, to open obligations. Plan on 15 minutes.

An obligation has:

- an id, a unique non-negative integer
- an amount due, a non-negative integer still owed
- a priority, a non-negative integer; a higher value is settled first

Return one line per obligation, in the **same order as the input**, and the unapplied remainder of the payment. Each line has the obligation id and the integer amount applied to it.

## Order

Walk the obligations from highest priority to lowest. When two priorities are equal, the one earlier in the input is paid first.

Give each obligation as much as it is due, or whatever payment is left, whichever is smaller. Then move to the next. Do not split a priority proportionally.

## Invariants

- The applied amounts plus the unapplied remainder equal the payment.
- An applied amount never exceeds that obligation's amount due.
- Applied amounts and the unapplied remainder are zero or greater.
- A repeated id is rejected, and no settlement is returned.

Use integer arithmetic. Every value in the tests fits in a signed 64-bit integer.

## Examples

Payment `60`. Obligations in input order: due `80` at priority `1`, due `50` at priority `9`, due `25` at priority `9`.

Priority `9` is paid first, and the due-`50` row is earlier, so it is paid in full. The due-`25` row receives the other `10`. The priority-`1` row receives `0`. Applied is `0`, `50`, `10`.

Payment `10`, one priority, amounts due `50`, `30`, `20`. Applied is `10`, `0`, `0`.

Do not change the tests.

## Signature

An obligation is `{ id, amountDue, priority }`. The result is `{ lines, unapplied }`, and each line is `{ id, applied }`.

```javascript
settle(payment: number, obligations: Obligation[]): Settlement
```

A repeated id throws an `Error` whose message contains `duplicate`.
