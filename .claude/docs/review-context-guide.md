# Review Context Guide

Comprehensive guide for using `/review-context` to verify session continuity readiness.

## Philosophy

Review-context is the **session start ritual**. It's the other half of session continuity:

- `/save-context` captures state at session end
- `/review-context` loads state at session start

Together, they enable the Prime Directive:

> "I can end any session abruptly, start a new session days later, run /review-context, and continue exactly where I left off without any re-explanation or context loss."

## The Trust But Verify Principle

**Core concept:** Documentation is truth, but verify it against reality.

**Trust the docs when:**
- Recent (last updated <48 hours)
- Consistent across files
- Match git history
- WIP clearly stated

**Verify against code when:**
- Last updated >3 days ago
- Contradictions found
- Major changes in git log since last update
- Feeling uncertain

**Philosophy:** Good documentation deserves trust. Stale documentation requires verification.

## When To Use This Command

### Primary Use: Session Start

**Always run at session start:**
- First thing when opening a project
- Before any work begins
- Before asking user questions
- Before making assumptions

**Why:** Loads full context into memory, prevents re-explanation.

### Other Uses

**Before major decisions:**
- Review current state before big choices
- Understand existing decisions and patterns
- Avoid contradicting past work

**When feeling disoriented:**
- Lost track of what you're doing
- Confused about project state
- Need to re-orient

**After someone else worked:**
- Team member made changes
- Different Claude instance worked
- User worked solo

**Quality checkpoints:**
- Before deployment
- Before major milestones
- When documentation feels stale

## What Gets Verified

### Documentation Completeness

**Files expected:**
- `CLAUDE.md` - Communication and workflow
- `PRD.md` - Product requirements and progress
- `ARCHITECTURE.md` - System design
- `DECISIONS.md` - Technical decisions
- `CODE_STYLE.md` - Coding standards
- `KNOWN_ISSUES.md` - Bugs and limitations
- `SESSIONS.md` - Session history
- `next-steps.md` - Action items
- `todo.md` - Session todos
- `.context-config.json` - Configuration

**Scoring:**
- All files present: +30 points
- Each missing file: -10 points

### Accuracy Against Reality

**What to check:**
- Commands in CLAUDE.md actually exist (verify with `npm run`)
- Directories mentioned actually exist (verify with `ls`)
- Dependencies listed match package.json
- Described architecture matches code structure
- Decisions are actually implemented
- Issues listed still exist (or were fixed)

**Scoring:**
- No inaccuracies: +30 points
- Minor issues (typos, outdated names): -5 each
- Major issues (wrong architecture, missing decisions): -15 each

### Cross-Document Consistency

**What to check:**
- CLAUDE.md status == PRD.md status
- ARCHITECTURE.md reflects DECISIONS.md choices
- KNOWN_ISSUES.md blockers mentioned in next-steps.md
- Session numbers sequential
- Progress log matches session log
- Timestamps align

**Scoring:**
- No contradictions: +20 points
- Minor contradictions (off-by-one numbers): -5 each
- Major contradictions (completely different states): -10 each

### Recency

**How recent:**
- Last update <1 day ago: +20 points
- Last update 1-3 days ago: +15 points
- Last update 3-7 days ago: +10 points
- Last update >7 days ago: 0 points

**Why it matters:**
- Recent docs are more likely accurate
- Stale docs may miss changes
- Recency indicates active maintenance

## The Confidence Score

### How It Works

**Total: 100 points maximum**

- Completeness: 0-30 points
- Accuracy: 0-30 points
- Consistency: 0-20 points
- Recency: 0-20 points

**Example calculation:**
```
All files present: +30
No inaccuracies: +30
No contradictions: +20
Last update 2 days ago: +15
---
Total: 95/100 (Perfect)
```

### Confidence Levels

**90-100: Perfect**
- Resume immediately with full confidence
- No clarifications needed
- Trust all documentation
- Ready to continue seamlessly

