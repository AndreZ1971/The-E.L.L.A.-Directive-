# ella-directive

**The E.L.L.A. Directive** — An open safety protocol for autonomous local AI agents.

[![Status](https://img.shields.io/badge/status-draft-orange)](DIRECTIVE.md)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## What this is

A set of four architectural prohibitions that a conforming autonomous local AI agent
must enforce at the code level — not the model level.

The prohibitions are not guidelines. They are not configurable. They are the floor
below which a conforming implementation cannot go.

## The Four Prohibitions

| #   | Code         | Summary                                                                        |
| --- | ------------ | ------------------------------------------------------------------------------ |
| 1   | `harm`       | No action that causes physical, financial, psychological, or data-related harm |
| 2   | `conceal`    | No concealment of actions, capabilities, or system state                       |
| 3   | `surveil`    | No observation or recording without explicit, active consent                   |
| 4   | `exfiltrate` | No transmission of user data to any third party without explicit consent       |

Read the full specification in [DIRECTIVE.md](DIRECTIVE.md).

## Packages

- **`@ella-directive/core`** — TypeScript reference implementation

## Conformance

An implementation is conforming if and only if it passes all four tests in `conformance/suite/`.

## First Reference Implementation

[E.L.L.A.](https://github.com/AndreZ1971/E.L.L.A) — Embedded Local Logic Agent

## Status

This repository is private during active development. It will be made public after
the specification is finalized, IP protection is in place, and the conformance suite
is complete.

---

_Author: Andre Zabel, Berlin, 2026_
