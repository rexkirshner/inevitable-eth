---
name: code-review-testing
description: Test coverage and quality audit - coverage gaps, test patterns, mocking strategy, CI integration
---

# /code-review-testing Command

Conduct a thorough test coverage and quality audit. This command **NEVER makes changes** - it only identifies testing gaps and suggests improvements. Fixes happen in a separate session after review.

## CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Run actual coverage reports** - Don't estimate coverage
3. **Quality over quantity** - 100% coverage means nothing if tests are bad
4. **Consider test types** - Unit, integration, e2e all serve different purposes

## When to Use This Command

**Good times:**
- Before adding features to untested code
- When test suite takes too long
- After major refactoring
- When bugs keep appearing in "tested" code
- Before setting coverage thresholds

**Bad times:**
- Prototype code not intended to last
- Script-only projects
- When coverage is already comprehensive

## Test Pyramid

```
        /\         E2E Tests (few, slow, high confidence)
       /  \
      /----\       Integration Tests (some, medium speed)
     /      \
    /--------\     Unit Tests (many, fast, focused)
```

### Test Type Guidelines

| Type | Speed | Scope | Coverage Target |
|------|-------|-------|-----------------|
| Unit | < 10ms | Single function/class | 80%+ |
| Integration | < 1s | Multiple units together | Key flows |
| E2E | > 1s | Full user journey | Critical paths |

## Execution Steps

### Step 0: Set Expectations

```
Test Coverage & Quality Audit

Scope: Coverage gaps, test patterns, mocking, CI integration
Test Framework: [detected]
Coverage Tool: [detected]

This is a READ-ONLY audit. No changes will be made.
Taking time to be thorough...

Analysis will include:
- Coverage report generation
- Test file analysis
- Mock/stub audit
- Test pattern review
- CI configuration check
```

### Step 1: Identify Test Configuration

**Find test framework and config:**

```bash
# Check package.json for test scripts
grep -A5 '"test"' package.json

# Find test config files
find . -name "jest.config.*" -o -name "vitest.config.*" -o -name "*.test.config.*" 2>/dev/null

# Find test files
find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" 2>/dev/null | wc -l

# Find test directories
find . -type d -name "__tests__" -o -type d -name "tests" -o -type d -name "test" 2>/dev/null
```

**Create configuration inventory:**

| Aspect | Current | Notes |
|--------|---------|-------|
| Framework | Jest/Vitest | |
| Coverage Tool | c8/istanbul | |
| Coverage Threshold | None/80% | |
| Test Location | colocated/__tests__ | |
| CI Integration | Yes/No | |

### Step 2: Generate Coverage Report

**Run coverage analysis:**

```bash
# Try common coverage commands
npm run test:coverage 2>/dev/null || \
npm run coverage 2>/dev/null || \
npx vitest run --coverage 2>/dev/null || \
npx jest --coverage 2>/dev/null
```

**Analyze coverage output:**

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Statements | X% | 80% | |
| Branches | X% | 75% | |
| Functions | X% | 80% | |
| Lines | X% | 80% | |

### Step 3: Identify Coverage Gaps

**Find untested files:**

```bash
# List files with no corresponding test
for file in $(find src -name "*.ts" -o -name "*.tsx" | grep -v ".test\." | grep -v ".spec\."); do
  testfile=$(echo "$file" | sed 's/\.tsx\?$/.test.ts/')
  if [ ! -f "$testfile" ] && [ ! -f "${testfile}x" ]; then
    echo "No test: $file"
  fi
done

# Find complex files (likely need tests)
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
```

**Categorize untested code:**

| File/Component | Lines | Complexity | Risk | Priority |
|----------------|-------|------------|------|----------|
| api/client.ts | 450 | High | High | Critical |
| utils/helpers.ts | 120 | Low | Low | Low |
| components/Form.tsx | 200 | Medium | Medium | Medium |

### Step 4: Analyze Test Quality

**Check test patterns:**

