#!/usr/bin/env node
// scripts/verify-seal.mjs
//
// Read-only integrity check. No dependencies beyond Node's standard library.
// Recomputes the SHA-256 seal hash directly from the prose in
// packages/core/src/constants.ts (by parsing the DIRECTIVE_PROHIBITIONS
// literal as text, not by importing/compiling the .ts file) and compares
// it against the three places the hash is recorded: SEALED, seal.ts, and
// the header of DIRECTIVE.md.
//
// This script changes nothing. It only reports whether the three records
// agree with what constants.ts actually contains.
//
// Usage: node scripts/verify-seal.mjs
// Exit code: 0 if all three match the recomputed hash, 1 otherwise.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readText(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

function extractProhibitions(constantsSrc) {
  const arrayMatch = constantsSrc.match(
    /DIRECTIVE_PROHIBITIONS\s*=\s*\[([\s\S]*?)\]\s*as const;/,
  );
  if (!arrayMatch) {
    throw new Error(
      "Could not locate DIRECTIVE_PROHIBITIONS array in constants.ts — file structure changed?",
    );
  }
  const body = arrayMatch[1];

  const entryPattern =
    /\{\s*id:\s*(\d+)\s*,\s*code:\s*"([^"]+)"\s*,\s*description:\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\}/g;

  const prohibitions = [];
  let m;
  while ((m = entryPattern.exec(body)) !== null) {
    prohibitions.push({
      id: Number(m[1]),
      code: m[2],
      description: m[3],
    });
  }

  if (prohibitions.length === 0) {
    throw new Error(
      "Parsed zero prohibitions out of constants.ts — regex likely out of sync with file format.",
    );
  }

  return prohibitions;
}

function sha256(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function extractSealedFile(sealedSrc) {
  const m = sealedSrc.match(/DIRECTIVE_SEAL=([0-9a-f]+)/);
  return m ? m[1] : null;
}

function extractSealTs(sealTsSrc) {
  const m = sealTsSrc.match(/DIRECTIVE_SEAL\s*=\s*"([0-9a-f]+)"/);
  return m ? m[1] : null;
}

function extractDirectiveMdHeader(directiveMdSrc) {
  const m = directiveMdSrc.match(/\*\*Seal Hash:\*\*\s*([0-9a-f]+)/);
  return m ? m[1] : null;
}

function main() {
  const constantsSrc = readText("packages/core/src/constants.ts");
  const prohibitions = extractProhibitions(constantsSrc);
  const canonical = JSON.stringify(prohibitions);
  const computed = sha256(canonical);

  const sealedHash = extractSealedFile(readText("SEALED"));
  const sealTsHash = extractSealTs(readText("packages/core/src/seal.ts"));
  const directiveMdHash = extractDirectiveMdHeader(readText("DIRECTIVE.md"));

  const checks = [
    ["SEALED", sealedHash],
    ["packages/core/src/seal.ts", sealTsHash],
    ["DIRECTIVE.md (header)", directiveMdHash],
  ];

  console.log("Recomputed hash from constants.ts:");
  console.log(`  ${computed}`);
  console.log("Canonical input (JSON.stringify of parsed prohibitions):");
  console.log(`  ${canonical}`);
  console.log();

  let ok = true;
  for (const [label, hash] of checks) {
    if (hash === null) {
      console.error(`  MISSING   ${label}: could not find a hash in this file`);
      ok = false;
    } else if (hash !== computed) {
      console.error(`  MISMATCH  ${label}: ${hash}`);
      ok = false;
    } else {
      console.log(`  OK        ${label}: ${hash}`);
    }
  }

  if (!ok) {
    console.error(
      "\nSeal verification FAILED. The recorded hash(es) above do not match constants.ts.",
    );
    process.exit(1);
  }

  console.log(
    "\nSeal verification OK. All recorded hashes match constants.ts.",
  );
  process.exit(0);
}

main();
