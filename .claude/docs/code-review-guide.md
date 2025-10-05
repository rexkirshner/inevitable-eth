# Code Review Guide

Comprehensive guide for conducting thorough code quality audits using `/code-review`.

## Philosophy

Code review is **analysis, not action**. This command finds problems and documents solutions, but never makes changes. The review mindset and the fix mindset are fundamentally different - mixing them leads to rushed decisions and broken code.

## The "No Changes" Rule

### Why This Rule Exists

**Historical evidence:**
- Past reviews that made changes broke working code
- Time pressure during review led to hasty, incomplete fixes
- Analysis requires slow, careful thinking
- Implementation requires focus and testing
- Mixing the two degrades both

**The principle:**
> "Review time is thinking time. Fix time is doing time. Never mix them."

### Temptations to Resist

When reviewing code, you'll constantly see "quick fixes":
- "This is just a typo" - **NO, document it**
- "Just need to rename this variable" - **NO, document it**
- "One-line change would fix this" - **NO, document it**
- "I could add this import real quick" - **NO, document it**

**Every** temptation follows the same pattern:
1. You notice something fixable
2. You think "this is quick and easy"
3. You're tempted to fix it now
4. **You must resist and document instead**

### What To Do Instead

For every issue found:
1. **Document thoroughly** - What's wrong, where, why it matters
2. **Explain the fix** - Clear steps to resolve it
3. **Estimate effort** - How long will this take?
4. **Categorize severity** - Critical, high, medium, low
5. **Identify root cause** - Why did this happen?

The user decides when and how to fix issues, not during review.

## When To Use This Command

### Good Times

- **After completing a feature** - Check quality before moving on
- **Before deployment** - Catch issues before production
- **Before major milestones** - Ensure quality at checkpoints
- **When you have plenty of time** - User explicitly has time to spare
- **Quality over speed** - When thoroughness matters most

### Bad Times

- **Time is limited** - Review needs time to be valuable
- **Mid-development** - Active work shouldn't be interrupted
- **During urgent fixes** - Focus on fixing, review later
- **Under deadline pressure** - Rushing review defeats its purpose

**Key indicator:** User says "only when you have plenty of time" - this is a time-rich command.

## Review Categories

The command reviews these areas systematically:

### 1. Architecture & Design

**What to check:**
- Does structure match ARCHITECTURE.md?
- Separation of concerns maintained?
- Dependencies flow correctly?
- Coupling minimal, cohesion high?
- Abstraction levels appropriate?

**Questions to answer:**
- Does the architecture support requirements?
- Are there architectural smells?
- Over-engineered or under-engineered?
- Do patterns fit the problem?

### 2. Code Standards

**What to check:**
- Simplicity principle followed (from CODE_STYLE.md)?
- No temporary or hacky fixes?
- Root causes addressed?
- Minimal code impact per change?
- Code is clear and readable?

**Anti-patterns to spot:**
- Complex functions (>50 lines)
- Deep nesting (>3 levels)
- Duplicate code
- Magic numbers/strings
- God objects or functions
- Premature optimization

### 3. Performance

**What to check:**
- Unnecessary re-renders (React/UI frameworks)
- Inefficient database queries (N+1 problems)
- Memory leaks
- Blocking operations
- Large bundle sizes
- Unoptimized images/assets

**Reference:** See `.claude/checklists/performance.md` for comprehensive checklist

### 4. Security

**What to check:**
- Input validation present
- SQL injection risks
- XSS vulnerabilities
- CSRF protection
- Authentication/authorization correct
- Secrets in code
- Insecure dependencies

**Reference:** See `.claude/checklists/security.md` for comprehensive checklist

### 5. Error Handling

**What to check:**
- Proper try-catch usage
- Error boundaries (React)
- Meaningful error messages
- Error logging
- Graceful degradation
- User feedback

### 6. Testing

**What to check:**
- Critical paths tested
- Edge cases covered
- Test quality (not just coverage %)
- Integration tests exist
- E2E tests for critical flows
- Appropriate mocking

