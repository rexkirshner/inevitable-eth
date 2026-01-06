---
name: build-check
description: Pre-push build gate - runs lint, typecheck, tests, and build to ensure code is ready to push
---

# /build-check Command

Run all quality gates before pushing to remote. This command executes lint, typecheck, tests, and build in sequence, stopping at the first failure. Use this to catch CI failures locally.

## CRITICAL RULES

1. **Stop on first failure** - Don't continue if a check fails
2. **Run all checks** - Lint, types, tests, build (in that order)
3. **Report clear status** - Pass/fail for each step
4. **Suggest fixes** - For common failures

## When to Use This Command

**Good times:**
- Before pushing to main/master
- Before creating a PR
- After major changes
- When you want CI-like feedback locally

**Bad times:**
- During active development (too slow)
- For quick WIP commits
- When intentionally pushing broken code to a feature branch

## Execution Steps

### Step 0: Set Expectations

```
Build Check (Pre-Push Gate)

Running: Lint -> TypeCheck -> Tests -> Build

This mirrors your CI pipeline. All checks must pass.
Stopping on first failure to save time.
```

### Step 1: Detect Project Configuration

**Identify available checks:**

```bash
# Check package.json for available scripts
cat package.json | grep -E '"(lint|typecheck|tsc|check|test|build)"'

# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then
  PKG="pnpm"
elif [ -f "yarn.lock" ]; then
  PKG="yarn"
else
  PKG="npm"
fi
echo "Package manager: $PKG"

# Detect framework
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ]; then
  FRAMEWORK="nextjs"
elif [ -f "astro.config.mjs" ]; then
  FRAMEWORK="astro"
elif [ -f "vite.config.ts" ]; then
  FRAMEWORK="vite"
else
  FRAMEWORK="generic"
fi
echo "Framework: $FRAMEWORK"
```

**Create check inventory:**

| Check | Available | Command | Priority |
|-------|-----------|---------|----------|
| Lint | Yes/No | npm run lint | 1 |
| TypeCheck | Yes/No | npm run typecheck | 2 |
| Tests | Yes/No | npm run test | 3 |
| Build | Yes/No | npm run build | 4 |

### Step 2: Run Lint Check

**Execute linting:**

```bash
echo "Step 1/4: Linting..."

# Try common lint commands
if $PKG run lint 2>/dev/null; then
  echo "Lint: PASSED"
else
  echo "Lint: FAILED"
  echo ""
  echo "Common fixes:"
  echo "  $PKG run lint:fix    # Auto-fix issues"
  echo "  $PKG run lint -- --fix"
  exit 1
fi
```

**If lint fails, report:**

```
Lint Check: FAILED

Found [N] lint errors:

src/components/Button.tsx:12 - 'unused' is defined but never used
src/utils/helpers.ts:45 - Unexpected console statement
app/api/route.ts:23 - Missing return type on function

Quick Fixes:
1. Run: npm run lint:fix
2. Manually fix remaining issues
3. Re-run /build-check

Stopping here. Fix lint errors before continuing.
```

### Step 3: Run TypeScript Check

**Execute type checking:**

```bash
echo "Step 2/4: Type checking..."

# Try common typecheck commands
if $PKG run typecheck 2>/dev/null || $PKG run tsc --noEmit 2>/dev/null; then
  echo "TypeCheck: PASSED"
else
  echo "TypeCheck: FAILED"
  exit 1
fi
```

**If typecheck fails, report:**

```
TypeScript Check: FAILED

Found [N] type errors:

src/api/client.ts:34:5 - error TS2322: Type 'string' is not assignable to type 'number'
src/components/Form.tsx:56:10 - error TS2345: Argument of type 'null' is not assignable
app/page.tsx:12:3 - error TS7006: Parameter 'data' implicitly has an 'any' type

Common Fixes:
1. Add missing type annotations
2. Fix type mismatches
3. Check for null/undefined handling

Stopping here. Fix type errors before continuing.
```

### Step 4: Run Tests

**Execute test suite:**

```bash
echo "Step 3/4: Running tests..."

# Run tests
if $PKG run test 2>/dev/null || $PKG run test:unit 2>/dev/null; then
  echo "Tests: PASSED"
else
  echo "Tests: FAILED"
  exit 1
fi
```

**If tests fail, report:**

