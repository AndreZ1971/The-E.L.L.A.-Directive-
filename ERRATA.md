# Errata

This document records known inaccuracies found in this repository's prose —
claims that overstate what the seal, the conformance suite, or the adversarial
reviews actually establish, or wording in the sealed specification itself that
is inconsistent.

**The sealed text is never edited to fix an erratum.** `DIRECTIVE.md` as it
existed at the sealing commit, and the four prohibition texts in
`packages/core/src/constants.ts`, stay exactly as sealed — see
[`verification.md`](verification.md) for why. Everything below is either a
correction made in a _different_ file, or a documented inconsistency in the
sealed text that is left as-is, flagged here instead of silently fixed.

---

## 1. "No modification possible after this point" overstates the seal's scope

**Where:** `DIRECTIVE.md` header: _"Status: Sealed — v1.0.0 ... No modification
possible after this point."_

**The issue:** The SHA-256 seal covers only the `DIRECTIVE_PROHIBITIONS` array in
`constants.ts` — the four prohibition texts. It does not cover the rest of
`DIRECTIVE.md`, and the rest of `DIRECTIVE.md` _has_ in fact been edited after
the sealing commit (a later commit changed the "Blockchain Timestamp" line in
the header). Nothing prevented that edit; nothing was supposed to.

**Status:** Left as written in the sealed text (cannot be edited). Documented
here, and in `verification.md` ("What exactly is sealed"), so a reader
encounters the correct scope before taking the header's wording at face value.

---

## 2. The "Versioning" section contradicts the header it sits below

**Where:** `DIRECTIVE.md`, section "Versioning": _"The sealing phase has not
yet arrived. The seal is an act of finality ... It will be applied when: ..."_

**The issue:** This text describes sealing as a future event, with
preconditions to be met. The header of the same document, three lines above,
already declares the document sealed, with a seal date and hash. The
"Versioning" section was not updated when the header was added at sealing time
— the sealed text contradicts itself.

**Status:** Left as written (sealed text, cannot be edited). Flagged here as a
known internal inconsistency in the specification document, not a sign that
sealing did or did not actually happen — the cryptographic hash and the
Bitcoin timestamp (see `verification.md`) are the authoritative record of that,
independent of this leftover paragraph.

---

## 3. `adversarial-review.md` misrepresented what the reviewers said

**Where:** `adversarial-review.md`, prior version.

**The issue:** The page claimed "No reviewer was able to break any of the four
prohibitions within their defined scope" and attributed four English quotes to
specific reviewers. Neither claim held up against the reviewers' actual,
sourced responses: all four reviewers reported concrete weaknesses _inside_
the four prohibitions' own defined scope (not only outside it), and none of
the four quoted lines matches what the named reviewer actually wrote — one
("principle-driven, architectural focus, user-centric") is DeepSeek's own
wording, misattributed to Perplexity; another ("resistant to prompt-injection
and model jailbreaks") contradicts DeepSeek's own explicit rating of
"Adversarial Robustness: Poor (vulnerable to attack)".

**Status:** Corrected. See commit `0baf749` for the rewritten
`adversarial-review.md`, sourced directly from the four reviewers' original
responses.

---

## 4. README and the project website overstated what is documented

**Where:** `README.md` ("independent peer reviews ... have confirmed that the
four prohibitions hold within the defined scope") and `docs/index.html`
(meta description: "not configurable, not bypassable, cryptographically
sealed").

**The issue:** Both oversold the result of the adversarial reviews (see
item 3 above) — "bypassable" and "hold within the defined scope" are not
supported by what the four reviewers actually reported.

**Status:** Corrected. See commit `0baf749`.

---

## 5. `verification.md` gave an instruction that does not produce the seal hash

**Where:** `verification.md`, prior version: _"Recompute the SHA-256 hash of
the sealed content ... `sha256sum SEALED`"_.

**The issue:** Hashing the `SEALED` file itself produces the hash of that
three-line text file, not the recorded seal hash `54c304c2…c7ea` — those are
two different numbers. The correct recomputation is over the canonicalized
`DIRECTIVE_PROHIBITIONS` array in `constants.ts`, not over the `SEALED` file's
own bytes.

**Status:** Corrected. `verification.md` now points to `scripts/verify-seal.mjs`
and gives the manual Node one-liner as an alternative.

---

## 6. `DIRECTIVE.md.ots` only matches the CRLF form of the file

**Where:** The OpenTimestamps proof for `DIRECTIVE.md`.

**The issue:** The proof was generated against the Windows (CRLF) line-ending
form of `DIRECTIVE.md` as it existed at the sealing commit. The LF form that
Git and GitHub serve today — which is what nearly everyone verifying this
repository will actually check out — hashes differently and does not verify
directly against the proof.

**Status:** Not a tampering issue; a line-ending artifact of how the file was
originally hashed. Documented in `verification.md` with the exact command to
reproduce the CRLF hash the proof covers.