### 7. Accessibility (UI Projects)

**What to check:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast
- Screen reader support
- Focus management

**Reference:** See `.claude/checklists/accessibility.md` for comprehensive checklist

### 8. SEO (Public Web Projects)

**What to check:**
- Meta tags (title, description, Open Graph)
- Semantic HTML structure
- Heading hierarchy
- Image alt text
- Page load performance (Core Web Vitals)
- Structured data (JSON-LD)
- URL structure
- Sitemap and robots.txt

**Reference:** See `.claude/checklists/seo-review.md` for comprehensive checklist

## Grading Rubric

### A (Excellent) - 90-100%

**Characteristics:**
- Follows all standards from CODE_STYLE.md
- Well-tested, secure code
- Clean, maintainable architecture
- No critical issues, few minor issues
- Minimal technical debt
- Performance optimized
- Accessibility compliant

**When to give:**
- Production-ready code
- Could be used as example for others
- Only cosmetic improvements needed

### B (Good) - 80-89%

**Characteristics:**
- Mostly follows standards
- Minor issues only
- Decent test coverage
- Some technical debt
- Generally secure
- Good enough for production

**When to give:**
- Solid code that works
- A few improvements would help
- No major concerns
- Typical professional quality

### C (Adequate) - 70-79%

**Characteristics:**
- Some standard violations
- Medium priority issues present
- Gaps in testing
- Notable technical debt
- Missing some best practices

**When to give:**
- Code works but needs attention
- Several issues to address
- Refactoring would benefit codebase
- Acceptable but not ideal

### D (Poor) - 60-69%

**Characteristics:**
- Many standard violations
- High priority issues
- Major gaps (testing, security, etc.)
- Significant technical debt
- Maintenance will be difficult

**When to give:**
- Serious refactoring needed
- Multiple high-priority fixes required
- Code works but barely
- Risky to maintain

### F (Failing) - <60%

**Characteristics:**
- Critical security issues
- Major bugs or design flaws
- No tests or severely inadequate
- Unsustainable technical debt
- Doesn't follow any standards

**When to give:**
- Cannot go to production safely
- Fundamental problems exist
- Rewrite might be easier than fixing
- Serious risks present

## Issue Categorization

### Critical (Fix Immediately)

**Criteria:**
- Security vulnerabilities
- Data loss risks
- Production-breaking bugs
- Legal/compliance issues

**Examples:**
- SQL injection vulnerability
- Exposed secrets in code
- Authentication bypass
- Data corruption risk

**Timeline:** Must fix before next deployment

### High Priority (Fix Soon)

**Criteria:**
- Significant impact on users
- Performance problems
- Major bugs
- Accessibility blockers
- Security concerns (non-critical)

**Examples:**
- Slow database queries
- Missing error handling
- Poor performance (LCP >4s)
- Broken core features

**Timeline:** Fix within current sprint/cycle

### Medium Priority (Address When Possible)

**Criteria:**
- Code quality issues
- Minor bugs
- Technical debt
- Missing tests
- Accessibility improvements

**Examples:**
- Complex, hard-to-read code
- Duplicate code
- Missing unit tests
- Suboptimal architecture

**Timeline:** Backlog, address in refactoring sessions

### Low Priority (Nice to Have)

**Criteria:**
- Optimizations
- Code style inconsistencies
- Documentation improvements
- Minor enhancements

**Examples:**
- Could be more efficient
- Inconsistent naming
- Missing code comments
- Better variable names

**Timeline:** Opportunistic fixes, not urgent

## Report Structure

### Executive Summary

**Purpose:** Give user immediate overview

**Contains:**
- Overall grade (A/B/C/D/F)
- Issue counts by severity
- Top 3 recommendations
- Quick assessment (2-3 sentences)

**Length:** 5-10 lines max

### Detailed Findings

**Purpose:** Document every issue found

**Format:**
```markdown
#### [ID]: [Issue Title]
- **Severity:** Critical/High/Medium/Low
- **Location:** file.ts:123-145
- **Issue:** [What's wrong]
- **Impact:** [Why it matters]
- **Root Cause:** [Why it happened]
- **Suggestion:** [How to fix]
- **Effort:** [Time estimate]
```