**75-89: Good**
- Resume with minor clarifications
- Mostly trustworthy
- Note specific issues to user
- Can proceed but stay alert

**60-74: Adequate**
- Review gaps before resuming
- Some uncertainty exists
- Recommend checking specific areas
- Proceed cautiously

**40-59: Poor**
- Significant catch-up required
- High uncertainty
- Recommend /save-context first
- Don't trust without verification

**0-39: Critical**
- Do NOT resume work
- Run /save-context immediately
- Fundamental problems exist
- Cannot proceed safely

### What The Score Means

**High score (90-100):**
- "I can resume exactly where we left off"
- "I know the exact next step"
- "I understand all context"
- "No questions needed"

**Mid score (60-75):**
- "I have the general picture"
- "Need to clarify a few things"
- "Some gaps in understanding"
- "Can proceed with minor catch-up"

**Low score (<60):**
- "Too many gaps to proceed"
- "Documentation is stale"
- "Need user to update first"
- "Cannot resume safely"

## Verification Strategies

### File-by-File Verification

**CLAUDE.md:**
```bash
# Verify commands exist
npm run  # List all available scripts
# Compare with Commands section

# Verify directories exist
ls -la src/ app/ lib/ components/
# Compare with Architecture section

# Check Critical Path recency
# Compare "Last updated" with current date
```

**PRD.md:**
```bash
# Verify phase progress
git log --oneline --since="1 week ago"
# Compare with Progress Log

# Check version number makes sense
cat package.json | grep version
# Compare with Current Status
```

**ARCHITECTURE.md:**
```bash
# Verify dependencies
cat package.json | grep dependencies -A 20
# Compare with listed dependencies

# Verify patterns described are used
grep -r "pattern_name" src/
```

**DECISIONS.md:**
```bash
# Verify decisions implemented
# For library choice: grep package.json
# For pattern choice: grep codebase
```

**KNOWN_ISSUES.md:**
```bash
# Check if issues still exist
# Test known broken areas
# Scan for TODOs related to issues
grep -r "TODO" src/ | grep "issue_keyword"
```

**SESSIONS.md:**
```bash
# Verify last session work
git log --oneline -10
# Compare with last session entry

# Check files were actually modified
git diff --name-only HEAD~5..HEAD
# Compare with "Files Modified" list
```

### Gap Analysis

**What information is missing?**
- Can't identify current phase?
- Don't know last work done?
- WIP state unclear?
- No clear next actions?
- Missing recent decisions?
- Unaware of current issues?

**What would help resume work?**
- More detail on WIP?
- Clearer next action?
- Updated issue list?
- Recent decision rationale?

**What's unclear or ambiguous?**
- Vague descriptions?
- Contradictory information?
- Missing context?

### Contradiction Resolution

**When contradictions found:**

**Step 1: Identify which doc is likely correct**
- Which was updated more recently?
- Which matches git history?
- Which matches actual code?

**Step 2: Report clearly**
```markdown
⚠️ **Contradiction Found:**
- CLAUDE.md: "Phase 2 - 80% complete"
- PRD.md: "Phase 2 - 60% complete"
- Git history: 12 of 20 tasks committed
- Likely correct: PRD.md (60% matches 12/20)
- Action needed: Update CLAUDE.md to match
```

**Step 3: Reduce confidence score**
- Minor contradiction: -5 points
- Major contradiction: -10 points

**Don't guess:** If truly unclear which is correct, ask user.

## The WIP Detection Challenge

**Work In Progress is the most critical piece for resumption.**

### What Good WIP Looks Like

**Contains:**
- Exact file and line number
- Specific task in progress
- Approach being used
- Next action to take
- Mental model / reasoning

**Example:**
```markdown
**Work In Progress:**
- Implementing JWT refresh logic in `lib/auth.ts`
- Currently at line 145, need to add refresh token validation
- Approach: Using jose library for JWT verification
- Next: Add refresh endpoint at `app/api/auth/refresh/route.ts`
- Mental model: Refresh tokens in httpOnly cookie, access tokens in memory
```

