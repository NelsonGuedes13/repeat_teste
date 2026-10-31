// Self-check for the estimate maths: `node --experimental-strip-types src/lib/packs.check.ts`
import assert from "node:assert/strict";
import { estimate, emptyExtras, headsFor, suggest } from "./packs.ts";

const none = emptyExtras();
assert.equal(estimate({ pack: "essencial", extras: none, days: 1 }), 1200);
assert.equal(estimate({ pack: "pro", extras: { ...none, led: 1, heads: 2 }, days: 1 }), 3500 + 900 + 500);
// 2 days = 1 + 0.6
assert.equal(estimate({ pack: "essencial", extras: none, days: 2 }), 1920);
// quantities and days are clamped
assert.equal(estimate({ pack: "essencial", extras: { ...none, led: 5 }, days: 99 }), Math.round(2100 * (1 + 0.6 * 4)));
assert.equal(estimate({ pack: "essencial", extras: none, days: 0 }), 1200);
assert.equal(headsFor({ pack: "pro", extras: { ...none, heads: 4 }, days: 1 }), 6);

// budget → suggestion
assert.equal(suggest(800, 100, "private").config, null); // below the cheapest pack
const s = suggest(5000, 300, "conference");
assert.equal(s.config!.pack, "pro");
assert.deepEqual(s.config!.extras, { ...none, led: 1, tech: 3 }); // 3500 + 900 + 600 = 5000
assert.equal(s.left, 0);
assert.equal(estimate(s.config!), 5000 - s.left); // the suggestion never costs more than the budget
const big = suggest(2000, 3000, "festival");
assert.equal(big.config!.pack, "essencial");
assert.equal(big.short, 8000 - 2000); // 3000 people need the Espetáculo pack
for (const b of [1200, 4321, 9999, 20000]) {
  const r = suggest(b, 200, "concert");
  assert.ok(estimate(r.config!) <= b, `over budget at ${b}`);
}
console.log("packs: ok");
