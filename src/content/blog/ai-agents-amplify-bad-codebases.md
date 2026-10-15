---
title: "AI agents don't fix bad codebases. They amplify them."
description: "AI coding agents multiply throughput on healthy systems and accelerate decay on unhealthy ones. Why engineering foundations matter more than which agent you pick."
publishedAt: 2026-10-15
tags: ["ai", "llm", "technical-debt", "engineering-practices"]
draft: false
cover: "/og/ai-agents-amplify-bad-codebases.png"
coverAlt: "AI agents don't fix bad codebases — they amplify them"
---

There's a pattern showing up in engineering teams right now. Companies want to go faster, so they introduce autonomous coding agents. Within a few months, the velocity charts look great. More pull requests, more code shipped, more tickets closed. And yet, the system is harder to work in than ever.

We've seen versions of this across very different systems, from web applications and data ingestion pipelines to large distributed systems. The details differ, but the underlying pattern is surprisingly consistent. The agent isn't necessarily doing bad work. The problem is that it can produce code faster than the team can understand, review, and maintain it.

AI agents don't remove engineering constraints. They increase the rate at which you encounter them.


## The real constraint isn't code generation

Writing code was rarely the only bottleneck in software development. The harder work is deciding what should exist in the first place, understanding the constraints around it, verifying that it works, and keeping the system comprehensible as it grows. Autonomous coding agents change the economics of implementation. They make producing a plausible solution dramatically cheaper, and in many situations, that's transformative. But they don't make every other part of engineering cheaper by the same amount.

A team can now generate ten changes in the time it previously took to write one. If its ability to review, validate, and integrate those changes hasn't increased accordingly, something has to give. Usually, it's either understanding or reliability. Engineers have less time to investigate the reasoning behind a change, question its assumptions, or consider whether it belongs in the system at all. The work still gets done, but the process that once kept the system coherent begins to fall behind.

The question isn't whether an agent can write the code. It can. The question is whether the system can absorb more code without becoming harder to reason about.

## What agents actually do well

We use LLMs every day, frontier models and open-source ones alike. They're genuinely useful for translating between languages, exploring ideas, generating straightforward code, drafting tests for well-understood behavior, finding bugs when given the right context, and making localized changes inside well-understood boundaries. These are real productivity gains, and there's little reason not to take advantage of them.

The problems begin when the work depends on context that isn't present in the prompt, the repository, or the documentation. Mature systems contain constraints that aren't necessarily written down anywhere. Some are encoded in operational behavior. Some live in the heads of engineers who have spent years maintaining the system. Others exist because of an incident nobody wants to repeat, or because a decision was made years ago for reasons that no longer seem obvious.

An agent can propose a good abstraction, write a good test, or identify a performance problem. The harder question is whether it has enough context to know which abstraction is appropriate, which behavior actually matters, and which performance constraint is real. A technically correct solution can still be the wrong solution for the system it is supposed to improve.

The issue isn't that agents are incapable of making good architectural decisions. It's that architectural decisions often depend on incomplete information, implicit assumptions, and feedback that arrives long after the change has been made. An agent can reason about the information it has, but it cannot reliably account for constraints that remain invisible to it.

## Why this is not a tool complaint

It's tempting to turn this into a debate about which agent is best, which model has the largest context window, or which tool produces the cleanest code. Those differences matter, but they aren't the main point. The underlying problems we've encountered persist across different technology stacks and types of systems: coupling that nobody deliberately chose, boundaries that exist in architecture diagrams but not in the code, performance assumptions that haven't been measured in years, tests that verify implementation rather than behavior, and business rules that exist primarily in the heads of a few engineers.

These problems aren't resolved by writing code faster, nor are they necessarily resolved by giving an agent access to every graph, log, and document available. They require methodical investigation: understanding what the system is actually for, which constraints are real, which are accidental, and which decisions will be expensive to reverse.