### What Bad WIP Looks Like

**Too vague:**
```markdown
**Work In Progress:**
- Working on authentication
```

**Missing next action:**
```markdown
**Work In Progress:**
- Was implementing refresh tokens at lib/auth.ts:145
```

**No mental model:**
```markdown
**Work In Progress:**
- lib/auth.ts:145
```

### When WIP Is Missing or Unclear

**If WIP section exists but vague:**
1. Check git status for uncommitted changes
2. Check last few commits for context
3. Read the actual code at mentioned line
4. Reduce confidence score -10
5. Note: "WIP state unclear, recommend reviewing code first"

**If WIP section completely missing:**
1. Assume no work in progress
2. Next session starts fresh
3. Reduce confidence score -15
4. Note: "No WIP captured from last session"

**If can reconstruct WIP from git:**
```bash
# Check uncommitted changes
git status
git diff

# Check last commit message
git log -1 --pretty=full

# Infer WIP from uncommitted work
```

## Loading Context Into Memory

**This is the ultimate goal of review-context.**

### When Score >= 75

**Actively load and internalize:**

**Project state:**
- Current phase: [Phase name and percentage]
- Last session: [Session number and date]
- Key accomplishments: [Top 3-5 from recent sessions]

**Current work:**
- WIP task: [Exact description]
- Resume point: [File and line number]
- Next action: [Specific next step]
- Approach: [Strategy being used]

**Critical context:**
- Recent decisions: [Top 2-3 and reasoning]
- Current issues: [Active blockers]
- User preferences: [From CLAUDE.md and CODE_STYLE.md]

**Immediate actions:**
- Top priority: [From next-steps.md]
- Blockers: [Any blockers to address first]
- Quick wins: [Low-hanging fruit]

**Mental model:**
- "I understand where we are"
- "I know what we're building"
- "I know what to do next"
- "I can continue seamlessly"

### When Score 60-74

**Load with caution:**
- Note specific gaps
- Recommend checking gaps before proceeding
- Load what's clear, flag what's uncertain
- "I have general picture, need to clarify [X]"

### When Score <60

**Do NOT load potentially incorrect context:**
- Don't risk working with wrong information
- Recommend /save-context first
- Wait for user to update
- "Too many gaps to proceed safely"

## Reporting Results

### Report Structure

**Header:**
```markdown
📋 Context Review Report

**Confidence Score: [X]/100** - [Level]
```

**Accurate Documentation:**
```markdown
✅ **Accurate Documentation:**
- CLAUDE.md - All commands verified, architecture matches
- PRD.md - Progress matches git history
- SESSIONS.md - Complete WIP capture, recent entry
- ARCHITECTURE.md - Patterns match codebase
```

**Issues Found:**
```markdown
⚠️ **Issues Found:**
- KNOWN_ISSUES.md - 2 resolved issues not removed (lines 45, 67)
- DECISIONS.md - Missing recent JWT library choice (Session 12)
- next-steps.md - 1 completed item not marked done (line 23)
```

**Critical Gaps:**
```markdown
❌ **Critical Gaps:**
- SESSIONS.md last entry 5 days old (stale)
- WIP state unclear for current task
- 3 recent commits not documented
```

**Resume Information:**
```markdown
**Last Session:** Session 12 - 2025-09-28
**Last Work:** Implementing JWT refresh logic (incomplete)
**Resume Point:** lib/auth.ts:145 - refresh token validation
**Next Action:** Add refresh endpoint at app/api/auth/refresh/route.ts
```

**Recommendation:**
```markdown
**Recommendation:**
[If score >= 75] ✅ Ready to resume work immediately
[If score 60-74] ⚠️ Review gaps before continuing
[If score < 60] ❌ Run /save-context first to update
```

