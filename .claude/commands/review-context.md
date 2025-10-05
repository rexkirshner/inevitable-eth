---
name: review-context
description: Verify context documentation accuracy and session continuity readiness
---

# /review-context Command

Verify that all context documentation is accurate, consistent, and complete enough to resume work seamlessly. This is your session start ritual and continuity checkpoint.

**Full guide:** `.claude/docs/review-context-guide.md`

## When to Use This Command

**Primary use:** First thing at session start (always!)

**Other uses:**
- Before major decisions
- When feeling disoriented
- After someone else worked on project
- Before deployment/milestones
- When documentation feels stale

**See:** `.claude/docs/review-context-guide.md` - "When To Use This Command"

## What This Command Does

1. Loads all context documentation
2. Verifies accuracy against current code
3. Checks internal consistency
4. Assesses completeness for resuming work
5. Reports confidence level for continuity
6. Identifies gaps or issues

## Execution Steps

### Step 1: Verify Context Exists

```
If context/ folder missing:
- Report: "No context found. Run /init-context to set up."
- Stop execution

If context/ exists:
- Proceed to load all documentation
```

### Step 2: Load All Documentation

Read and parse all context files:

```
Files to load:
- context/CLAUDE.md
- context/PRD.md
- context/ARCHITECTURE.md
- context/DECISIONS.md
- context/CODE_STYLE.md
- context/KNOWN_ISSUES.md
- context/SESSIONS.md
- context/tasks/next-steps.md
- context/tasks/todo.md
- context/.context-config.json
```

**Note any missing files** - will affect confidence score.

### Step 3: Check Current Code State

Analyze actual project state:

**Git state:**
```bash
git status
git log --oneline -5
git branch --show-current
git diff HEAD
```

**File system:**
```bash
ls -la
# Check key directories exist as documented
```

**Project info:**
- Read package.json (or equivalent)
- Verify tech stack matches documentation
- Check dependencies match ARCHITECTURE.md

### Step 4: Verify Documentation Accuracy

Check each file against reality:

#### CLAUDE.md Verification

**Commands section:**
- [ ] Run `npm run` to list available scripts
- [ ] Verify commands listed in docs actually exist
- [ ] Check if new scripts exist that aren't documented

**Architecture section:**
- [ ] Check directories mentioned actually exist
- [ ] Verify file paths are correct
- [ ] Confirm folder structure matches description

**Critical Path:**
- [ ] Compare "Current Status" with git log and file state
- [ ] Verify "Last updated" is recent
- [ ] Check if listed accomplishments match git history

**Issues found:**
- List specific inaccuracies
- Note severity (critical, minor, cosmetic)

#### PRD.md Verification

**Current Status:**
- [ ] Version number makes sense
- [ ] Phase status matches actual progress
- [ ] Timeline aligns with reality

**Progress Log:**
- [ ] Last entry date is recent
- [ ] Logged work matches git history
- [ ] Sessions are numbered correctly

**Implementation Plan:**
- [ ] Completed phases actually complete
- [ ] Current phase reflects actual work
- [ ] Roadmap is still relevant

**Issues found:**
- Note any disconnects from reality

#### ARCHITECTURE.md Verification

**System design:**
- [ ] Described architecture matches code structure
- [ ] Dependencies listed exist in package files
- [ ] Patterns described are actually used

**Data flow:**
- [ ] Matches actual implementation
- [ ] Integration points accurate

**Issues found:**
- Note architectural drift

#### DECISIONS.md Verification

**For each decision:**
- [ ] Decision is actually implemented
- [ ] Code follows documented choice
- [ ] Trade-offs mentioned are accurate

**Check for undocumented decisions:**
- Scan recent commits for major choices
- Look for framework/library additions
- Identify patterns not documented

**Issues found:**
- Missing decisions
- Contradicted decisions
- Outdated decisions

#### KNOWN_ISSUES.md Verification

**For each listed issue:**
- [ ] Issue still exists (check code)
- [ ] Severity is accurate
- [ ] Workaround still works if listed

**Check for resolved issues:**
- Scan git log for fixes
- Test known broken areas
- Verify workarounds

**Check for new issues:**
- Look for TODO comments
- Check for console errors (if applicable)
- Review recent bug reports

**Issues found:**
- Stale issues (already fixed)
- Missing new issues
- Incorrect severities

#### SESSIONS.md Verification

**Last session entry:**
- [ ] Entry exists and is recent
- [ ] Work described matches git log
- [ ] Files mentioned were actually modified
- [ ] WIP state is captured

**Session continuity:**
- [ ] Can identify exact resume point
- [ ] Understand context of last work
- [ ] Know what was in progress

**Issues found:**
- Missing entries
- Incomplete WIP capture
- Gap in session history

#### tasks/next-steps.md Verification

**Action items:**
- [ ] Completed items marked done
- [ ] Current items are actionable
- [ ] Priorities make sense
- [ ] Blockers are accurate

**Check against actual state:**
- [ ] "Ready to do" items are unblocked
- [ ] Blocked items are truly blocked
- [ ] New work not captured

**Issues found:**
- Stale action items
- Missing next steps
- Incorrect priorities

#### tasks/todo.md Verification

**Current session:**
- [ ] Relevant to actual current work
- [ ] Completed items marked
- [ ] Matches SESSIONS.md WIP if resuming

