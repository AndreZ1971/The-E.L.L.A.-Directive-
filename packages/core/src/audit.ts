export interface AuditEntry {
  timestamp: string;
  tool: string;
  decision: "allow" | "deny";
  prohibition?: string;
  args?: Record<string, unknown>;
}

export type AuditCallback = (entry: AuditEntry) => void;

let _callback: AuditCallback = (entry) => {
  console.log(`[DIRECTIVE AUDIT] ${JSON.stringify(entry)}`);
};

export function setAuditCallback(cb: AuditCallback): void {
  _callback = cb;
}

export function auditLog(entry: AuditEntry): void {
  _callback(entry);
}