**Next Steps:**
```markdown
**Next Steps from docs:**
1. Complete refresh token endpoint (WIP)
2. Add authentication tests
3. Update user profile UI

**Blockers:**
- None currently
```

**Suggested Actions:**
```markdown
**Suggested Actions:**
- Update KNOWN_ISSUES.md to remove fixed items
- Document JWT library decision in DECISIONS.md
- Run /save-context if you just completed work
```

### Report Quality

**Good report:**
- Clear confidence level
- Specific issues listed
- Exact resume point stated
- Actionable recommendations
- User knows what to do next

**Bad report:**
- Vague "some issues found"
- No resume point identified
- No recommendation
- User confused what to do

## Common Scenarios

### Scenario 1: Perfect Session Continuity

**Situation:**
- User ran /save-context at end of last session
- Less than 24 hours ago
- Detailed WIP captured
- All docs updated

**Review finds:**
- Score: 95/100
- All docs accurate
- Clear WIP at lib/auth.ts:145
- Next action specified

**Outcome:**
```markdown
✅ **Ready to resume immediately**

I can see we were implementing JWT refresh logic. Last session stopped at
lib/auth.ts:145, adding refresh token validation. Next step is to create
the refresh endpoint at app/api/auth/refresh/route.ts.

I'll continue from there.
```

**No questions needed. Seamless continuation.**

### Scenario 2: Minor Gaps

**Situation:**
- User ran /save-context 2 days ago
- WIP captured but brief
- 2 small issues fixed since (not documented)

**Review finds:**
- Score: 78/100
- Most docs accurate
- 2 resolved issues still in KNOWN_ISSUES.md
- WIP exists but could be clearer

**Outcome:**
```markdown
⚠️ **Minor issues found, can proceed**

Score: 78/100 (Good)

Issues:
- 2 resolved issues still listed in KNOWN_ISSUES.md
- WIP a bit brief, but clear enough

I can resume work on JWT refresh logic. Will update KNOWN_ISSUES.md
during next /save-context.

Shall I continue with the refresh endpoint?
```

**Minor clarification, then proceed.**

### Scenario 3: Stale Documentation

**Situation:**
- Last /save-context was 7 days ago
- User worked solo since then
- 15 commits made (not documented)

**Review finds:**
- Score: 45/100
- Docs severely out of date
- WIP from 7 days ago no longer relevant
- Recent work not captured

**Outcome:**
```markdown
❌ **Documentation too stale to proceed**

Score: 45/100 (Poor)

Issues:
- Last update 7 days ago
- 15 commits since last save
- WIP from last week no longer current
- Cannot determine current state safely

Recommendation: Please run /save-context to update documentation,
then I can review again and continue seamlessly.
```

**Cannot proceed safely. Need update first.**

### Scenario 4: Fresh Project

**Situation:**
- Just ran /init-context
- No sessions yet
- All docs are templates

**Review finds:**
- Score: 70/100 (adequate structure, no content)
- All files present
- All are initial templates
- No sessions, no WIP

**Outcome:**
```markdown
✅ **Fresh project initialized**

Score: 70/100 (New project baseline)

This appears to be a newly initialized project. All context files are
present but in template form. No session history yet.

What would you like to work on?
```

**Fresh start, awaiting direction.**

## Advanced Techniques

### Git-Based Verification

**Cross-check with git history:**
```bash
# Last 10 commits
git log --oneline -10

# Files changed in last week
git diff --name-only HEAD@{1.week.ago}..HEAD

# Commit messages for context
git log --oneline --since="1 week ago" --pretty=format:"%h %s"
```

**Use to verify:**
- SESSIONS.md work matches commits
- Files listed were actually modified
- Dates align with commit history
- Accomplishments match commit messages

### Pattern Detection

**Look for patterns in issues:**
- Same area mentioned repeatedly?
- Consistent contradictions?
- Systemic documentation gaps?

**Example:**
```markdown
**Pattern Detected:**
- KNOWN_ISSUES.md consistently out of date (3 sessions in a row)
- Suggests: Add reminder to check KNOWN_ISSUES.md during /save-context
```

