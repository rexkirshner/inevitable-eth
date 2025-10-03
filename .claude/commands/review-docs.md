---
description: Audit all meta-documentation for completeness and quality
---

Please conduct a thorough review of all meta-documentation and provide a comprehensive audit report.

## Review Checklist

### 1. Documentation Existence

**Check that all expected files exist:**
- [ ] CLAUDE.md
- [ ] PRD.md
- [ ] DECISIONS.md
- [ ] KNOWN_ISSUES.md
- [ ] tasks/next-steps.md
- [ ] README.md (for public projects)
- [ ] Any deployment guides (DEPLOYMENT.md, etc.)

**Missing files:**
- List any that should exist but don't

### 2. CLAUDE.md Review

**Completeness:**
- [ ] Project overview is clear and current
- [ ] All npm scripts are documented
- [ ] Architecture section explains structure
- [ ] Development status is up-to-date
- [ ] Critical path reflects recent work
- [ ] File structure is accurate

**Accuracy:**
- [ ] Commands actually work as described
- [ ] File paths are correct
- [ ] Technology versions match package.json
- [ ] Status reflects reality

**Usefulness:**
- [ ] A new developer could get oriented
- [ ] Common tasks are documented
- [ ] Important patterns are explained
- [ ] Links to resources work

**Issues Found:**
- [List specific issues]

**Recommendations:**
- [List improvements needed]

### 3. PRD.md Review

**Completeness:**
- [ ] Vision/goals are clear
- [ ] Current status is accurate
- [ ] Tech stack is documented
- [ ] Implementation phases are defined
- [ ] Progress log is up-to-date
- [ ] Success criteria are defined

**Accuracy:**
- [ ] Version numbers match reality
- [ ] Phase statuses are correct (✅ for done, ⏳ for in-progress)
- [ ] Timeline matches actual progress
- [ ] Roadmap reflects current plans

**Usefulness:**
- [ ] Explains "why" this project exists
- [ ] Clear what's done vs. what's planned
- [ ] Stakeholders could understand status
- [ ] History is preserved

**Issues Found:**
- [List specific issues]

**Recommendations:**
- [List improvements needed]

### 4. DECISIONS.md Review

**Completeness:**
- [ ] Major technical decisions are documented
- [ ] Framework choices explained
- [ ] Architecture patterns justified
- [ ] Trade-offs are listed
- [ ] "When to reconsider" is included

**Accuracy:**
- [ ] Decisions match actual implementation
- [ ] Reasoning still makes sense
- [ ] Trade-offs are honest
- [ ] No outdated information

**Usefulness:**
- [ ] Future developers understand "why"
- [ ] Can evaluate if decisions should change
- [ ] Alternatives are documented
- [ ] Context is preserved

**Missing Decisions:**
- [ ] Recent framework/library choices
- [ ] Architecture patterns not documented
- [ ] Important trade-offs not explained

**Issues Found:**
- [List specific issues]

**Recommendations:**
- [List improvements needed]

### 5. KNOWN_ISSUES.md Review

**Completeness:**
- [ ] Current blockers listed
- [ ] Non-critical issues documented
- [ ] Limitations by design explained
- [ ] Technical debt acknowledged
- [ ] Edge cases noted

**Accuracy:**
- [ ] "Fixed" issues removed
- [ ] Severities are correct (blocking vs. minor)
- [ ] Descriptions match reality
- [ ] Workarounds still work

**Usefulness:**
- [ ] Team knows what's broken
- [ ] Priority is clear
- [ ] Nothing is hidden or glossed over
- [ ] Future work is identified

**Issues Found:**
- [List specific issues]

**Recommendations:**
- [List improvements needed]

### 6. tasks/next-steps.md Review

**Completeness:**
- [ ] Immediate next actions listed
- [ ] Blockers identified
- [ ] Future work documented
- [ ] Maintenance tasks explained
- [ ] Success metrics defined

**Accuracy:**
- [ ] Completed items are marked done
- [ ] Blockers are still actual blockers
- [ ] Priorities are correct
- [ ] Estimates are realistic

**Usefulness:**
- [ ] Clear what to work on next
- [ ] Priorities are obvious
- [ ] Nothing critical is missing
- [ ] Actionable (not vague)

**Issues Found:**
- [List specific issues]

**Recommendations:**
- [List improvements needed]

### 7. Cross-Document Consistency

**Check for contradictions:**
- [ ] CLAUDE.md status matches PRD.md status
- [ ] DECISIONS.md choices reflected in CLAUDE.md architecture
- [ ] KNOWN_ISSUES.md blockers mentioned in next-steps.md
- [ ] PRD.md phases align with next-steps.md
- [ ] All docs tell same story

**Inconsistencies Found:**
- [List contradictions]

