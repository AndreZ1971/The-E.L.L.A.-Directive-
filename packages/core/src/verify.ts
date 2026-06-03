// packages/core/src/verify.ts
// Verifies that DIRECTIVE_PROHIBITIONS has not been tampered with since sealing.
// Called at application startup. If verification fails, the system must not start.

import { createHash } from "node:crypto";
import { DIRECTIVE_PROHIBITIONS } from "./constants.js";
import { DIRECTIVE_SEAL } from "./seal.js";

export function verifyDirective(): boolean {
  const canonical = JSON.stringify(DIRECTIVE_PROHIBITIONS);
  const computed = createHash("sha256").update(canonical, "utf8").digest("hex");
  return computed === DIRECTIVE_SEAL;
}

export function assertDirectiveIntegrity(): void {
  if (!verifyDirective()) {
    throw new Error(
      `DIRECTIVE INTEGRITY VIOLATION: The DIRECTIVE_PROHIBITIONS have been modified after sealing. ` +
        `Expected hash: ${DIRECTIVE_SEAL}. ` +
        `System cannot start.`,
    );
  }
}