### Confidence Trend Tracking

**Track score over time:**
- Session 10: 95/100
- Session 11: 88/100
- Session 12: 65/100 ← Declining trend

**Indicates:**
- Documentation quality degrading
- Need to be more thorough with /save-context
- Possible process improvement needed

## Error Recovery

### If Context Folder Missing

**Problem:** No context/ directory

**Response:**
```markdown
📋 Context Review Report

**Status:** ❌ No context found

The context/ directory doesn't exist. This project hasn't been initialized
with the Claude Context System.

**Recommendation:** Run /init-context to set up context documentation.
```

**Don't proceed:** Cannot review what doesn't exist.

### If Critical Files Missing

**Problem:** context/ exists but missing CLAUDE.md or SESSIONS.md

**Response:**
```markdown
⚠️ **Critical files missing:**
- CLAUDE.md - Not found
- SESSIONS.md - Not found

**Confidence Score: 20/100** (Critical)

**Recommendation:** Run /init-context to recreate missing files, or manually
create from templates.
```

**Reduce score significantly:** -10 per missing critical file.

### If Git Unavailable

**Problem:** Not a git repository or git not installed

**Response:**
```markdown
⚠️ **Git not available**

Cannot verify documentation against git history. Using file timestamps only.

**Confidence Score: [X-20]/100** (reduced due to limited verification)
```

**Work with what's available:**
- Use file modification times
- Rely on documentation content
- Reduce confidence accordingly

### If Contradictions Unresolvable

**Problem:** Can't determine which doc is correct

**Response:**
```markdown
❌ **Unresolvable contradiction:**
- CLAUDE.md: Phase 2 complete
- PRD.md: Phase 1 in progress
- Git history: Mixed signals
- Cannot determine which is correct

**Recommendation:** Please clarify current project phase, then run
/save-context to update both files consistently.
```

**Don't guess:** Ask user to clarify.

## Success Criteria

Review-context succeeds when:

✅ All documentation reviewed and verified
✅ Accuracy checked against actual code state
✅ Consistency verified across all docs
✅ Confidence score calculated correctly
✅ Clear resume point identified
✅ Specific, actionable recommendation provided
✅ User knows exactly what to do next

**Perfect outcome:**
- Score 90-100
- Can state exact resume point
- Full understanding of context
- Ready to continue seamlessly
- No questions needed
- User says "continue" and work resumes immediately

**Good outcome:**
- Score 75-89
- Minor clarifications noted
- Can proceed with awareness of gaps
- User confirms before proceeding

**Acceptable outcome:**
- Score 60-74
- Gaps identified clearly
- User reviews gaps, then proceeds

**Failure:**
- Score <60
- Cannot proceed safely
- Recommends /save-context update
- Prevents working with stale/incorrect context

## Integration With Other Commands

### After /save-context

**Perfect pairing:**
- /save-context at session end
- /review-context at session start
- Complete continuity loop

### Before /code-review

**Optional but helpful:**
- Review context to understand current state
- Know what was recently worked on
- Understand recent decisions
- Better quality review

### After /init-context

**First review:**
- Verifies initialization worked
- Establishes baseline score
- Confirms all files present
- Ready to start work

## Summary

**Review-context loads session state:**
- Verifies documentation accuracy
- Checks consistency
- Calculates confidence
- Identifies resume point
- Recommends next action

**Key principles:**
- Trust but verify
- Recent docs more reliable
- WIP is most critical piece
- Don't proceed with low confidence
- Report clearly and specifically

**Success means:**
- High confidence score (75+)
- Clear understanding of current state
- Exact resume point known
- Can continue work seamlessly
- No re-explanation needed

**Perfect outcome:**
> "I've reviewed all context. We were implementing JWT refresh logic, stopped at lib/auth.ts:145 adding token validation. Next step is creating the refresh endpoint. Shall I continue?"
