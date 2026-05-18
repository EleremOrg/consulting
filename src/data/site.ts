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

export interface Offering {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  activities: ReadonlyArray<string>;
  outcomes: ReadonlyArray<string>;
  accent: string;
}

export interface Step {
  title: string;
  body: string;
}

export const steps: ReadonlyArray<Step> = [
  {
    title: 'Find the constraint',
    body: 'Every system has bottlenecks that govern its throughput. Elerem finds yours, measures their impact, and clears them.',

  },
  {
    title: 'Standardize the flow',
    body: 'Elerem helps you implement practices and tooling that keep the constraint from shifting back, turning an intervention into a new baseline.',

  },
  {
    title: 'Compound the throughput',
    body: 'Elerem hands your team the framework to keep finding and elevating each successive bottleneck.',

  },
];

export const offerings: ReadonlyArray<Offering> = [
  {
    id: 'delivery',
    eyebrow: 'Delivery Flow',
    title: 'Remove the bottlenecks slowing delivery',
    summary:
      'Delivery slows down long before teams understand why. Fragile releases, coordination overhead, and unclear constraints quietly reduce throughput. Restore flow across engineering so product teams can ship consistently without increasing operational risk.',
    activities: [
      'Identify delivery bottlenecks across architecture, tooling, and team workflows',
      'Reduce deployment friction with reliable CI/CD and testing strategies',
      'Optimize critical systems to improve responsiveness and operational efficiency',
      'Add observability and feedback loops that support faster decision making',
    ],
    outcomes: [
      'Faster lead time for changes',
      'More predictable releases',
      'Reduced operational overhead',
      'Higher engineering throughput',
    ],
    accent: 'from-brand-500 to-brand-700',
  },
  {
    id: 'systems',
    eyebrow: 'Scalable Systems',
    title: 'Build platforms that support growth',
    summary:
      'Growth exposes every hidden constraint inside a platform. Improve reliability, reduce infrastructure waste, and evolve architecture intentionally so scaling the business does not mean slowing the roadmap.',
    activities: [
      'Architecture reviews focused on scalability, reliability, and operational risk',
      'Modernization and migration planning with hands-on implementation',
      'Platform improvements that reduce maintenance and coordination costs',
      'Infrastructure and system design aligned with long-term product growth',
    ],
    outcomes: [
      'Systems that scale without constant rewrites',
      'Lower cloud and infrastructure costs',
      'Fewer production incidents',
      'Faster onboarding for new engineers',
    ],
    accent: 'from-accent-500 to-brand-600',
  },
  {
    id: 'operations',
    eyebrow: 'Engineering Operations',
    title: 'Create engineering organizations built for flow',
    summary:
      'Strong engineering organizations operate with clarity, fast feedback, and predictable execution. Improve delivery metrics, reduce coordination overhead, and create processes that help teams move faster under pressure.',
    activities: [
      'Improve engineering workflows using delivery and reliability metrics',
      'Reduce friction in code review, incident response, and release processes',
      'Strengthen operational practices through mentoring and embedded leadership',
      'Establish feedback loops that improve reliability and team effectiveness',
    ],
    outcomes: [
      'Improved deployment frequency and stability',
      'Faster recovery from incidents',
      'Reduced coordination overhead',
      'Engineering teams that execute with confidence',
    ],
    accent: 'from-accent-500 via-brand-700 to-brand-900',
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
