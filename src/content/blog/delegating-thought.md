---
title: "Delegating thought"
description: "LLMs produce output that looks like understanding but isn't. Without solid SDLC practices, they amplify risk rather than productivity."
publishedAt: 2026-05-20
tags: ["ai", "llm", "software-engineering", "engineering-practices"]
draft: true
---

- AMA trap: LLMs produce average meaningful answer. Good for well-trodden problems (sorting, CRUD, regex). Bad for specific problems (your data model, your legacy system, your topology). The more it sounds right, the less you scrutinize.
- Can't evaluate without system understanding: need to know if approach fits architecture, spot hallucinated APIs, recognize security implications, understand tradeoffs. Delegating to LLM because you don't understand the codebase compounds the problem.
- Counterintuitive: LLMs demand better SDLC, not less. Code review catches hallucinated APIs. Tests validate code you didn't write. Architecture docs provide essential context for prompts. CI/CD is the only barrier between "looks plausible" and "in production."
- Treat LLM output like a confident new hire who's never seen your system. Review thoroughly, test ruthlessly, document context.
- Best teams with LLMs: strongest engineering fundamentals. They augment thinking, don't replace it.
