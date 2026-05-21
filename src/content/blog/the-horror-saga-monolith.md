---
title: "The horror saga monolith"
description: "Distributed monoliths and saga patterns that haunt you forever — how to spot the trap and what to do instead."
publishedAt: 2026-05-20
tags: ["architecture", "distributed-systems", "microservices"]
draft: true
---

- Distributed monolith symptoms: coordinated deploys, shared DB beneath service boundary, sync call chains depth-5+, rollback one = rollback five, mandatory shared libraries.
- Root cause: services split on technical layers (auth, data, notification) instead of business capabilities (orders, billing, inventory).
- Horror saga: compiled into service code so every service knows the full workflow, compensation logic missing or stubbed, untestable end-to-end, impossible to observe. Works on happy path, leaves orphaned data on failure.
- Pragmatic path: modular monolith first, extract when you have evidence not a hunch. Eventual consistency + idempotent consumers + reconciliation job often beats a saga. If you must saga, centralized orchestration over choreography.