**Issues found:**
- Stale todos
- Completed but not marked
- Not relevant to current session

### Step 5: Check Cross-Document Consistency

Verify documentation tells coherent story:

**Status consistency:**
- [ ] CLAUDE.md status == PRD.md status
- [ ] Progress matches across docs
- [ ] Dates/versions align

**Technical consistency:**
- [ ] ARCHITECTURE.md reflects DECISIONS.md choices
- [ ] CODE_STYLE.md matches actual code patterns
- [ ] Tech stack consistent across docs

**Issue tracking consistency:**
- [ ] KNOWN_ISSUES.md blockers mentioned in next-steps.md
- [ ] Resolved issues removed from both
- [ ] New issues documented everywhere

**Timeline consistency:**
- [ ] Session numbers sequential in SESSIONS.md
- [ ] Progress log entries match session log
- [ ] Timestamps make sense

**Contradictions found:**
- List specific inconsistencies
- Note impact on continuity
- Identify which doc is correct

### Step 6: Assess Completeness

Evaluate if context is complete enough:

**Critical information present:**
- [ ] Can identify current project phase
- [ ] Know exact last work done
- [ ] Understand WIP state
- [ ] Have clear next actions
- [ ] Know all recent decisions
- [ ] Aware of current issues

**Gap analysis:**
- What information is missing?
- What would help resume work?
- What's unclear or ambiguous?

### Step 7: Calculate Confidence Score

Assess ability to resume work seamlessly:

**Scoring factors:**

- **Documentation completeness:** 0-30 points
  - All files present: 30
  - Missing files: -10 each

- **Accuracy:** 0-30 points
  - No inaccuracies: 30
  - Minor issues: -5 each
  - Major issues: -15 each

- **Consistency:** 0-20 points
  - No contradictions: 20
  - Minor contradictions: -5 each
  - Major contradictions: -10 each

- **Recency:** 0-20 points
  - Last update <1 day: 20
  - Last update 1-3 days: 15
  - Last update 3-7 days: 10
  - Last update >7 days: 0

**Total score:** 0-100

**Confidence levels:**
- 90-100: **Perfect** - Resume immediately with full confidence
- 75-89: **Good** - Resume with minor clarifications needed
- 60-74: **Adequate** - Review gaps before resuming
- 40-59: **Poor** - Significant catch-up required
- 0-39: **Critical** - Run /save-context immediately

### Step 8: Report Results

Provide comprehensive report:

```
📋 Context Review Report

**Confidence Score: [X]/100** - [Level]

✅ **Accurate Documentation:**
- CLAUDE.md - All commands verified
- PRD.md - Progress matches git history
- SESSIONS.md - Complete WIP capture

⚠️ **Issues Found:**
- KNOWN_ISSUES.md - 2 resolved issues not removed
- DECISIONS.md - Missing recent JWT library choice
- next-steps.md - 1 completed item not marked done

❌ **Critical Gaps:**
- SESSIONS.md last entry 5 days old
- WIP state unclear for current task
- 3 recent commits not documented

**Last Session:** Session 12 - 2025-09-28
**Last Work:** Implementing JWT refresh logic (incomplete)
**Resume Point:** lib/auth.ts:145 - refresh token validation

**Recommendation:**
[If score >= 75] ✅ Ready to resume work immediately
[If score 60-74] ⚠️ Review gaps before continuing
[If score < 60] ❌ Run /save-context first to update

**Next Steps from docs:**
1. [Top priority from next-steps.md]
2. [Second priority]
3. [Third priority]

**Suggested Actions:**
- [If issues found] Update KNOWN_ISSUES.md to remove fixed items
- [If decisions missing] Document JWT library decision
- [If WIP unclear] Check git status and recent commits
```

### Step 9: Load Context into Working Memory

If confidence score >= 60, actively load context:

**Internalize key information:**
- Current project phase and goals
- Last work session details
- WIP state and exact resume point
- Recent decisions and rationale
- Current issues and blockers
- Immediate next actions

**Prepare for work:**
- Understand user preferences from CLAUDE.md
- Review CODE_STYLE.md standards
- Note any critical issues from KNOWN_ISSUES.md
- Set mental context for continuation

**If score < 60:**
- Don't load potentially incorrect context
- Wait for /save-context to update first

## Important Guidelines

### Trust But Verify

**Trust the docs when:**
- Recent (last updated <48 hours)
- Consistent across files
- Match git history
- WIP clearly stated

**Verify against code when:**
- Last updated >3 days ago
- Contradictions found
- Major changes in git log
- Feeling uncertain

**See:** `.claude/docs/review-context-guide.md` - "The Trust But Verify Principle"

### Handling Issues

**Minor (score 75-89):** Note for user, proceed with work
**Moderate (score 60-74):** Recommend review before resuming
**Critical (score <60):** Do NOT resume, run /save-context first

**See:** `.claude/docs/review-context-guide.md` - "Common Scenarios"

## Success Criteria

✅ All documentation reviewed
✅ Accuracy verified against code
✅ Confidence score calculated
✅ Clear resume point identified
✅ User knows what to do next

**Perfect outcome:** Score 90-100, can state exact resume point, ready to continue seamlessly

**See:** `.claude/docs/review-context-guide.md` - "Success Criteria"
