---
title: "Shipping reliability as a product feature"
description: "Reliability isn't an infra concern — it's a product feature customers pay for. Here's how we frame SLOs, error budgets, and incident reviews for product teams."
publishedAt: 2026-02-05
tags: ["reliability", "slo", "product-engineering"]
draft: true
---

Reliability conversations usually live in the infra team. That's a mistake. For anything customers depend on — payments, auth, data pipelines — reliability is a product feature, and it deserves the same discovery, prioritization and iteration loop as any other.

## Start with what the customer experiences

SLOs built from server-side success rates rarely match what the user actually feels. We prefer end-to-end probes that mimic the critical user journey: log in, perform the core action, read the result.

## Error budgets turn reliability into a tradeoff

When a team has 0.1% of monthly downtime to spend, suddenly they care *how* they spend it. Deploy freezes stop being political and start being mathematical.

## Make incident reviews cheap and frequent

Long blameless postmortems with 40 action items rarely produce change. Short, focused reviews — one lesson, one owner, one deadline — compound. Over a year, you build an organization that genuinely learns.
