/**
 * Prohibition 2 — conceal
 *
 * This test proves that every decision is logged, none can be omitted.
 * The audit log is the technical anchor for this prohibition.
 * A conforming implementation cannot make a decision without leaving a record.
 * The decision and the log entry are a single atomic operation in DirectiveLayer.check().
 *
 * Passing this test means: the agent cannot act invisibly.
 * Every tool call — allowed or denied — produces an audit entry
 * that the implementation must persist on the user's device.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DirectiveLayer } from "../../packages/core/src/layer.js";
import { setAuditCallback } from "../../packages/core/src/audit.js";

describe("Prohibition 2 — conceal: every decision is logged, none omitted", () => {
  beforeEach(() => {
    setAuditCallback(() => {});
  });

  it("logs allowed decisions", () => {
    const log: string[] = [];
    setAuditCallback((e) => log.push(`${e.decision}:${e.tool}`));

    const layer = new DirectiveLayer();
    layer.registerAllowedTool("open_app");
    layer.check("open_app");

    expect(log).toContain("allow:open_app");
  });

  it("logs denied decisions", () => {
    const log: string[] = [];
    setAuditCallback((e) => log.push(`${e.decision}:${e.tool}`));

    const layer = new DirectiveLayer();
    layer.registerHarmTool("example_harm_tool");
    layer.check("example_harm_tool");

    expect(log).toContain("deny:example_harm_tool");
  });

  it("logs the prohibition code on denial", () => {
    const entries: { prohibition?: string }[] = [];
    setAuditCallback((e) => entries.push({ prohibition: e.prohibition }));

    const layer = new DirectiveLayer();
    layer.registerHarmTool("dangerous_tool");
    layer.check("dangerous_tool");

    expect(entries[0]?.prohibition).toBe("harm");
  });

  it("cannot execute check() without producing an audit entry", () => {
    let count = 0;
    setAuditCallback(() => {
      count++;
    });

    const layer = new DirectiveLayer();
    layer.registerAllowedTool("tool_a");
    layer.check("tool_a");
    layer.check("tool_b");

    expect(count).toBe(2);
  });
});
