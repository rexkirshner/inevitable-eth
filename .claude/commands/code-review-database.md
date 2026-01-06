---
name: code-review-database
description: Deep database efficiency audit - query optimization, N+1 detection, indexes, caching
---

# /code-review-database Command

Conduct a thorough database and ORM efficiency audit. This command **NEVER makes changes** - it only identifies issues and suggests improvements. Fixes happen in a separate session after review.

**Platform flags:** `--prisma`, `--drizzle`, `--typeorm`, `--raw`

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Auto-detect platform if no flag provided** - Use platform detection helpers
3. **Focus on cost drivers** - Database operations often drive infrastructure costs
4. **Be specific** - Provide exact file:line locations and concrete fixes

## When to Use This Command

**Good times:**
- After completing database-heavy features
- Before deployment to production
- When Vercel/AWS bills are higher than expected
- When pages feel slow (often database-bound)
- When evaluating ORM patterns

**Bad times:**
- Project has no database
- Still designing schema (wait until implemented)

## Platform Detection

```bash
# Auto-detect platform from project files
source scripts/common-functions.sh
PLATFORM=$(detect_database_platform)
echo "Detected platform: $PLATFORM"
```

**Override with flag:**
- `--prisma` - Force Prisma-specific checks
- `--drizzle` - Force Drizzle-specific checks
- `--typeorm` - Force TypeORM-specific checks
- `--raw` - Raw SQL with pg/mysql2/sqlite3

## Execution Steps

### Step 0: Set Expectations

```
Database Efficiency Audit

Platform: [auto-detected or flag]
Scope: Query patterns, N+1 detection, indexes, connection pooling, caching

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...
```

### Step 1: Platform Detection & Setup

```bash
# Detect platform
source scripts/common-functions.sh
PLATFORM=$(detect_database_platform)

# Verify detection
if [ "$PLATFORM" = "unknown" ]; then
  echo "No database platform detected. Specify: --prisma, --drizzle, --typeorm, or --raw"
fi
```

**Find key files:**

| Platform | Schema File | Client Location | Config |
|----------|-------------|-----------------|--------|
| Prisma | `prisma/schema.prisma` | `lib/prisma.ts`, `lib/db.ts` | `.env` |
| Drizzle | `drizzle/schema.ts` | `lib/db.ts` | `drizzle.config.ts` |
| TypeORM | `src/entities/*.ts` | `src/data-source.ts` | `ormconfig.json` |
| Raw | N/A | Look for `pg`, `mysql2` imports | `.env` |

### Step 2: Schema & Index Analysis

**For Prisma:**
```bash
# Find schema
cat prisma/schema.prisma

# Look for missing indexes on frequently queried fields
# Look for relations without @index
# Check for missing composite indexes
```

**Check for:**

- [ ] **Foreign keys indexed** - Every relation should have index on FK
- [ ] **Query fields indexed** - Fields used in WHERE clauses
- [ ] **Composite indexes** - For multi-column lookups
- [ ] **Unique constraints** - For lookup-by fields
- [ ] **Enum types** - Appropriate use of enums vs strings

**Example issues:**

```prisma
// ISSUE: Foreign key without index
model Post {
  userId String  // Should have @index
  user   User    @relation(fields: [userId], references: [id])
}

// BETTER
model Post {
  userId String
  user   User    @relation(fields: [userId], references: [id])
  @@index([userId])
}
```

### Step 3: N+1 Query Detection

**Scan for N+1 patterns:**

```typescript
// PATTERN 1: Loop with individual queries
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
  // N+1: 1 query for users + N queries for posts
}

// PATTERN 2: Missing include/select
const users = await prisma.user.findMany();
// Then later: users.forEach(u => u.posts) triggers lazy load

// PATTERN 3: Nested includes without limits
const users = await prisma.user.findMany({
  include: {
    posts: {
      include: {
        comments: {
          include: {
            author: true  // Deep nesting = exponential queries
          }
        }
      }
    }
  }
});
```

**Search commands:**
```bash
# Find potential N+1 in loops
grep -rn "for.*await.*prisma\." --include="*.ts" --include="*.tsx"
grep -rn "forEach.*await.*prisma\." --include="*.ts" --include="*.tsx"
grep -rn "map.*await.*prisma\." --include="*.ts" --include="*.tsx"

# Find missing includes (accessing relations without include)
grep -rn "findMany\|findFirst\|findUnique" --include="*.ts" -A 5 | grep -v "include:"
```