An agent is very good at finding a solution to the problem it can observe. The question is whether the problem it can observe is the problem you actually need to solve, and whether the proposed solution will remain viable as the system evolves. When important constraints are missing from the available context, the existing weaknesses of the system become part of the agent's working environment. It may reproduce those weaknesses simply because they are the most readily available patterns to follow.

## How amplification happens

Consider a codebase where responsibilities are already mixed together and boundaries are poorly defined. An agent asked to implement a new feature will naturally look at the surrounding code for guidance. It finds an existing pattern, follows it, and produces a change that works within the immediate context. The implementation may be perfectly reasonable in isolation, yet it adds another dependency or mixes another responsibility into a component that was already doing too much. The agent hasn't necessarily introduced a new architectural problem. It has made the existing one cheaper to reproduce.

The same thing happens with architectural decisions. Once a questionable boundary has been established in code, subsequent changes begin to depend on it. An agent working on the next feature sees that boundary as part of the system it has been asked to modify, and extending the existing structure is often the most straightforward way to satisfy the immediate requirement. Each successful change makes the original decision more established, and fixing it later becomes increasingly expensive because more code now depends on it. Technical debt can accumulate without any individual change looking obviously wrong.

Testing presents a similar problem. Generated tests can be useful, but increasing the number of tests doesn't necessarily increase confidence in the system. A suite can contain hundreds of assertions that confirm what the implementation currently does without checking whether that behavior is correct or desirable. The important question isn't how many tests exist, but whether they protect the behavior the team actually cares about. Does the business rule still hold? Does the API preserve its contract? Does the system fail safely? Does the operation remain within its resource constraints? If the tests don't provide meaningful feedback, generating more of them can create the appearance of safety without delivering much additional assurance.

Over time, understanding and ownership can erode as well. When engineers are already struggling to understand a system, making it possible to produce plausible changes in seconds creates a strong incentive to skip some of that investigation. This doesn't necessarily mean people stop caring. It means the economics of the work have changed, and understanding the system before changing it can begin to feel like an unnecessary delay. The consequences only become obvious when something breaks and someone has to reconstruct the reasoning behind a change that nobody fully understood in the first place.

As changes arrive faster than engineers can meaningfully review them, pull requests risk becoming approval mechanisms rather than engineering discussions. The question shifts from whether a change is the right thing to build to whether it looks reasonable and the tests pass. The system continues to evolve, but fewer people are actively steering its direction. That's when increased output can start working against long-term maintainability.

## The temporary fix that became permanent
We've seen this pattern with temporary fixes that gradually become part of the architecture. Imagine a slow execution path, and an agent asked to improve its performance. It proposes adding a caching layer. The change works, the tests pass, and the immediate symptom improves. The team moves on to the next task.

Caching might be exactly the right solution. But if nobody investigates why the path is slow, the cache can conceal the underlying problem while introducing new complexity around invalidation, consistency, duplicated logic, and operational behavior. The original bottleneck remains, the workaround becomes infrastructure, and subsequent changes have to account for another layer of complexity that might never have been necessary.

The problem wasn't that someone wrote the cache. It was that the team optimized the visible symptom without understanding the system underneath it. The agent helped produce a solution to the immediate problem, but the team never established whether that problem was the one it should have been solving.

This is where autonomous coding agents can amplify existing engineering weaknesses. When the organization rewards immediate results and lacks the time or feedback mechanisms to investigate root causes, agents make it easier to keep adding solutions without revisiting the assumptions behind them.

## When more output becomes less progress

Suppose an agent doubles the amount of code your team can produce. That sounds like a productivity improvement, but what happens if review time doubles, integration failures increase, changes require more follow-up fixes, and engineers spend longer trying to understand unfamiliar code? What happens if production incidents take longer to diagnose because the system has become harder to reason about?

The bottleneck hasn't disappeared. It has moved.