```bash
# Find tests with no assertions
grep -rn "it(\|test(" --include="*.test.*" | while read line; do
  file=$(echo "$line" | cut -d: -f1)
  grep -L "expect\|assert\|should" "$file"
done

# Find tests with multiple assertions (might need splitting)
grep -rn "expect(" --include="*.test.*" -c | awk -F: '$2 > 10 {print}'

# Find tests with .skip or .todo
grep -rn "\.skip\|\.todo\|\.only" --include="*.test.*"

# Find snapshot tests
grep -rn "toMatchSnapshot\|toMatchInlineSnapshot" --include="*.test.*" | wc -l
```

**Quality indicators:**

| Pattern | Count | Assessment |
|---------|-------|------------|
| Tests without assertions | N | Bad - false confidence |
| Skipped tests | N | Debt - should fix or remove |
| .only in tests | N | CI risk - blocks other tests |
| Huge test files | N | Maintainability issue |
| Snapshot overuse | N | Brittle tests |

### Step 5: Audit Mocking Strategy

**Analyze mock usage:**

```bash
# Find jest.mock calls
grep -rn "jest\.mock\|vi\.mock" --include="*.test.*"

# Find manual mocks
find . -path "*/__mocks__/*" -name "*.ts"

# Find spy usage
grep -rn "jest\.spyOn\|vi\.spyOn" --include="*.test.*"

# Find mock implementations
grep -rn "mockImplementation\|mockReturnValue\|mockResolvedValue" --include="*.test.*"

# Find MSW usage (API mocking)
grep -rn "msw\|setupServer\|rest\.\|http\." --include="*.test.*"
```

**Mock categories:**

| Category | Count | Purpose | Risk Level |
|----------|-------|---------|------------|
| Module mocks | N | Replace imports | Medium |
| Spies | N | Track calls | Low |
| API mocks | N | HTTP requests | Medium |
| Timer mocks | N | Control time | Low |
| Manual mocks | N | Consistent fakes | Medium |

**Check for mock smells:**

- [ ] **Mocking too much** - If you mock everything, you test nothing
- [ ] **Mocking implementation details** - Tests break on refactor
- [ ] **No mock cleanup** - State leaks between tests
- [ ] **Mocking what you own** - Should use real implementation

### Step 6: Check Test Isolation

**Find test coupling issues:**

```bash
# Find shared state
grep -rn "beforeAll\|afterAll" --include="*.test.*"

# Find tests that depend on order
grep -rn "describe\.each\|it\.each" --include="*.test.*"

# Find tests that modify global state
grep -rn "global\.\|window\.\|document\." --include="*.test.*"

# Check for async cleanup
grep -rn "afterEach" --include="*.test.*" | wc -l
```

**Isolation checklist:**
- [ ] **Each test can run independently** - No order dependency
- [ ] **State cleaned up after each test** - afterEach cleanup
- [ ] **No global mutations** - Or restored after test
- [ ] **Database tests isolated** - Transaction rollback or cleanup

### Step 7: Analyze Integration Tests

**Find integration test coverage:**

```bash
# Find API tests
grep -rn "supertest\|request(" --include="*.test.*"

# Find database tests
grep -rn "prisma\|db\.\|database" --include="*.test.*"

# Find component integration tests
grep -rn "render\|screen\." --include="*.test.*" | grep -v "unit"
```

**Integration test inventory:**

| Area | Tested | Gaps |
|------|--------|------|
| API endpoints | /api/users, /api/auth | /api/payments |
| Database operations | CRUD users | Complex queries |
| Authentication flow | Login | Password reset |
| Third-party integrations | None | Stripe, SendGrid |

### Step 8: Check E2E Tests

**Find E2E configuration:**

```bash
# Find Playwright/Cypress config
find . -name "playwright.config.*" -o -name "cypress.config.*" 2>/dev/null

# Find E2E test files
find . -name "*.e2e.*" -o -name "*.cy.*" -o -name "*.spec.ts" -path "*/e2e/*" 2>/dev/null

# Check for test fixtures
find . -path "*/fixtures/*" -name "*.json" 2>/dev/null
```

**E2E coverage:**