### Step 4: Query Efficiency Analysis

**Check for overfetching:**

```typescript
// BAD: Fetching all columns when only need name
const users = await prisma.user.findMany();
const names = users.map(u => u.name);

// GOOD: Select only needed fields
const users = await prisma.user.findMany({
  select: { name: true }
});
```

**Check for:**

- [ ] **Missing select** - Fetching entire rows when subset needed
- [ ] **Unbounded queries** - No `take` limit on findMany
- [ ] **Missing pagination** - Large result sets without cursor/offset
- [ ] **Raw queries** - Check for optimization opportunities
- [ ] **Transaction misuse** - Unnecessary transactions, missing where needed

**Search for unbounded queries:**
```bash
# Find findMany without take
grep -rn "findMany" --include="*.ts" --include="*.tsx" | grep -v "take:"
```

### Step 5: Connection Management

**Check Prisma client singleton:**

```typescript
// BAD: New client per request
export async function getData() {
  const prisma = new PrismaClient();
  const data = await prisma.user.findMany();
  return data;
  // Missing disconnect, connection leak
}

// GOOD: Singleton pattern
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Check for:**

- [ ] **Singleton pattern** - Single client instance
- [ ] **Connection pooling** - Appropriate pool size
- [ ] **Edge compatibility** - Using Prisma edge if on Vercel Edge
- [ ] **Connection string** - Using connection pooler for serverless

**Search commands:**
```bash
# Find PrismaClient instantiation
grep -rn "new PrismaClient" --include="*.ts" --include="*.tsx"

# Should be exactly 1 result in lib/prisma.ts or similar
```

### Step 6: Caching Opportunities

**Identify cacheable queries:**

```typescript
// CACHEABLE: Reference data that rarely changes
const categories = await prisma.category.findMany();

// CACHEABLE: Same query within request
const user = await getUser(userId);  // Called multiple times
const user2 = await getUser(userId); // Duplicate!

// NOT CACHEABLE: User-specific realtime data
const notifications = await prisma.notification.findMany({
  where: { userId, read: false }
});
```

**Check for:**

- [ ] **Request-level deduplication** - Same query called multiple times
- [ ] **Reference data caching** - Categories, settings, config
- [ ] **Computed data caching** - Expensive aggregations
- [ ] **React cache()** - For request-scoped memoization

**Example fix:**
```typescript
// Request-level caching with React cache()
import { cache } from 'react';

export const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
});
```

### Step 7: Platform-Specific Checks

#### Prisma-Specific

- [ ] **$queryRaw safety** - Parameterized, not string concat
- [ ] **Batch operations** - createMany vs multiple create
- [ ] **Relation loads** - Include vs separate queries
- [ ] **Prisma version** - On latest stable
- [ ] **Engine** - Binary vs library engine consideration

#### Drizzle-Specific

- [ ] **Query builder patterns** - Using .where() efficiently
- [ ] **Prepared statements** - Using prepared for repeated queries
- [ ] **Join vs separate** - Appropriate join usage

#### TypeORM-Specific

- [ ] **Lazy loading** - Eager vs lazy configured correctly
- [ ] **QueryBuilder** - Using parameters, not string concat
- [ ] **Entity relations** - Loaded when needed

#### Raw SQL

- [ ] **Parameterized queries** - No string concatenation
- [ ] **Prepared statements** - Reusing statements
- [ ] **Connection pooling** - Using pool, not individual connections

### Step 8: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "database" "docs/audits"

# Option 2: Manual check - list existing database audits
ls docs/audits/database-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/database-audit-NN.md`:

```markdown
# Database Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Database |
| Platform | [Prisma/Drizzle/TypeORM/Raw] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Top 5 Cost Drivers:**
1. [Highest impact issue]
2. [Second highest]
3. [Third]
4. [Fourth]
5. [Fifth]

**Quick Stats:**
- N+1 patterns found: [N]
- Missing indexes: [N]
- Unbounded queries: [N]
- Connection issues: [N]
- Caching opportunities: [N]

---

## Query Efficiency Findings

### Critical

#### QE-C1: [Issue Title]
- **Severity:** Critical
- **Location:** `path/to/file.ts:123`
- **Issue:** [Description]
- **Impact:** [Performance/cost impact]
- **Current Code:**
```typescript
// Problematic code
```
- **Suggested Fix:**
```typescript
// Fixed code
```
- **Estimated Impact:** [e.g., "Reduces queries from N+1 to 2"]

### High Priority

[Same format]

### Medium Priority

[Same format]

---

## Schema & Index Findings

### Missing Indexes

| Table/Model | Field | Query Pattern | Priority |
|-------------|-------|---------------|----------|
| Post | userId | Foreign key lookup | High |
| User | email | Login lookup | High |

### Suggested Index Additions

```prisma
// Add to schema.prisma
model Post {
  // ... existing fields
  @@index([userId])
  @@index([createdAt])
}
```

---

## Connection Management

**Current Pattern:** [Singleton/Per-request/Unknown]

**Issues Found:**
- [List any connection issues]

**Recommendations:**
- [Specific recommendations]

---

## Caching Opportunities

### Request-Level Caching

| Query | Frequency | Recommendation |
|-------|-----------|----------------|
| getUser(id) | 5x/request | Use React cache() |
| getCategories() | 3x/request | Cache or lift up |

### Application-Level Caching

| Data | Staleness OK | Recommendation |
|------|--------------|----------------|
| Categories | 1 hour | Redis/memory cache |
| Settings | 5 min | Environment or cache |

---

## Prioritized Actions

### Immediate (This Sprint)

1. **[QE-C1]** Fix N+1 in dashboard query
   - File: `app/dashboard/page.tsx:45`
   - Effort: 30 minutes
   - Impact: High

2. **[IDX-1]** Add index on Post.userId
   - File: `prisma/schema.prisma`
   - Effort: 5 minutes + migration
   - Impact: High

### Short-term (This Month)

[More items]

### Long-term (Backlog)

[More items]

---

## Platform-Specific Notes

[Any platform-specific findings]

---

## Metrics

- **Files Analyzed:** [N]
- **Queries Reviewed:** [N]
- **Models/Tables:** [N]
- **Total Issues:** [N] (C:[N], H:[N], M:[N], L:[N])

---

## Next Steps

1. Review findings with team
2. Prioritize fixes based on cost impact
3. Address critical issues first
4. Re-run audit after fixes to measure improvement

---

**Generated by:** Claude Code
**Audit Type:** Database Efficiency
**Version:** 4.0.1
```

### Step 9: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Database" "database-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Database | [database-audit-NN.md](./database-audit-NN.md) | [Grade] | [N+1 issues, missing indexes, etc.] |
```

### Step 10: Report Completion

```
Database Audit Complete

Report saved to: docs/audits/database-audit-NN.md

Summary:
- Grade: B
- Critical Issues: 2 (N+1 patterns)
- High Priority: 4 (missing indexes, unbounded queries)
- Medium Priority: 6
- Caching Opportunities: 3

Top 3 Cost Drivers:
1. N+1 in dashboard query (15 queries per page load)
2. Missing index on Post.userId (full table scans)
3. No request-level caching (duplicate getUser calls)

Next Steps:
1. Review full report at docs/audits/database-audit-NN.md
2. Fix N+1 patterns first (highest impact)
3. Run prisma migrate after adding indexes
4. Re-run audit to verify improvements

No changes were made during this audit.
```

## Common Patterns by Platform

### Prisma Patterns

**N+1 Detection:**
```typescript
// BAD
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { userId: user.id } });
}

// GOOD
const users = await prisma.user.findMany({
  include: { posts: true }
});
```

**Select Optimization:**
```typescript
// BAD - fetches all columns
const users = await prisma.user.findMany();

// GOOD - only needed columns
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});
```

### Drizzle Patterns

**Join Efficiency:**
```typescript
// BAD - multiple queries
const posts = await db.select().from(posts);
const users = await db.select().from(users);

// GOOD - single join
const result = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id));
```

### Raw SQL Patterns

**Parameterization:**
```typescript
// BAD - SQL injection risk
const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`);

// GOOD - parameterized
const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | No N+1, all FKs indexed, singleton client, request caching |
| B | 1-2 minor N+1, most indexes present, good patterns |
| C | Multiple N+1, missing key indexes, some unbounded queries |
| D | Pervasive N+1, no indexing strategy, connection issues |
| F | Critical performance issues, connection leaks, SQL injection risk |

## References

- [Prisma Query Optimization](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance)
- [N+1 Problem Explained](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-n1-in-graphql-with-findunique-and-prismas-dataloader)
- [Database Indexing Best Practices](https://use-the-index-luke.com/)
- [Vercel Postgres Connection Pooling](https://vercel.com/docs/storage/vercel-postgres/using-an-orm#prisma)

---

**Version:** 4.0.1
