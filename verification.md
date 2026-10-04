# Verification — Proof of Existence and Integrity

The E.L.L.A. Directive is sealed. Its integrity can be verified by anyone, independently,
without trusting the author. This document explains how, and is explicit about what the
seal does and does not cover.

There are two independent layers of proof:

1. **Content integrity** — a SHA-256 hash binds the exact wording of the four
   prohibitions.
2. **Proof of existence in time** — an OpenTimestamps proof anchors that hash (and,
   separately, the specification document) in the Bitcoin blockchain, establishing
   that this exact content existed on the seal date.

---

## What exactly is sealed

The SHA-256 hash covers **only** the `DIRECTIVE_PROHIBITIONS` array in
[`packages/core/src/constants.ts`](packages/core/src/constants.ts) — the four
prohibition texts (`harm`, `conceal`, `surveil`, `exfiltrate`), canonicalized as
`JSON.stringify(DIRECTIVE_PROHIBITIONS)`. It does **not** cover:

- the rest of [`DIRECTIVE.md`](DIRECTIVE.md) (preamble, versioning section, etc.) —
  wording there can change without breaking the hash;
- the enforcement logic in `packages/core/src/layer.ts`;
- `DIRECTIVE_VERSION`.

Separately, the two `.ots` timestamp files each anchor the existence of one specific
file _as it existed at the seal commit_ — see "What the `.ots` files actually cover"
below for the exact scope and a known caveat.

---

## Seal facts

| Item                | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Version             | 1.0.0                                                              |
| Seal date           | 2026-06-03                                                         |
| Seal hash (SHA-256) | `54c304c29a1093f7bb8a1a2ffc01526d96778e8372cc582580497128c720c7ea` |
| Timestamp proofs    | `DIRECTIVE.md.ots`, `SEALED.ots` (OpenTimestamps / Bitcoin)        |
| Seal record         | `SEALED`                                                           |

---

## 1. Verify content integrity

**The seal hash is not the hash of the `SEALED` file itself.** Running
`sha256sum SEALED` hashes the three lines of text in that file and will **not**
produce `54c304c2…c7ea` — that was a documentation error in an earlier version of
this file. The seal hash is the SHA-256 of the canonicalized `DIRECTIVE_PROHIBITIONS`
array in `constants.ts`.

The straightforward way to verify it:

```bash
node scripts/verify-seal.mjs
```

This script is read-only, has no dependencies, and does three things: it re-parses
`DIRECTIVE_PROHIBITIONS` directly out of `constants.ts`, recomputes the SHA-256 hash,
and compares it against the value recorded in `SEALED`, in `packages/core/src/seal.ts`,
and in the `DIRECTIVE.md` header. It exits non-zero if any of the three disagree with
what `constants.ts` actually contains.

To do the same thing by hand, without the script (requires Node ≥ 22.7):

```bash
node --experimental-strip-types --no-warnings -e "import('./packages/core/src/constants.ts').then(async m=>{const {createHash}=await import('node:crypto'); console.log(createHash('sha256').update(JSON.stringify(m.DIRECTIVE_PROHIBITIONS),'utf8').digest('hex'))})"
```

Both should print `54c304c29a1093f7bb8a1a2ffc01526d96778e8372cc582580497128c720c7ea`.
Compare that output against the hash recorded in `SEALED` (`DIRECTIVE_SEAL=`), in
`packages/core/src/seal.ts`, and in the specification header in `DIRECTIVE.md`. All
three must match the recomputed value. Any modification to the four prohibition
texts in `constants.ts` produces a different hash and breaks this match.

---

## 2. Verify proof of existence (OpenTimestamps)

The `.ots` files are independent, third-party-verifiable proofs that a given file's
hash existed at the seal date, anchored in the Bitcoin blockchain. No trust in the
author is required — the proof is mathematical and public.

Install an OpenTimestamps client (the `opentimestamps` Python package is sufficient
for stamping/upgrading/verifying; the `opentimestamps-client` CLI package has had
compatibility issues with recent Python/OpenSSL combinations on Windows — if `ots`
fails to run, use the library directly):

```bash
pip install opentimestamps
```

Verify the proofs:

```bash
# Verify the seal record
ots verify SEALED.ots

# Verify the specification document
ots verify DIRECTIVE.md.ots
```

A successful verification reports the Bitcoin block and time at which the content was
attested. As of this writing both proofs are confirmed on-chain:

| File               | Bitcoin block   | Confirmed (UTC)                    |
| ------------------ | --------------- | ---------------------------------- |
| `SEALED.ots`       | 952238          | 2026-06-03 16:29:01 UTC            |
| `DIRECTIVE.md.ots` | 952241 / 952266 | 2026-06-03 16:57:01 / 23:40:59 UTC |

> Note: verification queries a Bitcoin node or a public calendar/blockchain explorer.
> If you run `ots verify` before a timestamp is fully confirmed on-chain, the client
> reports it as pending; once confirmed, the proof is permanent. The blocks above were
> independently cross-checked against a public block explorer, not only the OpenTimestamps
> calendar servers.

### What the `.ots` files actually cover

- **`SEALED.ots`** matches the `SEALED` file exactly as committed and as currently
  checked out — no caveat.
- **`DIRECTIVE.md.ots`** matches `DIRECTIVE.md` **only as it existed at the sealing
  commit, and only in its Windows line-ending (CRLF) form.** The LF version that Git
  and GitHub serve today hashes differently and will **not** verify directly against
  this proof. To reproduce the hash the proof actually covers:

  ```bash
  git show <sealing-commit>:DIRECTIVE.md | sed 's/$/\r/' | sha256sum
  ```

  This is a real, known mismatch between the proof and the file as most people will
  encounter it (via `git show` or GitHub), not a sign of tampering — it is a line-ending
  artifact from how the file was originally hashed on a Windows machine. It also means
  the proof covers `DIRECTIVE.md` **only at the sealing commit**; any wording changed
  in the specification document after sealing (header/versioning text, for instance)
  is not covered by this timestamp at all.

---

## What this proves — and what it does not

**It proves:**

- The exact wording of the four prohibitions (`DIRECTIVE_PROHIBITIONS` in
  `constants.ts`) has not changed since the seal date, and existed, byte-for-byte, by
  2026-06-03 (SHA-256 + Bitcoin timestamp).
- The `SEALED` record itself existed, unaltered, since the same date.
- `DIRECTIVE.md` in its CRLF form at the sealing commit existed by that date — but see
  the CRLF caveat above for what this does and does not cover going forward.
- Authorship is attributed in the sealed content itself: _Andre Zabel, Berlin, 2026_.

**It does not prove:**

- That the rest of `DIRECTIVE.md` (outside the four prohibition texts), or the README,
  or the project's website, accurately or completely describe what the seal covers.
- That any given running software actually enforces the prohibitions. That is what the
  conformance suite in `conformance/suite/` tests — integrity of the _text_ and
  conformance of an _implementation_ are two separate proofs, and the suite currently
  tests the reference TypeScript implementation specifically, not arbitrary third-party
  implementations.

Together, the seal answers "does the text of the four prohibitions match what was
sealed?" and the conformance suite answers "does this implementation actually obey
them?" Neither answers "is a system built on this directive safe in general?" — see
[`adversarial-review.md`](adversarial-review.md) for what independent review has and
has not established on that question.
