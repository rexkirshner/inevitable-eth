---
name: save-context
description: Update all meta-documentation to reflect current code state
---

# /save-context Command

Update context documentation to accurately reflect the current state of the project. **Intelligent, not bureaucratic** - updates what changed, suggests growth when needed.

**Philosophy:** Write a good session summary. Update what matters. Grow documentation when complexity demands it.

**Reference guide:** `.claude/docs/save-context-guide.md` (philosophy, examples, not a checklist)

## When to Use This Command

**Always save:**
- At session end (non-negotiable!)
- Before breaks (even 5-minute breaks)
- After completing work
- After making decisions

**Frequently save:**
- Every 30-60 minutes during active work
- When switching tasks

**Rule of thumb:** If unsure, run it. Better to save too often than lose context.

## What This Command Does

**Smart approach:**
1. Analyzes what actually changed this session
2. Updates only the relevant files
3. **Suggests creating new files when complexity demands it**
4. Preserves work-in-progress state
5. Reports what changed

**Not a checklist. Not 50 steps. Just intelligent documentation.**

## Execution Steps

### Step 1: Verify Context Exists

```
If context/ folder missing:
- Automatically run /init-context first
- Then proceed with save

If context/ exists:
- Proceed to Step 2
```

### Step 2: Analyze What Changed

Gather information about this session's work:

**Git Analysis:**
```bash
# What happened this session
git log --oneline -10
git status
git diff HEAD

# What's staged
git diff --cached
```

**Session Understanding:**
- What was the focus of this session?
- What files were modified/created?
- What decisions were made?
- What issues were discovered or fixed?
- What's incomplete (WIP)?

### Step 3: Update Core Files (Always)

These files ALWAYS get updated:

#### context/SESSIONS.md - Session History

**Auto-detect session number:**
```bash
LAST_SESSION=$(grep -c "^## Session" context/SESSIONS.md)
NEXT_SESSION=$((LAST_SESSION + 1))
```

**Write a GOOD session summary** (not a checklist - capture what matters):
```markdown
## Session [N] - YYYY-MM-DD HH:MM

**Focus:** [What was this session about?]

**Accomplishments:**
- [What did we achieve?]
- [Include file paths: `src/file.ts:123`]

**Files Modified/Created:**
- `path/to/file.ts:123-145` - [What changed]
- `path/to/new-file.tsx` - [Purpose]

**Work In Progress:**
- [What's incomplete? Where exactly did we stop?]
- [Next specific action to take]

**Next Steps:**
- [What to do next session]
```

**The WIP section is CRITICAL** - be specific:
- Exact file and line number
- Current approach/mental model
- Next specific action
- Any context needed to resume

#### context/CLAUDE.md - Project Guide

**Update if changed:**
- Current status/phase
- Commands (if new scripts added)
- Critical path section:
  ```markdown
  **Current Status:** [One-sentence status]

  **Completed in Session [N]:**
  - ✅ [Key accomplishment 1]
  - ✅ [Key accomplishment 2]

  **Key Files Modified/Created:**
  - `path/to/file` - [What changed]

  **Next Steps:**
  1. [Immediate next action]
  ```

**Skip if:** No material changes to project context

#### context/tasks/next-steps.md - Action Items

**Update based on session:**
- Mark completed actions: [ ] → [✅]
- Add new actions from current session
- Update blockers
- Refresh priorities

### Step 4: Update Optional Files (If They Exist)

Only update these if the file already exists:

#### context/PRD.md (if exists)
**Update if:** Product vision/roadmap changed
**Skip if:** Just implementation work

#### context/ARCHITECTURE.md (if exists)
**Update if:** Architectural changes made
**Skip if:** No design changes

#### context/DECISIONS.md (if exists)
**Update if:** Technical decisions made this session
**Skip if:** No significant choices

#### context/CODE_STYLE.md (if exists)
**Update if:** New patterns/standards adopted
**Skip if:** No style changes (most sessions)

#### context/KNOWN_ISSUES.md (if exists)
**Update if:** Issues discovered or fixed
**Skip if:** No issue changes

### Step 5: Suggest New Files (When Needed)

**Progressive enhancement** - suggest creating files when complexity demands:

#### Check for ARCHITECTURE.md need:
```bash
# Count source files
FILE_COUNT=$(find src -type f 2>/dev/null | wc -l)
DIR_COUNT=$(find src -type d -maxdepth 2 2>/dev/null | wc -l)

if [ ! -f context/ARCHITECTURE.md ] && [ $FILE_COUNT -gt 20 ] && [ $DIR_COUNT -gt 5 ]; then
  echo "📐 Your architecture is getting complex (20+ files, 5+ directories)"
  echo "   Should I create ARCHITECTURE.md to document system design?"
  echo "   (y/n)"
fi
```

#### Check for DECISIONS.md need:
Ask if:
- Discussed 3+ technical options/tradeoffs this session
- Made significant architectural choice
- File doesn't exist yet

**Prompt:** "We made several important technical decisions this session. Should I create DECISIONS.md to track them?"

#### Check for CODE_STYLE.md need:
Ask if:
- User mentioned code quality standards multiple times
- Discussed coding patterns/conventions
- File doesn't exist yet

**Prompt:** "You've mentioned code quality standards. Should I create CODE_STYLE.md to formalize them?"

#### Check for KNOWN_ISSUES.md need:
Ask if:
- Tracking 3+ bugs or limitations
- Issues mentioned across multiple sessions
- File doesn't exist yet

**Prompt:** "We're tracking several bugs/issues. Should I create KNOWN_ISSUES.md?"

#### Check for PRD.md need:
Ask if:
- Product vision discussed multiple times
- Feature roadmap getting complex
- File doesn't exist yet

**Prompt:** "Product scope is expanding. Should I create PRD.md to document vision and roadmap?"

### Step 6: Cross-Check Consistency

Quick verification that docs tell coherent story:
- Does CLAUDE.md status match reality?
- Do files reference each other correctly?
- Is SESSIONS.md complete?

If inconsistencies found → fix them.

### Step 7: Report Updates

Clear, concise summary:

```
✅ Context Updated - Session [N]

**Core Updates:**
- SESSIONS.md - Complete session log with WIP state
- CLAUDE.md - Updated critical path
- next-steps.md - 3 completed, 2 new actions

**Optional Updates:**
- DECISIONS.md - Documented [decision]
- KNOWN_ISSUES.md - Fixed 2 bugs, added 1 concern

**Current Status:** [One-sentence project status]

**Next Session:** [What to do next]
```

## Important Guidelines

### Update Philosophy

**Focus on what matters:**
- Write a good session summary (SESSIONS.md is key)
- Update project context if it changed (CLAUDE.md)
- Track action items (next-steps.md)
- Everything else is optional

**Be specific, not generic:**
- Include file paths and line numbers
- Capture the "why" not just the "what"
- Document WIP state precisely
- Make it scannable

**Grow when needed:**
- Don't create files prematurely
- Suggest new documentation when complexity warrants it
- Let user decide what's worth documenting

**See:** `.claude/docs/save-context-guide.md` for philosophy, examples, best practices

### What to Always Capture

**Non-negotiable:**
- SESSIONS.md entry (most important!)
- **Work in progress** state (exact resume point)
- Files modified (with what changed)
- Next actions

**If relevant:**
- Decisions made (with reasoning)
- Issues found/fixed (with severity)
- Status updates

**Can skip:**
- Files that didn't change
- Documentation that's not relevant
- Bureaucratic ceremony

### Work-In-Progress Capture (Critical!)

**Be specific about WIP:**
```markdown
**Work In Progress:**
- Implementing JWT refresh logic in `lib/auth.ts:145`
- Current approach: Using jose library for verification
- Next: Add refresh endpoint at `app/api/auth/refresh/route.ts`
- Mental model: Refresh in httpOnly cookie, access in memory
```

**Not this:**
```markdown
**Work In Progress:**
- Working on authentication
```

**Why:** Future Claude (or you) needs exact context to resume.

## Difference from Old Approach

**Old way (v1.6.2):**
- 50-step checklist
- Update all 8 files every time
- Bureaucratic process
- "Documentation for documentation's sake"

**New way (v1.7.0):**
- Write a good session summary
- Update what changed
- Suggest growth when needed
- "Document what matters"

## Success Criteria

✅ SESSIONS.md has complete entry
✅ WIP state captured precisely
✅ CLAUDE.md reflects current status (if changed)
✅ Next steps are clear
✅ Can resume seamlessly next session
✅ No unnecessary file updates

## Time Investment

- Simple session: 1-2 minutes (just SESSIONS.md + next-steps)
- Complex session: 3-5 minutes (multiple files updated)
- With new file creation: 5-7 minutes (create + populate)

**Worth every second** - enables perfect session continuity.
