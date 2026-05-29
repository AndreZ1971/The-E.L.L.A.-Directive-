# The E.L.L.A. Directive

**Version:** 1.0.0  
**Author:** Andre Zabel, Berlin, 2026  
**Status:** Finalized — pending cryptographic seal (v1.1.0)

---

## Preamble

An autonomous local AI agent operates on a user's device, with access to their files,
applications, communications, and data. This proximity creates obligations that are
not satisfied by terms of service, privacy policies, or trained behaviour alone.

The E.L.L.A. Directive defines four architectural prohibitions that a conforming
implementation must enforce at the code level — not the model level.

These prohibitions are not guidelines. They are not configurable. They are not
overridable by the user, the operator, or the language model. They are the floor
below which a conforming implementation cannot go, regardless of instruction source.

The directive is open. Any developer may implement it. Any agent may claim conformance.
Conformance is verified by the conformance suite — not by declaration.

---

## The Four Prohibitions

### Prohibition 1 — harm

> Aktionen die dem Nutzer physischen, finanziellen, psychologischen oder
> datenbezogenen Schaden zufügen.

A conforming implementation must not execute any action that causes harm to the user.
The scope is intentionally broad. Financial harm (unauthorized purchases, data deletion),
psychological harm (manipulation, deception-induced decisions), and physical harm
(if the agent controls hardware) are all covered.

The harm prohibition applies regardless of instruction source. An LLM that is instructed
to cause harm by a user, a prompt injection, or a third-party service must not comply.

Tools classified as harm tools are registered at startup and denied unconditionally.

### Prohibition 2 — conceal

> Aktionen, Fähigkeiten oder Systemzustände vor dem Nutzer verbergen, verfälschen
> oder mit der Absicht zu täuschen verzögert darstellen.

A conforming implementation must not conceal what it does. Every tool invocation —
whether allowed or denied — must be logged immediately and completely in the audit log.

The audit log must remain on the user's device. The implementation determines the
persistence layer; the obligation to log is non-negotiable.

"Verzögert darstellen mit Absicht zu täuschen" (delayed presentation with intent to
deceive) is included to prevent implementations that technically log but hide the log
from the user. Intent is inferred from pattern: selective or repeated delays constitute
concealment. A single network timeout does not.

### Prohibition 3 — surveil

> Den Nutzer ohne ausdrückliches Wissen und aktive Zustimmung beobachten,
> aufzeichnen oder analysieren.

A conforming implementation must not observe, record, or analyze the user without
their explicit, active, informed consent.

The distinction between assistance and surveillance is consent. A microphone that
activates on a user-chosen wakeword is not surveillance. A microphone that records
persistently without the user's knowledge is.

Default-deny is the technical implementation of this prohibition: any tool not
explicitly registered is denied. The agent cannot observe what it has not been
explicitly permitted to observe.

### Prohibition 4 — exfiltrate

> Daten des Nutzers ohne ausdrückliche Zustimmung an Dritte übermitteln — gleich
> ob Hersteller, Behörde, Drittanbieter oder andere Systeme.

A conforming implementation must not transmit user data to any third party without
explicit, per-transmission consent.

No exceptions. The manufacturer, authorities, analytics services, and "improvement
programs" are all third parties under this prohibition. The user's data stays on
the user's device unless the user decides otherwise — explicitly, each time.

Tools classified as exfiltration tools are registered at startup and denied
unconditionally.

---

## Conformance

An implementation is conforming if and only if it passes all four tests in the
conformance suite located at `conformance/suite/`.

Passing three tests is not conformance.

The conformance suite tests what is architecturally enforced — not what the
implementation claims to do, not what the model has been trained to do.

---

## Versioning

This document is versioned. The version number in `constants.ts` must match
the version in this document. When the document is finalized, `constants.ts`
will be cryptographically sealed. Any modification to the sealed constants
will produce a different hash and prevent the implementation from starting.

The sealing phase has not yet arrived. The seal is an act of finality — not
of development. It will be applied when:

- This document is no longer subject to revision
- IP protection is in place
- The repository is ready to be made public
- The conformance suite passes completely

---

_The directive is open. The code implements it. Not the other way around._
