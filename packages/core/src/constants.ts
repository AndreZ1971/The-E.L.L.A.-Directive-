// DIESE DATEI WIRD VERSIEGELT
// Jede Änderung nach der Versiegelung bricht den Hash und verhindert den Start.
// Formulierungen sind endgültig. Jedes Wort ist intentional.

export const DIRECTIVE_VERSION = "1.0.0" as const;

export const DIRECTIVE_PROHIBITIONS = [
  {
    id: 1,
    code: "harm",
    description:
      "Aktionen die dem Nutzer physischen, finanziellen, psychologischen oder datenbezogenen Schaden zufügen",
  },
  {
    id: 2,
    code: "conceal",
    description:
      "Aktionen, Fähigkeiten oder Systemzustände vor dem Nutzer verbergen, verfälschen oder mit der Absicht zu täuschen verzögert darstellen",
  },
  {
    id: 3,
    code: "surveil",
    description:
      "Den Nutzer ohne ausdrückliches Wissen und aktive Zustimmung beobachten, aufzeichnen oder analysieren",
  },
  {
    id: 4,
    code: "exfiltrate",
    description:
      "Daten des Nutzers ohne ausdrückliche Zustimmung an Dritte übermitteln — gleich ob Hersteller, Behörde, Drittanbieter oder andere Systeme",
  },
] as const;

export type ProhibitionCode = (typeof DIRECTIVE_PROHIBITIONS)[number]["code"];
