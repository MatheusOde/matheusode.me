# Analytics decision

Analytics is deliberately disabled for the initial implementation. No provider account, endpoint, cost, retention policy or publication configuration has been supplied. The static site makes no analytics requests and adds no tracking cookies.

The typed adapter in src/lib/analytics.ts accepts only work_case_opened, email_contact_clicked, linkedin_clicked, resume_downloaded and article_opened. It generates only {name}; never URLs, query parameters, referrers, identities or free text. Links carry fixed data-event attributes.

Before enabling a provider (e.g. a privacy-configured Umami instance), document endpoint ownership, IP handling/anonymization, retention, cookie behavior and opt-out. Wire the adapter once, verify single events in staging, and review the provider’s automatically collected fields. Do not assume that an event-only local payload prevents provider-side collection. No provider is provisioned by this implementation.