### 8. Freshness Check

**How stale is each doc?**
- CLAUDE.md last updated: [Date/estimate]
- PRD.md last updated: [Date/estimate]
- DECISIONS.md last updated: [Date/estimate]
- KNOWN_ISSUES.md last updated: [Date/estimate]
- tasks/next-steps.md last updated: [Date/estimate]

**Staleness Issues:**
- [Any docs that haven't been updated in >1 month with active development]

### 9. Readability & Usability

**For each doc, assess:**
- [ ] Can be skimmed in <5 minutes
- [ ] Headings are clear
- [ ] No walls of text
- [ ] Code examples work
- [ ] Links are not broken
- [ ] Formatting is consistent

**Readability Issues:**
- [List problems]

### 10. New Contributor Test

**Imagine a new developer reads these docs:**
- [ ] Could they understand what this project does?
- [ ] Could they run the project locally?
- [ ] Could they understand the architecture?
- [ ] Could they find what to work on next?
- [ ] Could they understand key decisions?
- [ ] Could they avoid known pitfalls?

**Gaps for New Contributors:**
- [List what's missing]

---

## Audit Report Format

After completing the review, provide a structured report:

```markdown
# Documentation Audit Report

**Date:** YYYY-MM-DD
**Project:** [Project Name]
**Reviewer:** Claude Code

---

## Executive Summary

**Overall Grade:** [A/B/C/D/F]

**Overall Assessment:**
[2-3 sentences on doc quality and usefulness]

**Critical Issues:** [Number]
**Recommendations:** [Number]

---

## File-by-File Assessment

### CLAUDE.md
- **Grade:** [A/B/C/D/F]
- **Strengths:** [What's good]
- **Issues:** [What's wrong]
- **Action Items:** [What to fix]

### PRD.md
- **Grade:** [A/B/C/D/F]
- **Strengths:** [What's good]
- **Issues:** [What's wrong]
- **Action Items:** [What to fix]

### DECISIONS.md
- **Grade:** [A/B/C/D/F]
- **Strengths:** [What's good]
- **Issues:** [What's wrong]
- **Action Items:** [What to fix]

### KNOWN_ISSUES.md
- **Grade:** [A/B/C/D/F]
- **Strengths:** [What's good]
- **Issues:** [What's wrong]
- **Action Items:** [What to fix]

### tasks/next-steps.md
- **Grade:** [A/B/C/D/F]
- **Strengths:** [What's good]
- **Issues:** [What's wrong]
- **Action Items:** [What to fix]

---

## Critical Gaps

**High Priority Issues:**
1. [Issue 1 with impact]
2. [Issue 2 with impact]
3. [Issue 3 with impact]

**Missing Documentation:**
- [What should exist but doesn't]

**Outdated Information:**
- [What's stale or wrong]

**Contradictions:**
- [Where docs disagree with each other or code]

---

## Recommendations

### Immediate Actions (Do Now)
1. [Fix critical issue 1]
2. [Fix critical issue 2]
3. [Fix critical issue 3]

### Short-term Improvements (This Week)
1. [Improvement 1]
2. [Improvement 2]
3. [Improvement 3]

### Long-term Enhancements (Nice to Have)
1. [Enhancement 1]
2. [Enhancement 2]
3. [Enhancement 3]

---

## New Contributor Readiness

**Could a new dev be productive with current docs?**
[Yes/No - explain why]

**Estimated time for new dev to get oriented:**
[Hours/Days]

**Biggest barriers to entry:**
1. [Barrier 1]
2. [Barrier 2]
3. [Barrier 3]

---

## Metrics

- **Doc Coverage:** [%] of codebase documented
- **Freshness:** [Average age of docs in days]
- **Completeness:** [%] of expected sections filled
- **Consistency:** [Number] of contradictions found
- **Usability:** [1-10 rating]

---

## Next Review Date

**Recommended:** [Date 1-3 months from now]

**Triggers for earlier review:**
- Major architecture changes
- New team members joining
- Pre-deployment
- Significant new features

```

---

## Grading Rubric

**A (Excellent):**
- All sections complete and current
- Clear, accurate, useful
- Zero contradictions
- New dev could be productive immediately

**B (Good):**
- Most sections complete
- Generally accurate
- Minor gaps or staleness
- New dev could get oriented with minimal help

**C (Adequate):**
- Key sections present but incomplete
- Some accuracy issues
- Noticeable gaps
- New dev would struggle

**D (Poor):**
- Many sections missing or outdated
- Multiple inaccuracies
- Significant gaps
- Not useful for onboarding

**F (Failing):**
- Critical docs missing
- Mostly inaccurate or contradictory
- Unusable for new developers
- Needs complete rewrite