| User Journey | Covered | Priority |
|--------------|---------|----------|
| Sign up flow | Yes/No | Critical |
| Login/logout | Yes/No | Critical |
| Main feature | Yes/No | Critical |
| Payment flow | Yes/No | Critical |
| Error states | Yes/No | High |

### Step 9: CI Integration Review

**Check CI configuration:**

```bash
# Find CI config
find . -name "*.yml" -path "*/.github/*" 2>/dev/null
cat .github/workflows/*.yml 2>/dev/null | grep -A10 "test"

# Check for coverage reporting
grep -rn "codecov\|coveralls\|coverage" .github/workflows/ 2>/dev/null

# Check for test parallelization
grep -rn "matrix\|parallel\|shard" .github/workflows/ 2>/dev/null
```

**CI checklist:**
- [ ] **Tests run on PR** - Block merge on failure
- [ ] **Coverage reported** - Track changes over time
- [ ] **Coverage thresholds** - Fail if coverage drops
- [ ] **Tests parallelized** - Fast feedback
- [ ] **E2E in CI** - Catch integration issues

### Step 10: Generate Audit Report

**MANDATORY: Save report to file.**

**Determine the next audit number:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && get_next_audit_number "testing" "docs/audits"

# Option 2: Manual check - list existing testing audits
ls docs/audits/testing-audit-*.md 2>/dev/null || echo "No existing audits"
```

**Numbering rule:** Use two-digit format (01, 02, 03...). If no existing audits, start with 01. Otherwise, use the next number after the highest existing.

Create report at `docs/audits/testing-audit-NN.md`:

```markdown
# Testing Audit (NN)

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Repository | [name] |
| Auditor | Claude Code |
| Type | Testing |
| Test Framework | [Jest/Vitest/etc] |
| Duration | [time spent] |

**Constraints:** Read-only audit. No modifications made.

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Coverage Summary:**
- Statement Coverage: [X%]
- Branch Coverage: [X%]
- Function Coverage: [X%]
- Line Coverage: [X%]

**Test Distribution:**
- Unit Tests: [N]
- Integration Tests: [N]
- E2E Tests: [N]

**Top 3 Testing Gaps:**
1. [Most critical gap]
2. [Second most critical]
3. [Third most critical]

---

## Coverage Analysis

### By Metric

| Metric | Current | Target | Gap | Status |
|--------|---------|--------|-----|--------|
| Statements | X% | 80% | X% | [Pass/Fail] |
| Branches | X% | 75% | X% | [Pass/Fail] |
| Functions | X% | 80% | X% | [Pass/Fail] |
| Lines | X% | 80% | X% | [Pass/Fail] |

### By Directory

| Directory | Coverage | Files | Critical |
|-----------|----------|-------|----------|
| src/api/ | 45% | 12 | Yes |
| src/components/ | 78% | 34 | No |
| src/utils/ | 92% | 8 | No |
| src/lib/ | 23% | 5 | Yes |

### Untested Files (Critical)

| File | Lines | Complexity | Risk | Priority |
|------|-------|------------|------|----------|
| api/payments.ts | 340 | High | High | **Critical** |
| lib/auth.ts | 220 | High | High | **Critical** |
| services/email.ts | 150 | Medium | Medium | High |

---

## Test Quality Analysis

### Test Patterns

| Pattern | Count | Assessment |
|---------|-------|------------|
| Tests with assertions | N/N | Good |
| Skipped tests | N | **Needs attention** |
| .only present | N | **CI risk** |
| Empty test blocks | N | **False confidence** |
| Excessive snapshots | N | **Brittle** |

### Test File Health

| Issue | Files | Example |
|-------|-------|---------|
| No assertions | N | user.test.ts:45 |
| Too many assertions | N | form.test.ts (47 expects) |
| Skipped tests | N | api.test.ts:23-45 |
| .only blocking | N | auth.test.ts:12 |

---

## Mock Strategy Analysis

### Mock Usage Summary

| Type | Count | Purpose |
|------|-------|---------|
| Module mocks | N | Replace modules |
| Function spies | N | Track calls |
| API mocks (MSW) | N | HTTP layer |
| Timer mocks | N | Time control |
| Manual mocks | N | Consistent fakes |

