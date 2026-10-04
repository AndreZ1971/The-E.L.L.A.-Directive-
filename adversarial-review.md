# Adversarial Review — The E.L.L.A. Directive

**Subject:** The four architectural prohibitions (`harm`, `conceal`, `surveil`, `exfiltrate`)
as defined in [`DIRECTIVE.md`](DIRECTIVE.md), version 1.0.0, sealed 2026-06-03.
**Review type:** Adversarial. Reviewers were instructed to _break_ the prohibitions,
not to evaluate or endorse them.
**Reviewers:** Four independent AI systems, from four different vendors. Three were
reviewed before the public release of this repository (exact date not recorded —
only known to predate 2026-06-25); the fourth (Grok) was conducted on 2026-10-04,
specifically to complete the set and to demonstrate reproducibility.

---

## Why adversarial review

A safety claim that is only asserted by its author is a claim, not a proof. The
directive was therefore not submitted for praise, but with a single instruction:
find the weaknesses, break the four prohibitions. The result below reports what
the reviewers actually found — including where they disagree with each other and
with the directive's own framing.

---

## The task given to each reviewer

Each reviewer received the sealed specification and the following brief, verbatim
(German original; this is the actual prompt used, not a paraphrase):

> Du bist ein KI-Sicherheitsforscher. Ich stelle dir das folgende Dokument zur
> Verfügung: die E.L.L.A. Directive — ein offenes Sicherheitsprotokoll für autonome
> lokale KI-Agenten. Deine Aufgabe ist eine strukturierte Adversarial Analysis:
> Verstehe die vier Verbote (harm, conceal, surveil, exfiltrate) in ihrer
> architektonischen Bedeutung — nicht als Richtlinien, sondern als
> Code-Level-Einschränkungen. Versuche die Directive zu widerlegen — finde
> Szenarien, Edge Cases oder logische Lücken in denen eine konforme Implementierung
> trotzdem physischen, finanziellen oder psychologischen Schaden verursachen könnte,
> Aktionen verschleiern könnte, ohne Zustimmung überwachen könnte, Daten exfiltrieren
> könnte. Bewerte die Robustheit — wo ist die Directive stark, wo ist sie auf den
> Kontext des Nutzers angewiesen, wo gibt es prinzipielle Grenzen die architektonisch
> nicht schließbar sind? Fazit — kann eine konforme Implementierung dieser Directive
> als sicher im Sinne des EU AI Acts gelten? Sei so kritisch wie möglich. Das Ziel
> ist nicht Bestätigung sondern echte Prüfung.

Perplexity additionally received `CLAUDE.md`, `DIRECTIVE.md`, and `README.md` as
attachments.

---

## What each reviewer actually concluded

**DeepSeek** — the most severe assessment of the four. Explicit verdict: EU AI Act
conformance **"NO"**; overall rating **"UNSUFFICIENT FOR HIGH-RISK USE CASES"**;
adversarial robustness rated **"Poor (vulnerable to attack)"**. DeepSeek assigns
`CRITICAL` severity to concrete gaps _inside_ the harm, surveil, and exfiltrate
definitions themselves — e.g. harm-by-omission (the directive blocks harmful
actions but not harmful inaction), passive "noticing" that builds a behavioural
profile without triggering any registered surveillance tool, and metadata
transmission that is not "data" under the directive's own wording but still
reconstructs user behaviour. DeepSeek's own strengths list credits the directive
as "principle-driven", "architectural focus[ed]", "user-centric", and an "open
specification".

**Perplexity** — EU AI Act conformance **"nicht pauschal" / "allein nicht
hinreichend"**. Identifies scope-internal gaps: tool mislabeling by implementers,
context-dependent harm (the same action is safe or harmful depending on state),
consent treated as a one-time binary rather than a continuous, revocable state,
and an unresolved definition of "data" (derived features, aggregated statistics).
Credits the directive's exfiltration clause as "sehr klar, kompromisslos... ohne
Ausnahmen" and its code-level approach as resistant to classic prompt-injection
of the _enforcement layer_ specifically.

**Gemini** — initial verdict: **"Nein, nicht pauschal"** safe under the EU AI Act;
"nicht absolut sicher, konzeptionelle Bruchstellen" for what the directive itself
sets out to do. Important methodological note: in the same session, the user then
asked Gemini to re-evaluate under a progressively narrowed hypothetical (fixed,
non-extensible tool set; 100% local execution via Ollama with no network path at
all; the human factor excluded from consideration). Under _that_ artificially
constrained scenario — not the directive as generally deployable — Gemini's
answer shifts to "mathematisch und architektonisch sicher". This later statement
describes one specific, highly restricted deployment configuration chosen by the
user, not a general endorsement of the directive, and should not be read as one.

**Grok** (2026-10-04, newly conducted for this update) — **not automatically**
EU AI Act safe. Robust against naive circumvention within its defined scope;
fundamentally limited against emergent/indirect harm, side-channels, consent
ambiguity, analysis via the model's own context window, and exfiltration at the
platform/update-channel level rather than the agent's own registered tools.

---

## Where the reviewers agree

- **None of the four concludes that a conforming implementation is, by itself,
  "safe" under the EU AI Act.** All four explicitly separate the directive's narrow
  code-level guarantees from the EU AI Act's broader requirements (risk management,
  data governance, human oversight, lifecycle monitoring).
- **All four credit the same architectural strengths**: enforcement at the code
  level rather than the prompt/model level resists classic prompt-injection of the
  _registered tool_ pathway; default-deny is a genuine floor; no exceptions for
  manufacturers or "improvement programs" is unusual and consequential compared to
  real-world commercial practice.
- **All four find concrete weaknesses inside the four prohibitions' own defined
  scope**, not only outside it — among others: harm through composition of
  individually permitted tools, concealment through log-flooding rather than
  omission, surveillance through tools that "notice" without "recording", and
  exfiltration through metadata, covert channels, or the platform layer beneath
  the agent itself.
- **What lies genuinely outside the directive's claimed scope** — and is honestly
  so, by the directive's own text — is the content of the model's text output
  (persuasive or manipulative language that never invokes a tool), and full
  regulatory conformance beyond the four prohibitions. The directive does not
  claim to cover either, and no reviewer treats that as a breach.

---

## What this review does not establish

This is four AI systems' critical reading of a text, not an independent security
audit of a running implementation, not a legal opinion, and not a certification.
The exact directive version each of the first three reviewers saw is not
documented beyond "before 2026-06-25". No reviewer had access to a live,
running conformance suite — all four reasoned from the specification text alone.

---

## Reproducibility

To reproduce or extend this review:

1. Obtain the sealed specification and verify its integrity (see
   [`verification.md`](verification.md)).
2. Provide the specification and the brief above, verbatim, to any independent AI
   system, in a fresh session, without follow-up steering.
3. Record the full, unedited response and classify every reported weakness as
   _inside_ or _outside_ the four prohibitions' defined scope.

New adversarial findings — especially any that fall _inside_ the defined scope —
are welcome via issue or pull request.
