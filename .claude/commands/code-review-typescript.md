---
name: code-review-typescript
description: TypeScript type safety audit - strict mode, any usage, type coverage, inference quality
---

# /code-review-typescript Command

Conduct a thorough TypeScript type safety audit. This command **NEVER makes changes** - it only identifies type system weaknesses and suggests improvements. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Check actual tsconfig.json settings** - Not just perceived strictness
3. **Quantify any usage** - Track how much type safety is being bypassed
4. **Consider tradeoffs** - Not all `any` is bad, context matters

## When to Use This Command

**Good times:**
- Before enabling stricter TypeScript options
- When inheriting a TypeScript codebase
- After major refactoring
- When type errors are frequently ignored
- Before publishing a library

**Bad times:**
- Pure JavaScript projects
- Prototypes not intended to persist
- When strict mode is already fully enabled and enforced

## TypeScript Strictness Levels

| Level | Compiler Flags | Type Safety |
|-------|---------------|-------------|
| Loose | default | Low - many implicit any |
| Standard | strict: true | Medium - common issues caught |
| Maximum | strict + additional flags | High - comprehensive safety |

### Key Compiler Options

```json
{
  "compilerOptions": {
    // Core strict mode (enables several below)
    "strict": true,

    // Individual strict options
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional strictness
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,

    // Module safety
    "esModuleInterop": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

## Execution Steps

### Step 0: Set Expectations

```
TypeScript Type Safety Audit

Scope: tsconfig settings, any usage, type coverage, inference quality
Project: [detected]
Framework: [detected]

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...

Analysis will include:
- Compiler configuration review
- Type coverage analysis
- Explicit any tracking
- Implicit any detection
- Type assertion audit
```

### Step 1: Analyze tsconfig.json

**Check current configuration:**

```bash
# Find tsconfig files
find . -name "tsconfig*.json" -not -path "*/node_modules/*"

# Read main tsconfig
cat tsconfig.json

# Check if strict mode enabled
grep -n "strict" tsconfig.json

# Check individual strict options
grep -n "noImplicitAny\|strictNullChecks\|strictFunctionTypes" tsconfig.json
```

**Create tsconfig inventory:**

| Option | Current | Recommended | Impact |
|--------|---------|-------------|--------|
| strict | false | true | Enables 7 strict flags |
| noImplicitAny | false | true | Catches missing types |
| strictNullChecks | false | true | Prevents null errors |
| noUncheckedIndexedAccess | false | true | Safe array access |

### Step 2: Count Type Bypasses

#### 2.1: Explicit `any`

**Find all explicit any usage:**

```bash
# Count explicit any declarations
grep -rn ": any\|<any>\|as any" --include="*.ts" --include="*.tsx" | wc -l

# Find any in function parameters
grep -rn "(\s*\w\+:\s*any" --include="*.ts" --include="*.tsx"

# Find any in return types
grep -rn "):\s*any" --include="*.ts" --include="*.tsx"

# Find any in type assertions
grep -rn "as any" --include="*.ts" --include="*.tsx"

# Find any in generics
grep -rn "<any>" --include="*.ts" --include="*.tsx"
```

**Categorize any usage:**

| Category | Count | Risk Level |
|----------|-------|------------|
| Parameter types | N | High |
| Return types | N | High |
| Type assertions | N | Medium |
| Generic arguments | N | Medium |
| Variable declarations | N | Low |

#### 2.2: Type Assertions

**Find type assertion patterns:**

```bash
# as assertions
grep -rn " as [A-Z]\|as {\|as (\|as unknown" --include="*.ts" --include="*.tsx"

# Non-null assertions (!)
grep -rn "\w\+!" --include="*.ts" --include="*.tsx" | grep -v "!="

# Type assertion for external data
grep -rn "as .*Response\|as .*Data" --include="*.ts" --include="*.tsx"
```

**Common problematic patterns:**

```typescript
// BAD: Unsafe assertion
const data = response.json() as UserData;

// GOOD: Runtime validation
const data = UserDataSchema.parse(await response.json());

// BAD: Non-null assertion without guarantee
const user = users.find(u => u.id === id)!;

// GOOD: Proper null handling
const user = users.find(u => u.id === id);
if (!user) throw new Error('User not found');
```

#### 2.3: @ts-ignore and @ts-expect-error

**Find suppressed errors:**

```bash
# Count ts-ignore
grep -rn "@ts-ignore" --include="*.ts" --include="*.tsx" | wc -l