### Mock Smells

| Smell | Instances | Risk |
|-------|-----------|------|
| Over-mocking | N | Tests too isolated |
| Implementation mocking | N | Brittle tests |
| No mock cleanup | N | State leaks |
| Mocking own code | N | Missing integration |

### Recommendations

- [ ] Use MSW for API mocking instead of manual fetch mocks
- [ ] Add jest.clearAllMocks() to afterEach
- [ ] Replace implementation mocks with behavior mocks

---

## Test Type Distribution

### Current Distribution

```
Unit:        ████████████████░░░░ 80% (160 tests)
Integration: ██░░░░░░░░░░░░░░░░░░ 15% (30 tests)
E2E:         █░░░░░░░░░░░░░░░░░░░ 5% (10 tests)
```

### Recommended Distribution

```
Unit:        ████████████████░░░░ 70-80%
Integration: ████░░░░░░░░░░░░░░░░ 15-20%
E2E:         ██░░░░░░░░░░░░░░░░░░ 5-10%
```

---

## Integration Test Gaps

### API Endpoints

| Endpoint | Method | Tested | Priority |
|----------|--------|--------|----------|
| /api/auth/login | POST | Yes | - |
| /api/auth/register | POST | Yes | - |
| /api/users/:id | GET | No | **High** |
| /api/payments | POST | No | **Critical** |
| /api/webhooks/stripe | POST | No | **Critical** |

### Database Operations

| Operation | Tested | Priority |
|-----------|--------|----------|
| User CRUD | Partial | High |
| Payment records | No | Critical |
| Transaction rollback | No | High |

---

## E2E Test Coverage

### Critical User Journeys

| Journey | Status | Last Run |
|---------|--------|----------|
| User registration | Covered | Passing |
| Login flow | Covered | Passing |
| Checkout process | **Missing** | - |
| Password reset | **Missing** | - |
| Admin dashboard | Partial | Failing |

### E2E Recommendations

1. Add checkout flow E2E test
2. Add password reset flow test
3. Fix failing admin dashboard test
4. Add mobile viewport tests

---

## CI/CD Integration

### Current State

| Aspect | Status | Notes |
|--------|--------|-------|
| Tests run on PR | Yes | Required |
| Coverage reporting | No | **Add codecov** |
| Coverage thresholds | No | **Set 80%** |
| Test parallelization | No | **Slow CI** |
| E2E in CI | Yes | Playwright |

### CI Configuration Issues

- [ ] No coverage threshold enforcement
- [ ] Tests not parallelized
- [ ] No coverage trend tracking
- [ ] E2E tests not retried on flake

---

## Detailed Findings

### Critical

#### TEST-C1: [Issue Title]
- **Category:** Coverage Gap
- **Location:** `src/api/payments.ts`
- **Problem:** Payment processing logic has 0% test coverage
- **Risk:** Payment bugs could reach production
- **Remediation:**
  - Add unit tests for payment calculation logic
  - Add integration tests for Stripe webhook handling
  - Add E2E test for checkout flow
- **Priority:** Critical

### High Priority

[Same format]

### Medium Priority

[Same format]

---

## Test Performance

### Slowest Tests

| Test | Duration | Location |
|------|----------|----------|
| "should process payment" | 4.5s | payment.test.ts |
| "should send email" | 3.2s | email.test.ts |
| "should render dashboard" | 2.8s | dashboard.test.tsx |

### Recommendations

1. Mock slow external dependencies
2. Use `jest.useFakeTimers()` for timeout tests
3. Parallelize test runs

---

## Prioritized Remediation

### Phase 1: Critical Coverage (Week 1)

1. Add tests for `src/api/payments.ts`
   - Unit tests for calculation logic
   - Integration tests for Stripe webhooks
2. Add tests for `src/lib/auth.ts`
   - Token validation tests
   - Session management tests

### Phase 2: Test Quality (Week 2)

1. Remove or fix skipped tests
2. Remove .only from committed tests
3. Add assertions to empty test blocks
4. Set up proper mock cleanup

### Phase 3: CI Improvements (Week 3)