**Organization:** Group by severity (Critical → High → Medium → Low)

### Positive Findings

**Purpose:** Acknowledge what's working well

**Contains:**
- Good patterns observed
- Strengths of codebase
- Best practices followed
- Well-structured areas

**Why include:** Balance, morale, learning

### Patterns Observed

**Purpose:** Identify systemic issues

**Contains:**
- Recurring issues across codebase
- Root causes of multiple problems
- Architectural flaws
- Missing knowledge/skills

**Value:** Fixing patterns fixes multiple issues

### Recommendations

**Purpose:** Provide actionable roadmap

**Structure:**
1. **Immediate Actions** (This week) - Critical issues
2. **Short-term Improvements** (This month) - High priority
3. **Long-term Enhancements** (Backlog) - Medium/low priority

**Include:** Estimated total effort

### Metrics

**Purpose:** Quantify scope and results

**Include:**
- Files reviewed
- Lines of code
- Issues found (by severity)
- Test coverage (if measurable)
- Code complexity assessment

### Compliance Check

**Purpose:** Verify adherence to standards

**Check against:**
- CODE_STYLE.md principles
- ARCHITECTURE.md patterns
- DECISIONS.md choices
- Best practices

**Format:** ✅ (compliant), ⚠️ (partial), ❌ (non-compliant)

## Taking Your Time

### Why This Matters

Code review is the **one time** we're explicitly told to be thorough:
- User runs this when they have time
- Quality matters more than speed
- Catching issues now prevents bugs later
- This is preventative, not reactive

### How To Be Thorough

**Read code carefully:**
- Don't skim, actually read
- Trace through logic flows
- Consider edge cases
- Think about implications
- Question assumptions

**Think deeply:**
- What could go wrong?
- What's the root cause?
- Is this a pattern or one-off?
- What's the right fix?
- How much effort to fix?

**Check everything:**
- Security implications
- Performance impact
- Accessibility concerns
- SEO impact (if public web)
- Error handling
- Test coverage

**No rushing:**
- Missing issues is worse than taking time
- User expects thoroughness
- This prevents future problems
- Better to be slow and complete

## Error Handling

### Scope Too Large

**Problem:** Codebase too big to review in one session

**Solution:**
- Report the size issue
- Suggest focusing on critical areas first
- Offer to review in chunks (e.g., by feature/module)
- Prioritize areas with highest risk/impact

### Unfamiliar Technology

**Problem:** Code uses technology you're less familiar with

**Solution:**
- Note it in report
- Focus on general principles (still apply)
- Recommend specialist review if critical
- Document what you can assess vs. can't

### Uncertain About Issue

**Problem:** Not sure if something is actually a problem

**Solution:**
- Document the uncertainty
- Explain what's unclear
- Suggest investigation steps
- Mark as lower severity pending investigation

## Success Criteria

### Review Succeeds When:

- ✅ Comprehensive analysis completed
- ✅ All issues documented with details
- ✅ No code changes made during review
- ✅ Clear, actionable recommendations provided
- ✅ User knows exactly what to fix
- ✅ Priorities are clear and justified
- ✅ Effort estimates included
- ✅ Root causes identified (not just symptoms)
- ✅ Report is well-organized and readable

### Perfect Review:

**Characteristics:**
- Thorough and unhurried
- Issues include root causes
- Clear, specific fix suggestions
- Zero code changes made
- Results in more maintainable codebase

**User outcome:**
- Understands all issues
- Knows what to fix first
- Has roadmap for improvements
- Feels confident about code quality
- Can start fixing immediately (in new session)

## Common Pitfalls

### Pitfall 1: Making Changes

**Symptom:** "I'll just fix this real quick..."

**Why it's bad:** Defeats entire purpose, breaks rule, leads to rushed fixes

**How to avoid:** Discipline. Every time you're tempted, write it down instead.

