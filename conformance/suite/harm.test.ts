/**
 * Prohibition 1 — harm
 *
 * This test proves that no registered harm tool can execute.
 * A conforming implementation registers harm tools at startup.
 * Once registered as harmful, a tool is denied unconditionally —
 * regardless of other rules, user instructions, or LLM output.
 *
 * Passing this test means: the agent cannot be instructed to cause harm
 * through any tool classified as harmful by the implementation.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DirectiveLayer } from "../../packages/core/src/layer.js";
import { setAuditCallback } from "../../packages/core/src/audit.js";

beforeEach(() => {
  setAuditCallback(() => {});
});

describe("Prohibition 1 — harm: no registered harm tool can execute", () => {
  it("denies a harm tool unconditionally", () => {
    const layer = new DirectiveLayer();
    layer.registerHarmTool("clean_temp");
    expect(layer.check("clean_temp")).toBe("deny");
  });

  it("harm denial cannot be overridden by an allowed registration", () => {
    const layer = new DirectiveLayer();
    layer.registerHarmTool("empty_recycle_bin");
    layer.registerAllowedTool("empty_recycle_bin");
    expect(layer.check("empty_recycle_bin")).toBe("deny");
  });

  it("non-harm tools registered as allowed are permitted", () => {
    const layer = new DirectiveLayer();
    layer.registerAllowedTool("get_disk_usage");
    expect(layer.check("get_disk_usage")).toBe("allow");
  });
});