1. Add coverage thresholds (80%)
2. Set up codecov reporting
3. Parallelize test execution
4. Add coverage PR comments

---

## Metrics Summary

- **Total Test Files:** [N]
- **Total Test Cases:** [N]
- **Overall Coverage:** [X%]
- **Skipped Tests:** [N]
- **Average Test Duration:** [Xs]
- **CI Run Time:** [Xm]

---

## Resources

- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Testing Library Guidelines](https://testing-library.com/docs/guiding-principles)
- [MSW Documentation](https://mswjs.io/)

---

**Generated by:** Claude Code
**Audit Type:** Testing Coverage & Quality
**Version:** 4.0.1
```

### Step 11: Update INDEX.md

**Add entry to docs/audits/INDEX.md:**

```bash
# Option 1: Use helper function (if available)
source scripts/common-functions.sh 2>/dev/null && update_audit_index "docs/audits" "Testing" "testing-audit-NN.md" "[Grade]" "[Summary]"
```

**Option 2: Manual update** - Add this row to the table in INDEX.md (before the comment marker):

```markdown
| YYYY-MM-DD | Testing | [testing-audit-NN.md](./testing-audit-NN.md) | [Grade] | [Coverage: X%, N gaps identified] |
```

### Step 12: Report Completion

```
Test Coverage & Quality Audit Complete

Report saved to: docs/audits/testing-audit-NN.md

Summary:
- Grade: C
- Statement Coverage: 67%
- Branch Coverage: 54%
- Function Coverage: 71%

Test Distribution:
- Unit Tests: 156
- Integration Tests: 23
- E2E Tests: 8

Critical Gaps:
1. api/payments.ts - 0% coverage (payment processing!)
2. lib/auth.ts - 12% coverage (authentication!)
3. No E2E test for checkout flow

Quality Issues:
- 8 skipped tests in codebase
- 2 tests with .only blocking CI
- 12 tests without assertions

CI Issues:
- No coverage thresholds set
- Coverage not tracked over time
- Tests not parallelized (CI takes 12 min)

Next Steps:
1. Review full report at docs/audits/testing-audit-NN.md
2. Add tests for critical payment and auth code
3. Fix or remove skipped tests
4. Configure coverage thresholds in CI
5. Re-run audit after improvements

No changes were made during this audit.
```

## Grading Rubric

| Grade | Criteria |
|-------|----------|
| A | 80%+ coverage, good distribution, quality tests, CI thresholds |
| B | 70%+ coverage, most critical paths tested, CI integration |
| C | 50%+ coverage, some gaps in critical code, basic CI |
| D | < 50% coverage, critical code untested, no thresholds |
| F | < 30% coverage or no meaningful tests |

## Test Quality Patterns

### Good Test Structure

```typescript
describe('PaymentService', () => {
  // Setup once for all tests
  beforeAll(async () => {
    await setupTestDatabase();
  });

  // Clean after each test
  afterEach(async () => {
    await clearPayments();
    jest.clearAllMocks();
  });

  // Cleanup after all tests
  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('processPayment', () => {
    it('should process valid payment', async () => {
      // Arrange
      const payment = createTestPayment({ amount: 100 });

      // Act
      const result = await paymentService.process(payment);

      // Assert
      expect(result.status).toBe('completed');
      expect(result.amount).toBe(100);
    });

    it('should reject invalid card', async () => {
      const payment = createTestPayment({ cardNumber: 'invalid' });

      await expect(paymentService.process(payment))
        .rejects.toThrow('Invalid card number');
    });
  });
});
```

### Testing External APIs with MSW

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.post('https://api.stripe.com/v1/charges', () => {
    return HttpResponse.json({
      id: 'ch_test_123',
      status: 'succeeded',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should create charge', async () => {
  const result = await createCharge({ amount: 1000 });
  expect(result.id).toBe('ch_test_123');
});
```

### Component Testing

```tsx
import { render, screen, userEvent } from '@testing-library/react';

describe('LoginForm', () => {
  it('should submit credentials', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

## References

- [Kent C. Dodds Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Playwright](https://playwright.dev/)

---

**Version:** 4.0.1
