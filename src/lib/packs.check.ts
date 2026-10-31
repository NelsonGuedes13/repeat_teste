// Self-check for the estimate maths: `node --experimental-strip-types src/lib/packs.check.ts`
import assert from "node:assert/strict";
import { estimate, emptyExtras, headsFor } from "./packs.ts";

const none = emptyExtras();
assert.equal(estimate({ pack: "essencial", extras: none, days: 1 }), 1200);
assert.equal(estimate({ pack: "pro", extras: { ...none, led: 1, heads: 2 }, days: 1 }), 3500 + 900 + 500);
// 2 days = 1 + 0.6
assert.equal(estimate({ pack: "essencial", extras: none, days: 2 }), 1920);
// quantities and days are clamped
assert.equal(estimate({ pack: "essencial", extras: { ...none, led: 5 }, days: 99 }), Math.round(2100 * (1 + 0.6 * 4)));
assert.equal(estimate({ pack: "essencial", extras: none, days: 0 }), 1200);
assert.equal(headsFor({ pack: "pro", extras: { ...none, heads: 4 }, days: 1 }), 6);
console.log("packs: ok");
