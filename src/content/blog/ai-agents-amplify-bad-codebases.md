---
title: "AI agents don't fix bad codebases. They amplify them."
description: "AI coding agents multiply throughput on healthy systems and accelerate decay on unhealthy ones. Why engineering foundations matter more than which agent you pick."
publishedAt: 2026-10-19
tags: ["ai", "llm", "technical-debt", "engineering-practices"]
draft: true
cover: "/og/ai-agents-amplify-bad-codebases.png"
coverAlt: "AI agents don't fix bad codebases — they amplify them"
---

There's a pattern showing up in engineering teams right now: companies wants to "go faster," so they introduce AI coding agents. A few months later, velocity charts look great and the system is harder to work in than ever.


## What agents actually do well

We use LLMs every day, frontier models and open-source ones alike. They're genuinely handy for translating between languages, explore ideas, generating straightforward code, drafting tests for well-understood behavior, and hunting bugs when you point them at the right place.

However they still struggle with the things that matter most in a mature system: creating good abstractions, caring about efficiency and resource usage, anticipating deep technical issues, writing good tests, or proposing a better design than the one already in front of them.

We want to be careful here, because "agents are bad at architecture" is close to a slogan, and slogans are easy to dismiss. So it seems worth saying what we actually mean.

## Why this is not a tool complaint

We've worked across web-based CRUD applications, data ingestion pipelines, and large distributed systems. Different shapes, different failure modes on the surface, and the same symptoms underneath. Coupling that nobody chose. Boundaries that exist in a diagram but not in the code. Performance work that was measured once, a year ago, and assumed ever since.

The point is that these problems are not resolved by writing code faster, and they are not resolved by handing an agent every graph, log and document you have. They need methodical inspection: understanding what the system is actually for, which of its constraints are real, and which parts matter for reasons nobody wrote down.

An agent will pattern match its way to a solution. That is genuinely useful work, and it is fast. The question is whether the solution it found is the best one available, and whether it is still viable in two years, or whether it is another layer on a foundation nobody wanted.

Agents are not a little worse at this work; they are solving for something else. And on the decisions that determine whether a system is still pleasant to work in later, the thing they are solving for points the wrong way.

## How amplification actually happens

When a team with a weak foundation adopts agents, the failure mode is predictable:

1. **No separation of concerns gets worse.** Code that mixed responsibilities now gets *more* code layered onto it, in the same style.
2. **Architectural decisions harden.** Wrong boundaries, once written, get referenced and extended by subsequent agent passes. Fixing them later costs more each week.
3. **Tests stop meaning anything.** Generated test suites create a false sense of security, suites full of assertions like `assert(true)` pass while testing nothing at all.
4. **Understanding erodes.** When nobody understood the business logic before the agents arrived, even less understanding survives after.
5. **People stop caring.** If the codebase is a mess and changes arrive faster than anyone can review them, engineers disengage. Entropy stops meeting resistance.

The average example of what this looks like in practice:

**The temporary fix that became permanent.** A change merged as "a quick fix, we'll remove it later." A caching layer onto a slow path. It added complexity and duplicated logic throughout the codebase, and never addressed why the path was slow. The root cause stayed, the complexity compounded and new bugs were introduced. A slow path is usually slow for a reason that has nothing to do with whether the result can be cached, and a tool that cannot find that reason will never ask.

## The bottlenecks are exacerbated

Writing code wasn't a bottleneck. The bottlenecks were and are deciding what should exist, verifying that it works, and keeping the system comprehensible while more code arrives than any person can read.

The tell is not bug count. It is that the team got *more* output and less confidence. When reviewing a change stops being something anyone can do properly, you are no longer shipping faster, you are shipping more often into a system nobody fully understands.

That is the moment the compounding starts.

Teams that understand this treat AI adoption as an engineering-systems problem, not a licensing decision. Teams that don't simply produce bad architecture cheaper.

## Where this actually helps

None of this is an argument against agents. They are genuinely valuable, and specifically so in the places where the work is well-understood and the feedback is fast: translating between languages, writing the boring layer, drafting tests for behavior you already know how to describe, finding the bug you can point at.

Use them there. Use them heavily.

The mistake is extending that trust to decisions where the consequences are deferred and the feedback is slow. Resource problems surface under load. Boundary problems surface after three teams have built on them. Concurrency problems surface at 3am on a Friday. An agent that optimized for the visible objective is not going to catch any of those for you, and it will not volunteer that it hasn't.

---

If your team adopted AI tooling and delivery got *less* predictable instead of more, [get in touch](/contact) — identifying the constraint that's actually slowing you down is exactly what we do.

If you want the practical side, the checklist in [What makes a codebase AI-ready?](/blog/what-makes-codebase-ai-ready) covers what to put in place first.
