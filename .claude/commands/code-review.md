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

**MANDATORY: You MUST save the report to a file. Do NOT just display it in chat.**

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

**CRITICAL REQUIREMENT**: You MUST save the report to a file. This is NOT optional.

**ACTION REQUIRED - Do this NOW after completing your analysis:**

1. Create the directory: `mkdir -p artifacts/code-reviews`
2. Determine the session number from SESSIONS.md
3. Use the Write tool to save the complete report to `artifacts/code-reviews/session-[N]-review.md`

The report file MUST contain:
- All findings from your analysis (not a summary)
- Actual issue details, file locations, and line numbers
- The complete markdown structure shown in Step 6
- Real values replacing all `[N]`, `[YYYY-MM-DD]`, and other placeholders

**DO NOT:**
- Skip saving the file
- Only display the report in chat
- Save a template with unfilled placeholders
- Save a summary instead of the full report

**Example filename:** `artifacts/code-reviews/session-14-review.md`

After saving, confirm with:
```
✅ Report saved to: artifacts/code-reviews/session-[N]-review.md
📄 You can view the detailed report at: artifacts/code-reviews/session-[N]-review.md
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

### Step 8: Integration & Actionability

**IMPORTANT**: This step makes findings actionable by integrating with the context system and generating tasks.

#### 8.1: Prepare Issues JSON

Create a JSON file with all issues found in the review:

```bash
# Create JSON from review findings
cat > artifacts/code-reviews/session-[N]-issues.json <<'EOF'
[
  {
    "id": "C1",
    "severity": "CRITICAL",
    "message": "[Issue description]",
    "file": "path/to/file.ts",
    "line": 123,
    "category": "Security",
    "impact": "[Why this matters]"
  },
  // ... all issues from review
]
EOF
```

**Include all issues** from the review report (Critical, High, Medium, Low).

#### 8.2: Load Helper Functions

```bash
# Source the code review helpers
source scripts/code-review-helpers.sh
source scripts/common-functions.sh
```

#### 8.3: Smart Grouping & TodoWrite Tasks

Offer to create TodoWrite tasks from findings:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ACTIONABLE TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 42 issues (3 critical, 5 high, 34 medium/low)

Create TodoWrite tasks for critical and high priority issues? (Y/n) >
```

If user says Yes:

```bash
# Group similar issues
group_similar_issues \
  "artifacts/code-reviews/session-[N]-issues.json" \
  "artifacts/code-reviews/session-[N]-grouped.json"

# Generate TodoWrite tasks (CRITICAL + HIGH)
generate_todowrite_tasks \
  "artifacts/code-reviews/session-[N]-grouped.json" \
  "HIGH" \
  "artifacts/code-reviews/session-[N]-tasks.md"
```

Then display the generated tasks:

```
🧠 Smart grouping detected:
   - 25 similar errors: Missing @testing-library/jest-dom type definitions
   - 12 similar errors: Unused imports
   - 5 unique errors

Creating 7 grouped tasks:

Critical Issues (3):
✅ [pending] Fix SQL injection in search API (api/search.ts:123)
✅ [pending] Add rate limiting to auth endpoints (3 files affected)
✅ [pending] Remove hardcoded secrets from config (config.ts:89)

High Priority (4):
✅ [pending] Fix missing type definitions for @testing-library/jest-dom (25 files)
✅ [pending] Remove unused imports (12 files)
✅ [pending] Add error handling to async operations (api/users.ts:456)
✅ [pending] Fix Decimal type handling (utils/math.ts:78)

Total: 7 actionable tasks created from 42 findings

💡 Run /save to persist tasks to SESSIONS.md
```

#### 8.4: Context Integration

Offer to add critical findings to context system:

```
Add critical issues to context/KNOWN_ISSUES.md? (Y/n) >
```

If user says Yes:

```bash
# Find context directory
CONTEXT_DIR=$(find_context_dir)

# Add critical issues to KNOWN_ISSUES.md
add_to_known_issues \
  "artifacts/code-reviews/session-[N]-issues.json" \
  "$CONTEXT_DIR/KNOWN_ISSUES.md" \
  "[N]" \
  "../artifacts/code-reviews/session-[N]-review.md" \
  "CRITICAL"
```

Show confirmation:

```
✅ Added 3 critical issues to KNOWN_ISSUES.md:
   - SQL injection vulnerability in search API
   - Missing rate limiting on auth endpoints
   - Hardcoded secrets in configuration
```

Then offer STATUS.md update:

```
Update context/STATUS.md with review summary? (Y/n) >
```

If user says Yes:

```bash
# Update STATUS.md
update_status_summary \
  "$CONTEXT_DIR/STATUS.md" \
  "[N]" \
  "[Grade]" \
  "[Critical count]" \
  "[High count]" \
  "[Medium count]" \
  "../artifacts/code-reviews/session-[N]-review.md"
```

Show confirmation:

```
✅ Updated STATUS.md under "Recent Changes":

### Code Review - Session [N] (YYYY-MM-DD)
**Grade:** B (needs improvement before production)
**Critical Issues:** 3 🔴
**High Priority:** 5 ⚠️
**Full Report:** [Code Review Details](../artifacts/code-reviews/session-[N]-review.md)
```

#### 8.5: Review History Tracking

Automatically create/update review history:

```bash
# Update INDEX.md (always run, no prompt needed)
create_review_history \
  "artifacts/code-reviews/INDEX.md" \
  "[N]" \
  "[Grade]" \
  "[Critical count]" \
  "[High count]" \
  "[Medium count]" \
  "[Low count]" \
  "[Files reviewed]" \
  "session-[N]-review.md"
```

#### 8.6: Comparison with Previous Review

If previous review exists, show comparison:

```bash
# Find latest previous review
PREVIOUS_REVIEW=$(find_latest_review)

if [ -n "$PREVIOUS_REVIEW" ]; then
  # Compare with previous
  compare_with_previous \
    "artifacts/code-reviews/session-[N]-issues.json" \
    "$PREVIOUS_REVIEW" \
    "artifacts/code-reviews/session-[N]-comparison.json"

  # Display comparison (read the JSON and format nicely)
fi
```

Example output if previous review exists:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 COMPARISON WITH PREVIOUS REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Previous Review: Session 8 (2025-11-15) - 2 days ago

Grade:     A  → B+  ⚠️ Slight regression
Critical:  2  → 3   ⚠️ +1 new critical issue
High:      2  → 5   ⚠️ +3 new high priority
Medium:    8  → 7   ✅ 1 resolved
Low:       5  → 5   ━ No change

✅ RESOLVED ISSUES (3):

Medium Priority (3):
  ✅ M1: Console.log statements in production code
     Fixed in: Session 11 (2025-11-16)
     Time to fix: 1 day

  ✅ M2: Missing JSDoc comments
     Fixed in: Session 12 (2025-11-17)

  ✅ M3: Unused imports
     Fixed in: Session 12 (2025-11-17)

⚠️ STILL OPEN (10):
  ⚠️ H1: Missing error handling (Age: 2 days)
  ⚠️ H2: Input validation gaps (Age: 2 days)
  ... (see full report for details)

🆕 NEW ISSUES (7):
  🔴 C3: Hardcoded secrets in config (NEW)
  ⚠️ H3: SQL injection in search (NEW)
  ⚠️ H4: Missing rate limiting (NEW)
  ... (4 more new issues)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Progress Summary:
  - Issues resolved: 3
  - Issues still open: 10
  - New issues found: 7
  - Net change: +4 issues (regression)
  - Grade change: A → B+ (slight decline)

⚠️ Action Recommended: Address new critical and high priority issues
before quality degrades further.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Step 8 Completion

After all integration steps:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ REVIEW INTEGRATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Files Created/Updated:
  ✅ artifacts/code-reviews/session-[N]-review.md (full report)
  ✅ artifacts/code-reviews/session-[N]-issues.json (issues data)
  ✅ artifacts/code-reviews/session-[N]-grouped.json (smart grouping)
  ✅ artifacts/code-reviews/session-[N]-tasks.md (TodoWrite tasks)
  ✅ artifacts/code-reviews/INDEX.md (history updated)
  ✅ context/KNOWN_ISSUES.md (critical issues added)
  ✅ context/STATUS.md (review summary added)

📋 Next Steps:
  1. Review generated TodoWrite tasks
  2. Run /save to persist tasks to SESSIONS.md
  3. Begin fixing critical issues in a new session
  4. Re-run /code-review after fixes to track progress

⏱️  Review took: [duration]
💾 All findings preserved in context system for future AI sessions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

---

**💬 Feedback**: Any feedback on the code review? (Add to `context/context-feedback.md`)

- Were the findings accurate and helpful?
- Any false positives or missed issues?
- Was the review thorough enough?
- Suggestions for improving review quality?

---

## Final Checklist Before Completing

Before saying the review is complete, verify:

- [ ] **Report file saved** to `artifacts/code-reviews/session-[N]-review.md`
- [ ] Report contains actual findings (not placeholders)
- [ ] All critical and high priority issues documented
- [ ] Grade assigned with justification
- [ ] No code changes were made

**If the report file does not exist, the review is NOT complete.**

---

**Version:** 3.6.0
**Updated:** v3.6.0 - Strengthened requirement to save report file to artifacts/