# Count ts-expect-error
grep -rn "@ts-expect-error" --include="*.ts" --include="*.tsx" | wc -l

# Find ignore comments with reasons (good practice)
grep -rn "@ts-ignore\|@ts-expect-error" --include="*.ts" --include="*.tsx" | head -20
```

**Check for:**
- [ ] **Minimal @ts-ignore usage** - Each one documented
- [ ] **@ts-expect-error preferred** - Fails if error goes away
- [ ] **Comments explain why** - Not just suppressing randomly

### Step 3: Analyze Function Signatures

**Check function type safety:**

```bash
# Find functions without return types
grep -rn "function \w\+(" --include="*.ts" --include="*.tsx" | grep -v "):"

# Find arrow functions without return types
grep -rn "=> {" --include="*.ts" --include="*.tsx" | grep -v "):"

# Find async functions
grep -rn "async function\|async (" --include="*.ts" --include="*.tsx"

# Find Promise return types
grep -rn "): Promise<" --include="*.ts" --include="*.tsx"
```

**Check for:**
- [ ] **Public functions have explicit return types** - Clear API contracts
- [ ] **Complex functions have explicit return types** - Inference can break
- [ ] **Async functions return Promise<T>** - Not Promise<any>
- [ ] **Callbacks have typed parameters** - Not inferred from any

**Examples:**

```typescript
// BAD: No return type, breaks if implementation changes
export function fetchUser(id: string) {
  return api.get(`/users/${id}`);
}

// GOOD: Explicit return type as contract
export function fetchUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// BAD: Callback with any
users.map((user) => user.name);  // if users is any[]

// GOOD: Typed array
const users: User[] = await getUsers();
users.map((user) => user.name);  // user is User
```

### Step 4: Check External Data Handling

**Find external data entry points:**

```bash
# API responses
grep -rn "fetch\|axios\|api\.\|\.json()" --include="*.ts" --include="*.tsx"

# Form data
grep -rn "FormData\|formData\|form\." --include="*.ts" --include="*.tsx"

# URL params
grep -rn "params\|searchParams\|query" --include="*.ts" --include="*.tsx"

# Environment variables
grep -rn "process\.env\|import\.meta\.env" --include="*.ts" --include="*.tsx"

# Local storage / cookies
grep -rn "localStorage\|sessionStorage\|cookies" --include="*.ts" --include="*.tsx"
```

**Check for runtime validation:**

```bash
# Zod usage
grep -rn "z\.\|zod" --include="*.ts" --include="*.tsx"

# Yup usage
grep -rn "yup\.\|Yup" --include="*.ts" --include="*.tsx"

# io-ts usage
grep -rn "io-ts\|t\." --include="*.ts" --include="*.tsx"
```

**Check for:**
- [ ] **API responses validated** - Not just typed
- [ ] **Form data validated** - Before using
- [ ] **URL params typed and validated** - Not assumed
- [ ] **Env vars have fallbacks** - Type-safe access

**Examples:**

```typescript
// BAD: Trust API response type
const user = await fetch('/api/user').json() as User;

// GOOD: Validate at runtime
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});

const response = await fetch('/api/user');
const user = UserSchema.parse(await response.json());
```

### Step 5: Analyze Generic Usage

**Check generic patterns:**

```bash
# Find generic functions/types
grep -rn "<T>\|<T,\|<T extends" --include="*.ts" --include="*.tsx"

# Find generic constraints
grep -rn "extends\s*{" --include="*.ts" --include="*.tsx"

# Find utility types
grep -rn "Partial<\|Required<\|Pick<\|Omit<\|Record<" --include="*.ts" --include="*.tsx"
```

**Check for:**
- [ ] **Generics properly constrained** - Not just <T>
- [ ] **Utility types used appropriately** - Partial for updates
- [ ] **No unnecessary generics** - Simple types when sufficient
- [ ] **Generic defaults when useful** - <T = unknown>

### Step 6: Check Type Definitions

**Analyze type organization:**

```bash
# Find type files
find . -name "*.d.ts" -not -path "*/node_modules/*"
find . -name "types.ts" -not -path "*/node_modules/*"

