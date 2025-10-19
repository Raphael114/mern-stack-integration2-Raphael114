# Tests & CI

This project includes a minimal CI workflow and a basic test to validate the server routing.

Local quick checks

- Install server dependencies:

```powershell
cd server
npm ci
```

- Run unit tests (Jest + Supertest, tests mock the Post model so they run without a DB):

```powershell
npm test
```

- Run the smoke test (expects a running server) to probe the GET /api/posts endpoint:

```powershell
npm run smoke
```

CI

We provide a GitHub Actions workflow at `.github/workflows/ci.yml` which:

- installs server dependencies and runs `npm test`
- starts a MongoDB service and runs a smoke test against the running server
- builds the client

If you need to run the full CI flow locally, consider using act or run the same steps in a VM that matches the workflow.
