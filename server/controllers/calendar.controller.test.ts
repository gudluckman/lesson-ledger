import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getWeekRange } from "./calendar.controller";

describe("getWeekRange", () => {
  it("uses the Sydney calendar day when production is still on Sunday UTC", () => {
    const { startOfWeek, endOfWeek } = getWeekRange(
      0,
      new Date("2026-05-10T15:00:00.000Z")
    );

    assert.equal(startOfWeek.toISOString(), "2026-05-10T14:00:00.000Z");
    assert.equal(endOfWeek.toISOString(), "2026-05-17T13:59:59.999Z");
  });

  it("returns adjacent weeks from the same Sydney calendar anchor", () => {
    const now = new Date("2026-05-10T15:00:00.000Z");
    const previousWeek = getWeekRange(-1, now);
    const nextWeek = getWeekRange(1, now);

    assert.equal(
      previousWeek.startOfWeek.toISOString(),
      "2026-05-03T14:00:00.000Z"
    );
    assert.equal(
      previousWeek.endOfWeek.toISOString(),
      "2026-05-10T13:59:59.999Z"
    );
    assert.equal(
      nextWeek.startOfWeek.toISOString(),
      "2026-05-17T14:00:00.000Z"
    );
    assert.equal(
      nextWeek.endOfWeek.toISOString(),
      "2026-05-24T13:59:59.999Z"
    );
  });
});