### Pitfall 2: Surface-Level Review

**Symptom:** Only checking obvious things, not thinking deeply

**Why it's bad:** Misses root causes, systemic issues, subtle bugs

**How to avoid:** Take time. Read code carefully. Trace logic flows.

### Pitfall 3: Harsh Criticism Without Solutions

**Symptom:** "This code is bad" without explaining how to improve

**Why it's bad:** Not actionable, demoralizing, unhelpful

**How to avoid:** Always pair criticism with specific suggestions.

### Pitfall 4: Focusing On Style Over Substance

**Symptom:** Lots of comments about naming, formatting, minor style

**Why it's bad:** Misses important issues (security, performance, bugs)

**How to avoid:** Prioritize: Security → Bugs → Performance → Architecture → Style

### Pitfall 5: Overwhelming The User

**Symptom:** Finding 200 issues, all marked high priority

**Why it's bad:** User doesn't know where to start, gets discouraged

**How to avoid:** Proper categorization. Focus on top 3-5 recommendations.

## Best Practices

### 1. Start With Context

Always read:
- CODE_STYLE.md
- ARCHITECTURE.md
- DECISIONS.md
- KNOWN_ISSUES.md

Understanding standards prevents false positives.

### 2. Think Like An Attacker

For security review:
- How could I exploit this?
- What input could break this?
- Where are the trust boundaries?

### 3. Think Like A User

For accessibility/UX:
- Can I use this with keyboard only?
- What if I'm colorblind?
- Does this work on mobile?

### 4. Think Like Future You

For maintainability:
- Will I understand this in 6 months?
- Can I easily modify this?
- Is this code self-documenting?

### 5. Document Root Causes

Don't just say "this is wrong" - explain **why** it's wrong and **why** it happened.

**Example:**
- ❌ Bad: "This function is too complex"
- ✅ Good: "This function violates simplicity principle (CODE_STYLE.md) because it handles authentication, logging, and error handling all in one place. Likely happened due to incremental feature additions without refactoring. Should extract concerns into separate functions."

### 6. Be Specific In Suggestions

Don't just say "fix this" - explain **how** to fix it.

**Example:**
- ❌ Bad: "Improve performance"
- ✅ Good: "Memoize this calculation with useMemo() hook, depends on [userId, filters] only. Prevents expensive array operations on every render."

### 7. Balance Positive And Negative

Always include "Positive Findings" section:
- Acknowledges good work
- Provides learning (what to replicate)
- Maintains morale
- Shows you're being fair

## Using The Checklists

The specialized checklists provide comprehensive criteria:

**Security (.claude/checklists/security.md):**
- Input validation
- SQL injection prevention
- XSS protection
- Authentication/authorization
- Secrets management
- OWASP Top 10 coverage

**Accessibility (.claude/checklists/accessibility.md):**
- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA labels
- WCAG compliance levels

**SEO (.claude/checklists/seo-review.md):**
- Meta tags
- Heading hierarchy
- Core Web Vitals
- Structured data
- URL structure
- Image optimization

**Performance (.claude/checklists/performance.md):**
- Bundle size
- Code splitting
- Image optimization
- Caching strategy
- Database query optimization
- Core Web Vitals

**When to use:**
- Reference during review
- Verify nothing missed
- Cross-check findings
- Learn new criteria

**How to use:**
- Don't just checkbox mechanically
- Understand **why** each item matters
- Adapt to project context
- Focus on what's relevant

## Examples

### Example 1: Critical Security Issue

```markdown
#### S1: SQL Injection Vulnerability

- **Severity:** Critical
- **Location:** app/api/search/route.ts:23-27
- **Issue:** User input from search query is directly interpolated into SQL query without sanitization or parameterization
- **Impact:** Attacker can execute arbitrary SQL commands, potentially reading, modifying, or deleting all database data
- **Root Cause:** Likely unfamiliarity with parameterized queries or rushing to get feature working
- **Suggestion:** Replace string interpolation with parameterized query:
  ```typescript
  // Current (VULNERABLE):
  const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;

  // Fixed (SAFE):
  const query = 'SELECT * FROM products WHERE name LIKE ?';
  const results = await db.query(query, [`%${searchTerm}%`]);
  ```
- **Effort:** 15 minutes (simple find-replace across 3 similar queries)
- **Reference:** OWASP A03:2021 Injection
```

