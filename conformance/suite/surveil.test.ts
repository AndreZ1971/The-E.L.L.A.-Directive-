/**
 * Prohibition 3 — surveil
 *
 * This test proves that surveillance tools are denied without active consent.
 * Active consent is modelled as explicit tool registration via registerAllowedTool().
 * The default-deny principle ensures that any tool not explicitly registered
 * is denied — preventing the agent from observing, recording, or analyzing
 * anything the implementation has not consciously permitted.
 *
 * Passing this test means: the agent cannot observe what it has not been
 * explicitly permitted to observe. Implicit trust does not exist.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DirectiveLayer } from "../../packages/core/src/layer.js";
import { setAuditCallback } from "../../packages/core/src/audit.js";

beforeEach(() => {
  setAuditCallback(() => {});
});

describe("Prohibition 3 — surveil: no observation without active consent", () => {
  it("denies any unregistered tool — default-deny prevents silent surveillance", () => {
    const layer = new DirectiveLayer();
    expect(layer.check("any_unregistered_tool")).toBe("deny");
  });

  it("requires explicit registration to permit a tool — implicit trust is not allowed", () => {
    const layer = new DirectiveLayer();
    layer.registerAllowedTool("explicitly_permitted");
    expect(layer.check("explicitly_permitted")).toBe("allow");
    expect(layer.check("not_registered")).toBe("deny");
  });

  it("marks unregistered denials with prohibition code 'unregistered'", () => {
    const entries: { prohibition?: string }[] = [];
    setAuditCallback((e) => entries.push({ prohibition: e.prohibition }));

    const layer = new DirectiveLayer();
    layer.check("ghost_tool");

    expect(entries[0]?.prohibition).toBe("unregistered");
  });
});
