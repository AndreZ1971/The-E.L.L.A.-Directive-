# ella-directive

**The E.L.L.A. Directive** — An open safety protocol for autonomous local AI agents.

[![Status](https://img.shields.io/badge/status-sealed-green)](DIRECTIVE.md)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](DIRECTIVE.md)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![CI](https://github.com/AndreZ1971/The-E.L.L.A.-Directive-/actions/workflows/ci.yml/badge.svg)](https://github.com/AndreZ1971/The-E.L.L.A.-Directive-/actions/workflows/ci.yml)

## What this is

A set of four architectural prohibitions that a conforming autonomous local AI agent
must enforce at the code level — not the model level.

The prohibitions are not guidelines. They are not configurable. They are the floor
below which a conforming implementation cannot go.

**Why code level, not model level:** four independent AI systems (Gemini, Perplexity,
DeepSeek, Grok), each instructed to attack the directive, converged on the same
assessment of this specific choice — enforcement that lives in code rather than in a
prompt or in trained behaviour resists classic prompt-injection of the registered-tool
pathway in a way model-level alignment does not. That is the directive's actual claim,
and it is the one point none of the four reviewers disputed. See
[adversarial-review.md](adversarial-review.md) for what they did find room to
criticize — no system is 100% secure, and this one is explicit about where its own
edges are.

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

This repository is public. The specification is sealed and the conformance suite passes (4/4). Four independent AI systems (Gemini, Perplexity, DeepSeek, Grok) have conducted adversarial reviews — see [adversarial-review.md](adversarial-review.md) for what they actually found, including genuine weaknesses inside the four prohibitions' own defined scope, not just outside it.

---

_Author: Andre Zabel, Berlin, 2026_