```
Test Check: FAILED

[N] tests failed:

FAIL src/utils/helpers.test.ts
  formatDate
    expected "2024-01-01" but received "01-01-2024"

FAIL src/api/client.test.ts
  fetchUser
    Timeout - Async callback was not invoked within 5000ms

Common Fixes:
1. Review failing test output above
2. Check for async/timeout issues
3. Verify test data/mocks are correct

Stopping here. Fix failing tests before continuing.
```

### Step 5: Run Build

**Execute production build:**

```bash
echo "Step 4/4: Building..."

# Run build
if $PKG run build 2>/dev/null; then
  echo "Build: PASSED"
else
  echo "Build: FAILED"
  exit 1
fi
```

**If build fails, report:**

```
Build Check: FAILED

Build error:

Error: Failed to compile.
./src/components/Modal.tsx:23:5
Type error: Property 'onClose' is missing in type '{}' but required

Common Fixes:
1. This is often a type error that slipped past tsc
2. Check component props
3. Review recent changes to the file mentioned

Stopping here. Fix build errors before continuing.
```

### Step 6: Report Results

**All checks passed:**

```
Build Check Complete: ALL PASSED

Lint:      PASSED
TypeCheck: PASSED
Tests:     PASSED (42 tests, 0 failures)
Build:     PASSED

Ready to push to remote.

git push origin $(git branch --show-current)
```

**Some checks failed:**

```
Build Check Complete: FAILED

Lint:      PASSED
TypeCheck: PASSED
Tests:     FAILED (42 tests, 3 failures)
Build:     SKIPPED

Failed at: Tests

Fix the failing tests and re-run /build-check

Do NOT push until all checks pass.
```

## Framework-Specific Commands

### Next.js

```bash
# Lint
next lint

# TypeCheck
tsc --noEmit

# Build (includes type checking)
next build
```

### Astro

```bash
# TypeCheck
astro check

# Build
astro build
```

### Vite + React

```bash
# Lint
eslint .

# TypeCheck
tsc --noEmit

# Build
vite build
```

### Node.js / Express

```bash
# Lint
eslint .

# TypeCheck
tsc --noEmit

# Tests
jest

# Build (if applicable)
tsc
```

## Common Failure Patterns

### Lint Failures

| Error | Cause | Fix |
|-------|-------|-----|
| 'x' is defined but never used | Unused import/variable | Remove or prefix with _ |
| Unexpected console statement | console.log in code | Remove or disable rule |
| Missing return type | No explicit return | Add return type annotation |

### TypeScript Failures

| Error | Cause | Fix |
|-------|-------|-----|
| TS2322: Type mismatch | Wrong type assignment | Fix the type or add assertion |
| TS2345: Argument type | Wrong function argument | Check function signature |
| TS7006: Implicit any | Missing type annotation | Add explicit type |
| TS2532: Possibly undefined | Null check missing | Add null guard |

### Test Failures

| Error | Cause | Fix |
|-------|-------|-----|
| Timeout | Async not awaited | Add await or increase timeout |
| Snapshot mismatch | UI changed | Update snapshot or fix UI |
| Assertion failed | Logic error | Debug and fix code |

### Build Failures

| Error | Cause | Fix |
|-------|-------|-----|
| Module not found | Missing dependency | npm install |
| Type error | TSC caught something | Fix the type error |
| Out of memory | Large build | Increase Node memory |

## Customizing the Check

### Skip Tests (Emergency Only)

```bash
# NOT RECOMMENDED - but for emergencies
SKIP_TESTS=true /build-check
```

### Run Specific Check Only

```bash
# For debugging a specific failure
npm run lint
npm run typecheck
npm run test
npm run build
```

### Increase Verbosity

The command will show full output for any failing step. Passing steps show summary only.

## CI Parity

This command mirrors typical CI configuration:

```yaml
# .github/workflows/ci.yml equivalent
jobs:
  build:
    steps:
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

Running `/build-check` locally before pushing ensures CI won't fail.

## Quick Reference

```
/build-check

Runs in order:
1. Lint (fast, catches style issues)
2. TypeCheck (medium, catches type errors)
3. Tests (slow, catches logic errors)
4. Build (slowest, final verification)

Stops on first failure.
Reports status for each step.
Suggests fixes for common issues.
```

---

**Version:** 4.0.1