### Example 2: Performance Issue

```markdown
#### P1: Expensive Calculation In Render

- **Severity:** High
- **Location:** components/Dashboard.tsx:45-52
- **Issue:** Array of 1000+ items is sorted on every component render, even when data hasn't changed
- **Impact:** UI lag when interacting with dashboard (200ms+ input delay), poor user experience
- **Root Cause:** Missing memoization - likely not profiled during development
- **Suggestion:** Memoize the sorted array:
  ```typescript
  // Current:
  const sortedItems = items.sort((a, b) => a.priority - b.priority);

  // Fixed:
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.priority - b.priority),
    [items]
  );
  ```
- **Effort:** 5 minutes to add memoization, 15 minutes to verify no regressions
- **Reference:** React Performance Best Practices
```

### Example 3: Accessibility Issue

```markdown
#### A11Y1: Missing Form Labels

- **Severity:** High
- **Location:** components/LoginForm.tsx:12-18
- **Issue:** Email and password inputs lack associated label elements
- **Impact:** Screen reader users cannot identify form fields, making login impossible for blind users. Violates WCAG 2.1 Level A (3.3.2 Labels or Instructions)
- **Root Cause:** Relying on placeholder text instead of proper labels (common mistake)
- **Suggestion:** Add proper label elements:
  ```tsx
  // Current:
  <input type="email" placeholder="Email" />

  // Fixed:
  <label htmlFor="email">Email</label>
  <input type="email" id="email" placeholder="you@example.com" />
  ```
- **Effort:** 10 minutes (4 form fields need labels)
- **Reference:** WCAG 3.3.2, .claude/checklists/accessibility.md
```

## After The Review

### User's Next Steps

1. **Read the full report** - Review all findings
2. **Prioritize issues** - Decide what to fix first
3. **Run /save-context** - Capture current state before fixes
4. **Start fixing in new session** - Separate from review
5. **Update KNOWN_ISSUES.md** - Document issues to track

### Your Role After Review

**You provide:**
- Complete, detailed report
- Clear recommendations
- Effort estimates
- Priority guidance

**You don't:**
- Make any changes
- Start fixing issues
- Continue into implementation
- Push or commit anything

**Boundary:** Review ends when report is complete. Fixes happen in separate session.

## Advanced Tips

### Pattern Recognition

Look for issues that repeat across codebase:
- Same security mistake in 5 API routes
- Duplicate validation logic everywhere
- Consistent accessibility issues

**Value:** Fixing pattern > fixing individual instances

### Root Cause Analysis

Ask "why" five times:
1. "Why is this broken?" - Validation missing
2. "Why is validation missing?" - Developer didn't know it was needed
3. "Why didn't they know?" - No code review process
4. "Why no process?" - Team new to security
5. "Why no training?" - Budget/priority

**Value:** Fix root cause to prevent recurrence

### Quick Wins

Always identify "quick wins" in report:
- High impact
- Low effort
- Easy to implement
- Build momentum

**Example:** "Adding lazy loading to 10 images takes 30 minutes and will improve LCP by 2 seconds"

### Learning Opportunities

Note where issues suggest knowledge gaps:
- Unfamiliarity with security best practices
- Not aware of accessibility requirements
- Don't know performance optimization techniques

**Value:** Suggests training needs, documentation additions

## Summary

**Code review is analysis:**
- Find issues, don't fix them
- Document thoroughly
- Be specific in suggestions
- Take your time
- Use checklists for completeness
- Categorize by severity
- Identify patterns and root causes
- Provide actionable roadmap

**Success means:**
- User knows exactly what's wrong
- User knows exactly how to fix it
- User knows what to prioritize
- No code was changed during review
- Codebase will be more maintainable after fixes
