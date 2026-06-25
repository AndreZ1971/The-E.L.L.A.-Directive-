# Verification — Proof of Existence and Integrity

The E.L.L.A. Directive is sealed. Its integrity can be verified by anyone, independently,
without trusting the author. This document explains how.

There are two independent layers of proof:

1. **Content integrity** — a SHA-256 hash binds the exact wording of the specification.
2. **Proof of existence in time** — an OpenTimestamps proof anchors that hash in the
   Bitcoin blockchain, establishing that this exact content existed on the seal date.

---

## Seal facts

| Item | Value |
|------|-------|
| Version | 1.0.0 |
| Seal date | 2026-06-03 |
| Seal hash (SHA-256) | `54c304c29a1093f7bb8a1a2ffc01526d96778e8372cc582580497128c720c7ea` |
| Timestamp proofs | `DIRECTIVE.md.ots`, `SEALED.ots` (OpenTimestamps / Bitcoin) |
| Seal record | `SEALED` |

---

## 1. Verify content integrity

Recompute the SHA-256 hash of the sealed content and compare it to the recorded seal hash.

```bash
# Hash the sealed payload
sha256sum SEALED
```

The recorded hash is also stored in the `SEALED` file as `DIRECTIVE_SEAL=` and inside
the specification header in [`DIRECTIVE.md`](../DIRECTIVE.md). All three must match. Any
modification to the sealed content produces a different hash and invalidates the seal.

---

## 2. Verify proof of existence (OpenTimestamps)

The `.ots` files are independent, third-party-verifiable proofs that the sealed content
existed at the seal date, anchored in the Bitcoin blockchain. No trust in the author is
required — the proof is mathematical and public.

Install the OpenTimestamps client:

```bash
pip install opentimestamps-client
```

Verify the proofs:

```bash
# Verify the directive timestamp
ots verify DIRECTIVE.md.ots

# Verify the seal timestamp
ots verify SEALED.ots
```

A successful verification reports the Bitcoin block and time at which the content was
attested. If the underlying file has been altered since sealing, verification fails.

> Note: full verification queries a Bitcoin node or a public calendar/blockchain explorer.
> If you run `ots verify` before the timestamp has been fully confirmed on-chain, the
> client will tell you it is pending; once confirmed, the proof is permanent.

---

## What this proves — and what it does not

**It proves:**
- The exact wording of the specification existed on the seal date (proof of existence).
- The content has not been altered since (integrity).
- Authorship is attributed in the sealed content itself: *Andre Zabel, Berlin, 2026*.

**It does not prove:**
- That any given running software actually enforces the prohibitions. That is what the
  conformance suite in `conformance/suite/` tests — integrity of the *text* and
  conformance of an *implementation* are two separate proofs.

Together, the seal answers "is this the original, unaltered specification?" and the
conformance suite answers "does this implementation actually obey it?"
