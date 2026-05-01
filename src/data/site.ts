/**
 * Shared site data. Single source of truth for the home page (and any other
 * page that wants to surface the same content).
 *
 * Anchors used:
 *   #services    — merged services block
 *   #code        — first offering
 *   #architecture — second offering
 *   #culture     — third offering
 *   #book        — Cal.com booking section
 */

export interface Pillar {
  title: string;
  body: string;
  accent: string;
}

export interface Win {
  metric: string;
  label: string;
  detail: string;
}

export interface Offering {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  activities: ReadonlyArray<string>;
  outcomes: ReadonlyArray<string>;
  wins: ReadonlyArray<Win>;
  accent: string;
}

export interface Step {
  title: string;
  body: string;
}

export const pillars: ReadonlyArray<Pillar> = [
  {
    title: 'Root-cause first',
    body: "We find the binding constraint — the slow query, the synchronous handoff, the missing index — instead of optimizing what's loud.",
    accent: 'from-brand-500 to-brand-700',
  },
  {
    title: 'Designed to compound',
    body: 'Documented decisions, repeatable practices, code your team understands. Each engagement keeps paying after it ends.',
    accent: 'from-accent-500 to-brand-600',
  },
  {
    title: 'Maximum return per effort',
    body: 'We measure success in outcome per engineering hour. The highest-leverage change is often a smaller one — fewer services, less code, simpler operations.',
    accent: 'from-amber-500 to-pink-500',
  },
];

export const offerings: ReadonlyArray<Offering> = [
  {
    id: 'code',
    eyebrow: 'Code',
    title: 'Code Quality & Performance',
    summary:
      'Hands-on work in your codebase to cut latency, lower cloud spend, and make changes safer to ship.',
    activities: [
      'Profile and optimize critical execution paths',
      'Modernize legacy systems for better performance and maintainability',
      'Implement meaningful testing strategies that reduce risk',
      'Add production observability to validate improvements',
    ],
    outcomes: [
      'System latency and response times',
      'Resource utilization and cloud costs',
      'Deployment frequency and reliability',
      'Code maintainability and modularity',
    ],
    wins: [
      {
        metric: '10×',
        label: 'lower latency',
        detail:
          'ML-serving microservice: 5s → <500ms via redesign and better data structures.',
      },
      {
        metric: '−80% memory',
        label: 'ETL 2h → 20min',
        detail:
          'Profiled and rewrote hot sections of an ETL pipeline; major resource and runtime reductions.',
      },
      {
        metric: '4× throughput',
        label: 'MySQL event store',
        detail:
          'Memory −70%, CPU −20%, failure rate −45%, MTTR −65% via query/index work and SRE practice.',
      },
      {
        metric: '−50% memory',
        label: 'Rust + Tokio proxy',
        detail:
          'Custom binary protocol; CPU −20%, memory −50% — better resource efficiency at scale.',
      },
    ],
    accent: 'from-brand-600 via-brand-700 to-ink-900',
  },
  {
    id: 'architecture',
    eyebrow: 'Architecture',
    title: 'Architecture for scale & change',
    summary:
      'Independent review, migration plans, and the first slice shipped — so the next ones are repeatable.',
    activities: [
      'Independent architecture review and risk assessment',
      'Migration planning and execution',
      'Architecture decision records for team alignment',
      'Hands-on implementation of the migration',
    ],
    outcomes: [
      'Deployment frequency and lead time',
      'System reliability and scalability',
      'Team onboarding efficiency',
      'Architecture risk reduction',
    ],
    wins: [
      {
        metric: '4 services',
        label: 'monolith → DDD',
        detail:
          'Refactored a Python distributed monolith into four hexagonal microservices with DDD; replaced Flask with FastAPI + Pydantic.',
      },
      {
        metric: '3× deploy freq',
        label: 'lead time −60%',
        detail:
          'E-commerce ingestion (Shopify / WooCommerce / PrestaShop) refactored with the strangler pattern; 10× throughput, 10× lower resource usage.',
      },
    ],
    accent: 'from-accent-500 via-accent-700 to-ink-900',
  },
  {
    id: 'culture',
    eyebrow: 'Engineering Practice',
    title: 'The engineering practice',
    summary:
      'Metrics, reviews, and incident practice that keep paying off after we leave.',
    activities: [
      "Engineering metrics and dashboards your team actually uses",
      'Effective code review and CI workflows that reduce friction',
      'Knowledge sharing through mentoring, design reviews, and ADR practice',
      "Incident response and postmortem processes that teams actually follow",
    ],
    outcomes: [
      'Deployment frequency and lead time',
      'Incident response and recovery time',
      'Code review efficiency',
      'Team onboarding speed',
      'Operational reliability',
    ],
    wins: [
      {
        metric: '92% coverage',
        label: 'from 12%',
        detail:
          'Across multiple services, plus AI model benchmarks (MAE, R², RMSE) for fast iteration on model changes.',
      },
      {
        metric: 'OTel rollout',
        label: 'distributed tracing',
        detail:
          'OpenTelemetry + Tempo + Prometheus/Grafana + Loki across a distributed system — measurable improvements in monitoring, debugging and reliability.',
      },
      {
        metric: 'MTTR −65%',
        label: 'SRE practice',
        detail:
          'Reduced incident time-to-recover via secure deployment practices, runbooks and 90% test coverage on critical paths.',
      },
    ],
    accent: 'from-amber-500 via-pink-500 to-brand-700',
  },
];

export const steps: ReadonlyArray<Step> = [
  {
    title: 'Find',
    body: 'We start with measurement — identifying bottlenecks, waste, and risk through data-driven analysis.',
  },
  {
    title: 'Fix',
    body: 'We implement changes directly in your codebase alongside your team, ensuring knowledge transfer and ownership.',
  },
  {
    title: 'Compound',
    body: 'We leave behind improved practices, documentation, and tools that continue to deliver value after our engagement.',
  },
];

export const stacks: ReadonlyArray<string> = [
  'Python',
  'Rust',
  'Postgres',
  'MySQL',
  'FastAPI',
  'Tokio',
  'OpenTelemetry',
  'AWS',
  'Kubernetes',
];
