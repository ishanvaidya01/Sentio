# Contributing to Sentio

Thanks for helping improve Sentio, a real-time robot telemetry and observability platform. This document covers setup, conventions, and pull-request expectations.

## Code of Conduct

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report unacceptable behavior to ishan.vaidya01@gmail.com.

## Getting Started

1. Fork the repository and clone your fork.
2. Follow the setup instructions in [README.md](README.md#getting-started).
3. Create a branch from `main`:

   ```bash
   git checkout -b feat/alert-rule-shared-templates
   # or
   git checkout -b fix/sse-reconnect-flap
   ```

## Development Checks

Run these before opening a pull request:

- Server: `cd server && npm install && npm run dev` — verify the SSE stream and simulator start.
- Client: `cd client && npm install && npm run dev` — verify charts render live data.
- Exercise the fault-injection buttons and confirm rules, alarms, and the incident log behave.
- Confirm CSV export produces the current schema.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add rule templates for common sensor thresholds
fix: keep SSE connection alive through recovery windows
refactor: extract ring buffer into a dedicated module
docs: document hardware payload schema
chore: bump client dependencies
```

The subject should be in the imperative mood and under ~72 characters.

## Coding Guidelines

- Keep the SSE, rule engine, and simulator as independent modules in the server.
- Hardware-facing payloads must stay flat JSON that an ESP32/Arduino can produce.
- The in-memory ring buffer must remain bounded; never grow history unbounded.
- Keep the client dependency-light; no database on the server without discussion.

## Pull Request Checklist

- [ ] The change is focused on one problem.
- [ ] Simulator → rule → alarm → incident log flow was verified manually.
- [ ] The CSV export schema is unchanged or documented if it changed.
- [ ] No secrets, `.env` files, or build artifacts are included.
- [ ] The PR description explains the change, motivation, and how it was tested.
- [ ] Screenshots or a short recording are attached for UI changes.

## Reporting Bugs and Requesting Features

Use the GitHub issue templates. Include steps to reproduce, expected vs. actual behavior, and environment details.

## Security

Do not open public issues for security problems. Follow [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
