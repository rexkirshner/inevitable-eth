---
name: code-review
description: Comprehensive code quality audit without making any changes
---

# /code-review Command

Conduct a thorough, unhurried code quality audit. This command **NEVER makes changes** - it only identifies issues and suggests improvements. Fixes happen in a separate session after review.

**Full guide:** `.claude/docs/code-review-guide.md`

## ⚠️ CRITICAL RULES

1. **NEVER make code changes during review** - This is analysis only
2. **Take your time** - No rushing, no time pressure
3. **Don't break anything** - If uncertain, note it, don't change it
4. **Separate concerns** - Review finds issues, fixes come later
5. **Be thorough** - This is when we have time to be comprehensive

**Why:** See "The No Changes Rule" in `.claude/docs/code-review-guide.md`

## When to Use This Command

**Good times:**
- After completing a feature or phase
- Before deployment or major milestones
- When quality matters more than speed
- **Only when you have plenty of time** - user will only run this when unbound by time

**Bad times:**
- Time is limited
- In middle of active development
- During urgent fixes

## Execution Steps

### Step 0: Set Expectations

**Before starting, explicitly state:**

```
🔍 Starting Code Review

This will be a thorough, unhurried analysis.
I will NOT make any changes during this review.
All issues found will be documented for fixing in a separate session.
Taking my time to be comprehensive...
```

### Step 1: Load Context and Standards

**Read these files:**
- context/CODE_STYLE.md - Know the standards
- context/ARCHITECTURE.md - Understand design
- context/DECISIONS.md - Know past choices
- context/KNOWN_ISSUES.md - Aware of existing issues
- context/.context-config.json - User preferences

**Internalize standards:**
- Simplicity above all
- No temporary fixes
- Root cause solutions only
- Surgical code changes
- Full code flow tracing

### Step 2: Analyze Project Structure

**Scan directory structure:**
```bash
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -50
ls -la src/ app/ lib/ components/ 2>/dev/null
```

**Identify areas to review:**
- Core business logic
- API routes/endpoints
- Data handling
- UI components
- Utilities and helpers
- Configuration files
- Test coverage

**Create review checklist:**
- [ ] All major code areas identified
- [ ] Priority areas noted
- [ ] Scope is clear

### Step 3: Code Quality Analysis

Review each area systematically. **NO CHANGES - ONLY ANALYSIS**

Use specialized checklists for thoroughness:
- **Security:** `.claude/checklists/security.md`
- **Accessibility:** `.claude/checklists/accessibility.md`
- **SEO:** `.claude/checklists/seo-review.md`
- **Performance:** `.claude/checklists/performance.md`

#### Review Categories

**1. Architecture & Design**
- Architectural patterns match ARCHITECTURE.md?
- Separation of concerns maintained?
- Dependencies flow correctly?
- Coupling minimal, cohesion high?

**2. Code Standards** (from CODE_STYLE.md)
- Simplicity principle followed?
- No temporary/hacky fixes?
- Root causes addressed?
- Clear, readable code?

**3. Performance** (checklist: `.claude/checklists/performance.md`)
- Core Web Vitals acceptable?
- Bundle sizes reasonable?
- Images optimized?
- Efficient database queries?

**4. Security** (checklist: `.claude/checklists/security.md`)
- Input validation present?
- SQL injection protection?
- XSS vulnerabilities?
- Secrets in code?

**5. Error Handling**
- Proper try-catch usage?
- Meaningful error messages?
- Error logging?
- User feedback?

**6. Testing**
- Critical paths tested?
- Edge cases covered?
- Test quality good?

**7. Accessibility** (checklist: `.claude/checklists/accessibility.md`, if UI)
- Semantic HTML?
- Keyboard navigation?
- Screen reader support?
- Color contrast?

**8. SEO** (checklist: `.claude/checklists/seo-review.md`, if public web)
- Meta tags present?
- Heading hierarchy correct?
- Core Web Vitals acceptable?
- Structured data present?

**9. TypeScript Configuration** (if TypeScript project)
- **ACTION:** Read tsconfig.json to verify settings
- Strict mode enabled? (`"strict": true`)
- No implicit any? (`"noImplicitAny": true` or covered by strict)
- Strict null checks? (`"strictNullChecks": true` or covered by strict)
- Other strict flags appropriate for project?
- **IMPORTANT:** Always verify actual tsconfig.json content before claiming issues

**Document findings:**
```markdown
### [Category] Issues

**[ID]: [Issue Title]**
- Severity: Critical/High/Medium/Low
- Location: file.ts:123-145
- Issue: [What's wrong]
- Impact: [Why it matters]
- Root Cause: [Why it happened]
- Suggestion: [How to fix]
- Effort: [Time estimate]
```

### Step 4: Identify Patterns and Root Causes

**Look for systemic issues:**
- Same mistake repeated across files?
- Architectural flaw causing problems?
- Missing knowledge/skills?
- Technical debt accumulated?

**Categorize issues:**
- **Quick wins:** Easy to fix, high impact
- **Refactoring needed:** Architectural changes
- **Technical debt:** Accumulated problems
- **Learning opportunities:** Skill gaps

### Step 5: Check Against KNOWN_ISSUES.md

**Cross-reference:**
- [ ] Are documented issues actually issues?
- [ ] Are there undocumented issues?
- [ ] Have documented issues been fixed?
- [ ] Are severities accurate?

**Update understanding:**
- Note issues to add to KNOWN_ISSUES.md
- Note issues to remove (if fixed)
- Adjust severities based on findings

### Step 6: Generate Comprehensive Report

Create detailed report in `artifacts/code-reviews/session-[N]-review.md`:

```markdown
# Code Review Report - Session [N]
**Date:** YYYY-MM-DD
**Reviewer:** Claude Code
**Scope:** [What was reviewed]
**Duration:** [Time spent]

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Overall Assessment:**
[2-3 sentences on code quality]

**Critical Issues:** [Number]
**High Priority:** [Number]
**Medium Priority:** [Number]
**Low Priority:** [Number]

**Top 3 Recommendations:**
1. [Most important thing to fix]
2. [Second most important]
3. [Third most important]

---

## Detailed Findings

### Critical Issues (Fix Immediately)

#### C1: [Issue Title]
- **Severity:** Critical
- **Location:** file.ts:123-145
- **Issue:** [What's wrong]
- **Impact:** [Why it matters]
- **Root Cause:** [Why it happened]
- **Suggestion:** [How to fix]
- **Effort:** [Time estimate]

[Repeat for each critical issue]

### High Priority Issues (Fix Soon)

[Same format as critical]

### Medium Priority Issues (Address When Possible)

[Same format]

### Low Priority Issues (Nice to Have)

[Same format]

---

## Positive Findings

**What's Working Well:**
- [Good pattern 1]
- [Good pattern 2]
- [Well-structured code area]

**Strengths:**
- [Architecture strength]
- [Code quality strength]
- [Best practices followed]

---

## Patterns Observed

**Recurring Issues:**
1. [Pattern repeated across codebase]
2. [Another common problem]

**Root Causes:**
1. [Systemic issue causing problems]
2. [Architectural flaw]

**Quick Wins:**
- [Easy fix with high impact]
- [Low-hanging fruit]

---

## Recommendations

### Immediate Actions (This Week)
1. [Critical fix 1]
2. [Critical fix 2]
3. [Critical fix 3]

### Short-term Improvements (This Month)
1. [High priority fix 1]
2. [High priority fix 2]
3. [Refactoring need]

### Long-term Enhancements (Backlog)
1. [Architectural improvement]
2. [Major refactor]
3. [Infrastructure upgrade]

---

## Metrics

- **Files Reviewed:** [N]
- **Lines of Code:** [N]
- **Issues Found:** [N total] (C:[N], H:[N], M:[N], L:[N])
- **Test Coverage:** [%] (if measurable)
- **Code Complexity:** [Assessment]

---

## Compliance Check

**CODE_STYLE.md Compliance:**
- [✅/⚠️/❌] Simplicity principle
- [✅/⚠️/❌] No temporary fixes
- [✅/⚠️/❌] Root cause solutions
- [✅/⚠️/❌] Minimal code impact

**ARCHITECTURE.md Compliance:**
- [✅/⚠️/❌] Follows documented patterns
- [✅/⚠️/❌] Respects design decisions
- [✅/⚠️/❌] Maintains separation

---

## Next Steps

**For User:**
1. Review this report
2. Prioritize issues to address
3. Run /save-context to capture state
4. Start fixing in new session

**Suggested Fix Order:**
1. [Critical issue to fix first]
2. [Then this]
3. [Then this]

**Estimated Total Effort:** [Hours/Days]

---

## Notes

- [Any additional context]
- [Uncertainties or questions]
- [Areas needing user input]

---

## Review Checklist

- [✅] All major areas reviewed
- [✅] Issues categorized by severity
- [✅] Root causes identified
- [✅] Suggestions provided
- [✅] No changes made to code
- [✅] Report is actionable
```

### Step 7: Report Completion

**Console output:**

```
✅ Code Review Complete

**Report saved to:** artifacts/code-reviews/session-[N]-review.md

**Summary:**
- Grade: B+
- Critical Issues: 1
- High Priority: 3
- Medium Priority: 7
- Low Priority: 12

**Top 3 Recommendations:**
1. Fix SQL injection in search API (CRITICAL)
2. Add unit tests for authentication (HIGH)
3. Refactor complex Dashboard component (MEDIUM)

**Next Steps:**
1. Review full report at artifacts/code-reviews/session-[N]-review.md
2. Prioritize fixes with user
3. Run /save-context
4. Address issues in separate session

⚠️ Remember: NO changes were made during review.
All issues documented for fixing later.
```

## Important Guidelines

### The "No Changes" Rule

**Every temptation follows this pattern:**
1. You notice something fixable
2. You think "this is quick and easy"
3. You're tempted to fix it now
4. **You must resist and document instead**

**See full explanation:** `.claude/docs/code-review-guide.md` - "The No Changes Rule"

### Taking Your Time

User runs this when they have time. Be thorough:
- Read code carefully
- Trace through logic
- Consider edge cases
- Question assumptions

**Missing issues is worse than taking time.**

### Grading Rubric

- **A (90-100%):** Excellent - follows all standards, well-tested, secure, minimal tech debt
- **B (80-89%):** Good - mostly follows standards, minor issues, decent coverage
- **C (70-79%):** Adequate - some violations, medium issues, gaps in testing
- **D (60-69%):** Poor - many violations, high priority issues, major gaps
- **F (<60%):** Failing - critical security issues, no tests, unsustainable debt

**Full rubric:** `.claude/docs/code-review-guide.md` - "Grading Rubric"

## Error Handling

**If scope too large:** Report it, suggest reviewing in chunks
**If unfamiliar technology:** Note in report, focus on general principles
**If can't determine issue:** Document uncertainty, suggest investigation

## Success Criteria

✅ Comprehensive analysis completed
✅ All issues documented with details
✅ No code changes made
✅ Clear, actionable recommendations
✅ User knows what to fix and in what order

**See:** `.claude/docs/code-review-guide.md` - "Success Criteria"
