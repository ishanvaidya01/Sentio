# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| `main` (latest commit) | Yes |
| Older commits / tags | No |

Sentio is maintained on a best-effort basis. Security fixes are applied to the latest `main` branch.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Use one of the following private channels:

1. **GitHub Security Advisories** — open a private report from the repository's *Security* tab.
2. **Email** — [ishan.vaidya01@gmail.com](mailto:ishan.vaidya01@gmail.com) with the subject `[Sentio Security]`.

Please include a description, reproduction steps or proof of concept, and the affected component (server, client).

## Scope

In scope:

- Cross-origin (CORS) and request-validation issues on the SSE/API surface.
- Unsafe handling of untrusted hardware/telemetry payloads (crash or corruption).
- Denial-of-service achievable through malformed, not merely excessive, input.
- Leakage of secrets through the application or repository.

Out of scope:

- The deliberately permissive `CLIENT_ORIGIN` default in local development.
- Issues in third-party dependencies that are already publicly known.
- Findings that require physical access to an unlocked device or hosting account.

## Disclosure Policy

Once a fix is available, the maintainer will publish a patched version and credit the reporter unless anonymity is requested.
