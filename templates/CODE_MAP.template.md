# Code Location Map

**Purpose:** Quick reference for feature implementations
**Last Updated:** [Auto-updated]
**Maintenance:** Update when adding features or major refactors

---

## Should Your Project Use CODE_MAP.md?

**Answer these questions:**

1. **Project Size:**
   - [ ] >20 files across multiple directories
   - [ ] OR >5 distinct deployment targets/platforms

2. **Team Complexity:**
   - [ ] Multiple developers (>2)
   - [ ] OR frequent AI agent handoffs
   - [ ] OR onboarding new team members regularly

3. **Code Organization:**
   - [ ] Clear separation of concerns (services, functions, components)
   - [ ] Multiple platforms (netlify/, functions/, etc.)
   - [ ] Abstraction layers (services → adapters → functions)

4. **Pain Point:**
   - [ ] Developers spend >5 min finding feature code
   - [ ] Onboarding takes >1 hour just navigating codebase
   - [ ] "Where is X implemented?" asked frequently

**Decision:**
- **0-1 checked:** Don't create CODE_MAP (simple project, not worth overhead)
- **2-3 checked:** Consider CODE_MAP (marginal value, optional)
- **4+ checked:** Create CODE_MAP (clear value, recommended)

**Remember:** CODE_MAP requires maintenance. Only create if value > maintenance cost.

---

## Core Features

### [Feature Name]

**Entry Point:** `path/to/entry.ts`

**Key Files:**
- `path/to/service.ts` - Business logic (platform-agnostic)
- `path/to/handler.ts` - HTTP handler (platform-specific)
- `path/to/component.astro` - UI component
- `tests/feature.test.ts` - Test suite

**Decision:** See [DECISIONS.md](./DECISIONS.md#decision-ref)

**Notes:** [Any gotchas or important context]

---

### [Feature Name 2]

**Entry Point:** `path/to/entry.ts`

**Key Files:**
- `path/to/file.ts` - [Purpose]
- `path/to/file.tsx` - [Purpose]

**Decision:** See [DECISIONS.md](./DECISIONS.md#decision-ref)

---

## File Structure

```
src/
├── pages/              → Routes (Astro pages, Next.js pages, etc.)
│   ├── index.astro     → Homepage
│   └── api/            → API routes
├── components/         → UI components
│   ├── common/         → Shared components
│   └── features/       → Feature-specific components
├── server/
│   ├── services/       → Business logic (platform-agnostic)
│   │   ├── newsletter-service.ts
│   │   └── contribution-service.ts
│   └── adapters/       → Platform-specific adapters
│       ├── netlify-adapter.ts
│       └── cloudflare-adapter.ts
├── lib/                → Shared utilities
│   ├── types/          → TypeScript types
│   └── utils/          → Helper functions
netlify/functions/      → Netlify serverless functions
functions/              → Cloudflare workers
tests/                  → Test files (mirror src/ structure)
```

**Organization Principles:**
- [e.g., "Services are platform-agnostic, adapters handle platform specifics"]
- [e.g., "Colocation: tests next to source files"]
- [e.g., "Feature folders over type folders"]

---

## Quick Lookup

**By Feature:**
- Newsletter: `src/server/services/newsletter-service.ts`
- Contribution: `src/server/services/contribution-service.ts`
- Rate Limiting: `src/server/adapters/*-adapter.ts`
- [Feature]: `path/to/implementation`

**By File Type:**
- API Routes: `src/pages/api/`
- Components: `src/components/`
- Services: `src/server/services/`
- Tests: `tests/`

**By Platform:**
- Netlify Functions: `netlify/functions/`
- Cloudflare Workers: `functions/`
- Shared Logic: `src/server/services/`

---

## Deployment Targets

**Production:**
- Platform: [e.g., Vercel, Netlify, Cloudflare]
- Entry: [e.g., netlify.toml, vercel.json]
- Build: `[build command]`

**Staging:**
- Platform: [Same or different]
- Configuration: [File location]

**Local Development:**
- Start: `[dev command]`
- Port: [e.g., 3000, 8080]

---

## Common Patterns

**Service Layer Pattern:**
```
User Request → API Route → Adapter → Service → Database
                           ↑          ↑
                    Platform-specific  Platform-agnostic
```

**Where to find:**
- Entry points (API routes): `src/pages/api/`
- Adapters (platform logic): `src/server/adapters/`
- Services (business logic): `src/server/services/`

**Dependency Flow:**
- Routes depend on Adapters
- Adapters depend on Services
- Services are independent (no platform deps)

---

## Integration Points

**External Services:**
- [Service Name]: Connected via `path/to/integration.ts`
- [API]: Auth in `path/to/auth.ts`, calls in `path/to/client.ts`

**Third-Party Libraries:**
- [Library]: Used in `[files]` for `[purpose]`

**Database:**
- Client: `[path to DB client setup]`
- Migrations: `[path to migrations]`
- Models: `[path to models/schemas]`

---

## Testing Strategy

**Unit Tests:**
- Location: `tests/` (mirrors `src/` structure)
- Services: `tests/server/services/*.test.ts`
- Components: `tests/components/*.test.tsx`

**Integration Tests:**
- Location: `tests/integration/`
- API Routes: `tests/integration/api/*.test.ts`

**E2E Tests:**
- Location: `tests/e2e/`
- Flows: `tests/e2e/[feature].test.ts`

---

## Need More Detail?

**For architecture decisions:** See [DECISIONS.md](./DECISIONS.md)
**For development workflow:** See [CONTEXT.md](./CONTEXT.md)
**For current work:** See [STATUS.md](./STATUS.md)

---

**Maintenance Note:** Update this file when:
- Adding new features
- Major refactoring that changes file locations
- New deployment targets
- Architectural pattern changes

**Don't update for:** Minor tweaks, bug fixes, or changes within existing files