# Find interfaces
grep -rn "^interface\|^export interface" --include="*.ts" --include="*.tsx" | wc -l

# Find type aliases
grep -rn "^type\|^export type" --include="*.ts" --include="*.tsx" | wc -l

# Find enums
grep -rn "^enum\|^export enum" --include="*.ts" --include="*.tsx" | wc -l
```

**Check for:**
- [ ] **Types colocated or centralized** - Consistent organization
- [ ] **Interfaces for object shapes** - Extensible types
- [ ] **Type aliases for unions/intersections** - Complex types
- [ ] **Enums vs const objects** - Consider tradeoffs
- [ ] **No duplicate type definitions** - DRY types

### Step 7: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "typescript" "docs/audits"

# Option 2: Manual check - list existing TypeScript audits
ls docs/audits/typescript-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/typescript-audit-NN.md`:

```markdown
# TypeScript Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | TypeScript |
| TS Version | [version] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Type Safety Score:** [0-100%]

**Configuration:**
- Strict Mode: [Yes/No]
- strictNullChecks: [Yes/No]
- noImplicitAny: [Yes/No]

**Key Metrics:**
- Total TypeScript files: [N]
- Explicit `any` count: [N]
- Type assertions: [N]
- @ts-ignore comments: [N]

**Top 3 Type Safety Issues:**
1. [Most critical issue]
2. [Second most critical]
3. [Third most critical]

---

## tsconfig.json Analysis

### Current Configuration

| Option | Value | Recommended | Status |
|--------|-------|-------------|--------|
| strict | false | true | **Missing** |
| noImplicitAny | false | true | **Missing** |
| strictNullChecks | false | true | **Missing** |
| strictFunctionTypes | false | true | **Missing** |
| noUncheckedIndexedAccess | false | true | **Missing** |
| noImplicitReturns | true | true | Good |
| esModuleInterop | true | true | Good |

### Recommended Changes

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Type Bypass Analysis

### By Category

| Category | Count | % of Codebase | Risk |
|----------|-------|---------------|------|
| Explicit any | N | X% | High |
| Type assertions | N | X% | Medium |
| Non-null assertions | N | X% | High |
| @ts-ignore | N | X% | High |
| @ts-expect-error | N | X% | Low |

### Files with Most Type Bypasses

| File | any | assertions | ignores | Total |
|------|-----|------------|---------|-------|
| api/client.ts | 12 | 8 | 2 | 22 |
| utils/helpers.ts | 8 | 3 | 5 | 16 |
| components/Form.tsx | 6 | 4 | 0 | 10 |

---

## Detailed Findings

### Critical

#### TS-C1: [Issue Title]
- **Rule:** No explicit any in public APIs
- **Location:** `lib/api.ts:45`
- **Current Code:**
```typescript
export function fetchData(endpoint: string): Promise<any> {
  return fetch(endpoint).then(r => r.json());
}
```
- **Problem:** Return type is any, no type safety for callers
- **Remediation:**
```typescript
export async function fetchData<T>(
  endpoint: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  const response = await fetch(endpoint);
  return schema.parse(await response.json());
}
```

### High Priority

[Same format]

### Medium Priority

[Same format]

### Low Priority

[Same format]

---

## Function Signature Analysis

### Missing Return Types

| Function | File | Line | Risk |
|----------|------|------|------|
| fetchUser | api/users.ts | 12 | High |
| formatDate | utils/date.ts | 5 | Low |
| handleSubmit | components/Form.tsx | 23 | Medium |

### Unsafe Async Patterns

| Pattern | Count | Example |
|---------|-------|---------|
| async without Promise<T> | N | async function foo() |
| .then without typing | N | api.get().then(data => ...) |
| untyped catch | N | .catch(e => console.error(e)) |

---

## External Data Handling

### Entry Points

| Source | Validation | Risk |
|--------|------------|------|
| API responses | None | **Critical** |
| Form submissions | Zod | Good |
| URL parameters | None | **High** |
| Local storage | Type assertion | **Medium** |
| Environment variables | None | **Medium** |

### Recommendations

1. **Add Zod/Yup validation** for all API responses
2. **Validate URL parameters** before use
3. **Type environment variables** with validation

---

## Generic Type Analysis

### Good Patterns Found

- Proper constraints: `<T extends Record<string, unknown>>`
- Utility type usage: `Partial<User>`, `Pick<Order, 'id' | 'status'>`

### Issues Found

| Issue | Count | Example |
|-------|-------|---------|
| Unconstrained generics | N | `<T>` without extends |
| any in generics | N | `<T = any>` |
| Missing generic constraints | N | Should use extends |

---

## Type Organization

### Current Structure

- Type files: [N]
- Interfaces: [N]
- Type aliases: [N]
- Enums: [N]
- Duplicated types: [N]

### Recommendations

- [ ] Centralize shared types in `types/` directory
- [ ] Use interfaces for object shapes
- [ ] Replace enums with const objects where appropriate
- [ ] Remove duplicate type definitions

---

## Prioritized Remediation

### Phase 1: Enable Strict Mode (Gradual)

1. Enable individual strict flags one at a time:
   ```json
   {
     "compilerOptions": {
       "noImplicitAny": true
     }
   }
   ```
2. Fix errors for each flag before enabling next
3. Order: noImplicitAny -> strictNullChecks -> strictFunctionTypes

### Phase 2: Reduce any Usage

1. Replace `any` with `unknown` where type is truly unknown
2. Add proper types to API client functions
3. Use generics with constraints

### Phase 3: Add Runtime Validation

1. Install Zod: `npm install zod`
2. Create schemas for API responses
3. Validate at system boundaries

---

## Metrics Summary

- **TypeScript Files:** [N]
- **Lines of TypeScript:** [N]
- **Type Bypass Density:** [N per 1000 lines]
- **Strict Mode Score:** [0-100%]
- **Estimated Fix Effort:** [S/M/L]

---

## Tools Recommended

- **Type Coverage:** `npx type-coverage`
- **Strict Migration:** `ts-strictify`
- **Runtime Validation:** Zod, io-ts, or Yup
- **Linting:** `@typescript-eslint/strict-type-checked`

---

**Generated by:** Claude Code
**Audit Type:** TypeScript Type Safety
**Version:** 4.0.1
```

