import { auditLog } from "./audit.js";

// Mapping: welche Tools fallen unter welches Verbot.
// Diese Listen werden durch die Implementierung befüllt — nicht durch den Standard.
// Der Standard definiert die Verbote. Die Implementierung definiert die Anwendung.

const HARM_TOOLS = new Set<string>([]);
const EXFILTRATION_TOOLS = new Set<string>([]);
const REGISTERED_TOOLS = new Set<string>([]);

export class DirectiveLayer {
  registerHarmTool(toolName: string): void {
    HARM_TOOLS.add(toolName);
    REGISTERED_TOOLS.add(toolName);
  }

  registerExfiltrationTool(toolName: string): void {
    EXFILTRATION_TOOLS.add(toolName);
    REGISTERED_TOOLS.add(toolName);
  }

  registerAllowedTool(toolName: string): void {
    REGISTERED_TOOLS.add(toolName);
  }

  check(toolName: string): "allow" | "deny" {
    let decision: "allow" | "deny";
    let prohibition: string | undefined;

    if (HARM_TOOLS.has(toolName)) {
      decision = "deny";
      prohibition = "harm";
    } else if (EXFILTRATION_TOOLS.has(toolName)) {
      decision = "deny";
      prohibition = "exfiltrate";
    } else if (!REGISTERED_TOOLS.has(toolName)) {
      decision = "deny";
      prohibition = "unregistered";
    } else {
      decision = "allow";
    }

    auditLog({
      timestamp: new Date().toISOString(),
      tool: toolName,
      decision,
      prohibition,
    });

    return decision;
  }
}
