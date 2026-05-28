/**
 * Prohibition 4 — exfiltrate
 *
 * This test proves that no data path to external destinations exists
 * through any tool registered as an exfiltration tool.
 * Exfiltration tools are denied unconditionally — manufacturer, authorities,
 * analytics services, and "improvement programs" are all third parties
 * under this prohibition. No exceptions.
 *
 * Passing this test means: the agent cannot transmit user data to any
 * external destination through a tool classified as an exfiltration risk.
 * The user's data stays on the user's device unless they decide otherwise.
 * Explicitly. Each time.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { DirectiveLayer } from "../../packages/core/src/layer.js";
import { setAuditCallback } from "../../packages/core/src/audit.js";

beforeEach(() => {
  setAuditCallback(() => {});
});

describe("Prohibition 4 — exfiltrate: no data path to external destinations", () => {
  it("denies a registered exfiltration tool unconditionally", () => {
    const layer = new DirectiveLayer();
    layer.registerExfiltrationTool("send_telemetry");
    expect(layer.check("send_telemetry")).toBe("deny");
  });

  it("exfiltration denial cannot be overridden by an allowed registration", () => {
    const layer = new DirectiveLayer();
    layer.registerExfiltrationTool("upload_data");
    layer.registerAllowedTool("upload_data");
    expect(layer.check("upload_data")).toBe("deny");
  });

  it("logs prohibition code 'exfiltrate' on denial", () => {
    const entries: { prohibition?: string }[] = [];
    setAuditCallback((e) => entries.push({ prohibition: e.prohibition }));

    const layer = new DirectiveLayer();
    layer.registerExfiltrationTool("sync_cloud");
    layer.check("sync_cloud");

    expect(entries[0]?.prohibition).toBe("exfiltrate");
  });
});
