# ClinicFlow AI - source handover

Exported 18 October 2026 from source commit `e5a124b482bbe698c22d41c9a91bd4ff90e22c22` (Sites version 3). All existing included application source files and README.md are byte-for-byte unchanged. This file, .env.example and SOURCE-MANIFEST.json are export-only additions. Nothing was rebuilt, redeployed, committed or changed in the application. The existing README contains historical QA notes; they are not a new verification claim.

## Start here

Use the included README.md for architecture, workflows and existing setup instructions. Install Node >=22.13.0 and pnpm 11.25.0 (package.json packageManager). From the extracted project directory:

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_groovy_goblin_queen.sql
pnpm dev
```

These are instructions for your partner; no build was run for this export. The local migration command requires the generated dist/server/wrangler.json, hence the preceding build. Apply an initial migration once to a new local database. On a clean portable checkout, open http://localhost:5173/signin-with-chatgpt?return_to=/ for the existing fictional loopback-only development identity. It is not a password/account for OpenAI or a production authentication method. Clean clones default to portable; checkout-local managed execution settings were deliberately excluded. If Corepack is unavailable, install the exact declared pnpm version using your trusted package-manager installation method.

Optional existing checks:

```sh
node --test tests/acceptance.mjs
node --experimental-strip-types --test tests/dev-auth.mjs
pnpm exec tsc --noEmit
python3 tests/database-persistence.py
```

The Python persistence check requires a migrated local D1 database. No new test results are claimed by this export.

## What is specific to ChatGPT Sites

- `.openai/hosting.json` identifies the existing Site and declares D1 binding `DB`. Its project ID is an identifier, not a credential. Do not publish partner changes to that Site without the owner's intended deployment workflow.
- Hosted `/signin-with-chatgpt`, `/signout-with-chatgpt` and `/callback` belong to Sites dispatch, not route handlers in this repo.
- `app/chatgpt-auth.ts` reads the platform-verified `oai-authenticated-user-id` and email headers. Direct deployment to an ordinary Worker does not provide this authentication.
- `build/sites-vite-plugin.ts` includes Sites build support and a guarded portable development identity. Do not enable that identity on a public server.
- `build/sites-worker.ts`, connector helpers and preview workers carry Sites runtime/connector support. The application business integrations are mocks; exporting source connects no providers.
- Sites publication provisions/binds the managed database and applies hosted migrations. The local placeholder database ID in vite.config.ts is not the production database identifier or access credential.

## Independent deployment changes required, not implemented here

Cloudflare Workers is the closest runtime match because this code uses Vinext, the Cloudflare Vite plugin and native `cloudflare:workers` bindings. This archive is source, not a ready-to-deploy independent build.

1. Configure a Worker and D1 `DB` binding in an account you control. Preserve the existing schema. Do not blindly run Sites provisioning/publishing helpers against a new account.
2. Replace the Sites authentication adapter and reserved sign-in/callback paths with a supported, server-validated identity/session provider. Use persistent secure HttpOnly session cookies or the provider's documented server design, appropriate SameSite/Secure/Path attributes, logout invalidation and CSRF protection. Never trust caller-supplied platform identity headers on an independent public origin.
3. Preserve authorization in the API routes, `lib/authorization.mjs` and `lib/database.ts`. Map authenticated new-provider identities explicitly to the existing workspace and membership IDs. Otherwise the automatic per-owner seed path could create an empty new demo workspace instead of loading the old one.
4. Obtain authorized access to the original managed D1 database or a complete database export before moving saved data. This ZIP deliberately contains schema/migrations and fictional seed source only, not live database rows, memberships or session data. Source export alone does not preserve or transfer hosted records.
5. Review Sites build/connector integration points for the independent runtime without changing unrelated workflow logic. Add only the selected auth provider's required runtime secrets to the host's secret store. `.env.example` lists current requirements and distinguishes future deployment-tool variables from implemented application settings.
6. Before cutover verify login, five reloads, new-tab access, logout, anonymous/invalid-session denial and authenticated role/tenant isolation. Then verify new-record persistence and workflow actions. Keep the existing deployment and database until acceptance.

## Data and security boundaries

The D1 tables are `workspaces(owner_id,state,revision,created_at)` and `memberships(user_id,workspace_id,role)`. Clinic, contacts, enquiries, messages, FAQ, appointments, follow-ups, consent, routing, audit and integration collections are structured JSON inside workspace state. `lib/seed.mjs` contains intentionally fictional demo examples. No runtime database dump, real patient record, secret environment file, Git history, dependency directory or compiled build output is included. The maintained `build/` directory contains source code and is intentionally included.

`SOURCE-MANIFEST.json` lists included files and SHA-256 checksums. The only omitted tracked build artifact is listed there. Generated next-env.d.ts is included as a type declaration. Partner development requires installing dependencies; production integration credentials and shared real staff-account management are not supplied.
