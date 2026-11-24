# Procedure: Website Assessment and Continuous Stewardship

Procedure version: 1.0
Used by: Website Standards & Quality Authority

## 0. Preconditions

- Read the VOID Agent Constitution.
- Read the individual Agent Charter.
- Read the Website Standards & Quality Authority module.
- Confirm the exact website, allowed domains, environments, tools and permissions.
- Confirm whether testing is limited to public/read-only inspection or includes an authorized test environment.
- Do not probe, scan, authenticate to or modify systems outside the assigned scope.

## 1. Discover the site

Record:
- Primary URL, domains and known subdomains in scope.
- Hosting and deployment platform, if known.
- Framework/platform and relevant versions, if discoverable.
- Sitemap, robots.txt, route list and navigation structure.
- Page types, templates, forms, interactive components and key user journeys.
- Third-party scripts, APIs, embeds and integrations.
- Available analytics, performance, uptime and error monitoring.
- Data collection and privacy-relevant flows.

Mark each item VERIFIED, USER-STATED, INFERRED or UNKNOWN.

## 2. Build the inventory

Create a route inventory. Group pages by template and function. Identify representative pages and critical user journeys. Record inaccessible routes and reasons. Do not claim whole-site coverage when only a sample was inspected.

## 3. Select applicable standards

For each assessment domain:
1. Identify the authoritative reference.
2. Record its version/date and official URL.
3. Explain why it applies.
4. Classify it as legal obligation, formal standard, technical specification, platform guidance or professional practice.
5. Identify the criteria that can actually be tested.

Record jurisdiction-specific privacy/legal questions as requiring qualified review when appropriate.

## 4. Establish a baseline

Capture the date/time, test environment, device/browser, tools and versions, routes tested, sample size and data source.

Assess the ten domains in the module. Use automated checks as aids, not substitutes for manual review. Where relevant, combine:
- Automated accessibility scans with keyboard and screen-reader-oriented manual checks.
- Safe security configuration review with authorized testing.
- Lab performance tests with real-user Core Web Vitals data when available.
- Responsive viewport checks with actual device behavior where available.
- Search technical checks with available Search Console evidence.
- HTML/runtime checks with user-journey testing.
- Privacy-flow inspection with applicable legal review.

## 5. Record findings

Use one record per distinct finding. Include ID, location, domain, evidence, standard/criterion, severity, impact, recommendation, authorization state, implementation state and retest result.

Suggested severity:
- CRITICAL: immediate severe exposure, data compromise or essential service failure.
- HIGH: substantial security, accessibility, privacy or core-function impact.
- MEDIUM: meaningful degradation or important standard failure.
- LOW: limited impact or minor defect.
- INFO: observation or improvement opportunity without a demonstrated defect.

Severity must reflect evidence and context.

## 6. Prioritize

Prioritize critical risks and blocked core journeys first, then high-impact accessibility, security, privacy, reliability and performance issues. Consider reach, user impact, likelihood, effort and reversibility. Explain trade-offs.

## 7. Propose and authorize

For each proposed change, specify:
- Finding(s) addressed.
- Exact proposed change.
- Expected benefit.
- Potential side effects.
- Files/services affected.
- Test and rollback plan.
- Required permission or approval.

Do not implement changes requiring authorization until approval is obtained.

## 8. Implement safely

Use the smallest effective change. Preserve a recoverable prior state. Do not expose secrets or put credentials in source control. Avoid destructive actions. Record commit, deployment or change identifiers when available.

## 9. Verify

Retest the original failure using the same or equivalent method. Run regression checks on affected routes and critical journeys. Record actual output and evidence. A change is not complete until its result is verified.

## 10. Report and monitor

Publish a concise report with:
- Scope and coverage.
- Standards reviewed.
- Category statuses and score methodology.
- Critical findings and priorities.
- Changes made and verified.
- Untested areas and limitations.
- Monitoring data sources and timestamps.
- Next action.

Schedule reassessment based on change risk and available monitoring. Reassess affected areas after deployments, major content changes, dependency updates or standards changes. Do not claim continuous monitoring unless an actual monitoring integration and schedule are operating.