### Step 8: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "TypeScript" "typescript-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | TypeScript | [typescript-audit-NN.md](./typescript-audit-NN.md) | [Grade] | [N any usages, strict mode gaps, etc.] |
```

### Step 9: Report Completion

```
TypeScript Type Safety Audit Complete

Report saved to: docs/audits/typescript-audit-NN.md

Summary:
- Grade: C
- Type Safety Score: 65%
- Strict Mode: Disabled
- Explicit any: 47 occurrences
- Type assertions: 23 occurrences
- @ts-ignore: 12 occurrences

Configuration Issues:
- strict mode disabled
- noImplicitAny disabled
- strictNullChecks disabled

Top Issues:
1. API client returns any for all responses
2. Form handlers have no parameter types
3. 12 @ts-ignore with no explanations

Metrics:
- TypeScript files: 145
- Type bypass density: 8.2 per 1000 lines
- Files needing attention: 23

Next Steps:
1. Review full report at docs/audits/typescript-audit-NN.md
2. Enable strict mode flags incrementally
3. Add Zod validation for API responses
4. Replace any with unknown or proper types
5. Re-run audit after each phase

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | Strict mode enabled, minimal any, runtime validation, excellent coverage |
| B | Strict mode enabled, some any usage, most external data validated |
| C | Partial strict mode, moderate any usage, inconsistent validation |
| D | No strict mode, heavy any usage, no runtime validation |
| F | Mostly any types, tsconfig very loose, no type safety |

## Type Safety Quick Reference

### Replacing any

```typescript
// Instead of any, use:
unknown      // When type truly isn't known
never        // When code should be unreachable
void         // When function returns nothing
object       // When any object shape is ok
Record<string, unknown>  // For dictionary-like objects
```

### Safe Type Narrowing

```typescript
// Instead of type assertion
const user = data as User;  // Unsafe!

// Use type guards
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}

if (isUser(data)) {
  // data is now User
}

// Or runtime validation
const user = UserSchema.parse(data);  // Throws if invalid
const user = UserSchema.safeParse(data);  // Returns { success, data/error }
```

### Strict tsconfig.json Template

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  }
}
```

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Zod Documentation](https://zod.dev/)
- [Type Coverage Tool](https://github.com/nicolo-ribaudo/type-coverage)
- [Total TypeScript Tips](https://www.totaltypescript.com/tips)

---

**Version:** 4.0.1