This is why code volume and pull-request throughput are insufficient measures of AI productivity. They tell you how quickly the team produces changes, not whether those changes improve the system or make future work easier. The more useful question is whether the entire path from idea to safe production change has improved.

If autonomous coding agents are genuinely making your engineering organization faster, you should expect more than increased output. You should look at how long changes take to review, how often they need to be reverted or corrected, how reliably tests and CI provide feedback, how quickly production problems can be diagnosed, and how often apparently local changes affect unrelated parts of the system. These measures help reveal whether the team is actually becoming more effective or simply producing work faster than it can validate it.

The tell isn't necessarily an immediate increase in bug count. It's more output accompanied by less confidence. When nobody can properly review a change, the team isn't necessarily shipping faster. It's shipping more frequently into a system that fewer people fully understand.

That's where the compounding starts.

## What an AI-ready engineering system looks like

This is why we think AI adoption is primarily an engineering-systems problem, not a licensing decision. An AI-ready system isn't one where every engineer has access to the latest model. It's one where the system provides enough structure, information, and feedback for both humans and agents to make changes safely.

Clear boundaries are a good starting point. Components should have responsibilities that are meaningful in the code, not just in an architecture diagram, and engineers should be able to determine what belongs where and which dependencies are intentional. If everything can call everything else, an agent has little reason not to continue doing exactly that. A system with clear boundaries gives the agent a structure to work within and makes the consequences of a proposed change easier to evaluate.

Feedback matters just as much. Agents can produce changes in seconds, but if tests take 45 minutes to run, integration tests are unreliable, or CI frequently fails for unrelated reasons, generation speed doesn't translate directly into engineering speed. The team is producing changes faster than it can determine whether they are good. Reliable tests, fast validation, and meaningful observability allow the organization to benefit from faster implementation without sacrificing its ability to detect problems.

The same principle applies to testing and observability. A useful test suite describes behavior the team wants to preserve, rather than merely confirming the implementation that happens to exist today. Observability makes it possible to investigate why something is slow, where a failure originates, what changed, and how a dependency behaves under load. Without that information, both humans and agents are operating with incomplete context. AI doesn't eliminate the need for observability; it increases the value of having it.

Finally, humans need to retain ownership of consequential decisions. This doesn't mean manually reviewing every line an agent writes or refusing to automate complex work. It means recognizing that decisions about domain boundaries, data models, public APIs, concurrency, persistence, security, and infrastructure can have consequences that are expensive to reverse. Agents can help investigate these decisions, compare alternatives, and implement the chosen approach. But a passing test suite isn't a substitute for understanding the trade-offs or deciding whether the design is appropriate.

The more expensive a decision is to reverse, the less appropriate it is to evaluate purely through fast automated feedback.

These aren't new engineering principles invented for the age of AI. They're the foundations of maintainable software. Autonomous coding agents simply make the cost of neglecting them more visible.

## AI is a multiplier, not a foundation

The question for an engineering team isn't whether an AI agent can write more code. It can. The question is whether the system can absorb more code without becoming harder to understand, validate, and change.

On a healthy engineering foundation, autonomous agents can be a powerful multiplier. Clear boundaries give them a structure to work within, good tests provide feedback, observability makes problems easier to investigate, and clear ownership prevents consequential decisions from becoming accidental.

On an unhealthy foundation, the same capabilities can accelerate the opposite outcomes: more coupling, more workarounds, more code nobody understands, and more confidence than the system has earned. The agent isn't deciding whether your foundation is sound. It's increasing the rate at which you build on it.

If your team adopted autonomous coding agents and output went up while delivery became less predictable, that's a signal to look at the engineering system underneath the tooling.


---

If your team adopted AI tooling and delivery got *less* predictable instead of more, [get in touch](/contact) — identifying the constraint that's actually slowing you down is exactly what we do.

<!-- If you want the practical side, the checklist in [What makes a codebase AI-ready?](/blog/what-makes-codebase-ai-ready) covers what to put in place first. -->
