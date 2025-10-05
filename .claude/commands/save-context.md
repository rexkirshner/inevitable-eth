---
name: save-context
description: Update all meta-documentation to reflect current code state
---

# /save-context Command

Update all context documentation to accurately reflect the current state of the project. This is your safety net - run it frequently to preserve session state and enable perfect continuity.

**Full guide:** `.claude/docs/save-context-guide.md`

## When to Use This Command

**Always save:**
- At session end (non-negotiable!)
- Before breaks (even 5-minute breaks)
- After completing work
- After making decisions
- Before /code-review

**Frequently save:**
- Every 30-60 minutes during active work
- When switching tasks
- After discovering issues

**Rule of thumb:** If unsure, run it. Better to save too often than lose context.

**See:** `.claude/docs/save-context-guide.md` - "When To Use This Command"

## What This Command Does

1. Verifies context/ folder exists (creates if missing)
2. Analyzes current state vs documented state
3. Updates all documentation files
4. Captures session activity
5. Preserves work-in-progress state
6. Reports what changed

## Execution Steps

### Step 1: Verify Context Exists

```
If context/ folder missing:
- Automatically run /init-context first
- Then proceed with save

If context/ exists:
- Proceed to Step 2
```

### Step 2: Analyze Current State

Gather comprehensive information about what changed:

**Git Analysis:**
```bash
# Recent commits (last 5-10)
git log --oneline -10

# Current changes
git status
git diff HEAD

# Staged changes
git diff --cached

# Current branch
git branch --show-current
```

**File System Changes:**
```bash
# Modified files since last update
ls -lt | head -20

# New directories
find . -type d -maxdepth 2 -newer context/SESSIONS.md 2>/dev/null
```

**Project State:**
- Read package.json for new dependencies
- Check for new npm scripts
- Look for new files in src/app/lib directories
- Identify any architectural changes

**Session Activity:**
- What commands were run (if trackable)
- What files were modified
- What decisions were made
- What issues were discovered

### Step 3: Update Each Documentation File

Update files based on changes detected:

#### context/CLAUDE.md Updates

**Development Status:**
- Update current phase/milestone
- Mark completed work with ✅
- Update "in progress" items

**Commands:**
- Add any new npm scripts/commands
- Update command descriptions if changed

**Architecture:**
- Add new architectural patterns
- Update directory structure if changed
- Document new integrations

**Critical Path:**
- Add "Completed in Session [N]" section
- List key accomplishments with ✅
- Update "Key Files Modified/Created"
- Set current status

**Example update:**
```markdown
**Current Status:** Phase 2 - Feature Implementation

**Completed in Session 12:**
- ✅ Implemented user authentication system
- ✅ Added JWT token management
- ✅ Created login/logout flows

**Key Files Modified/Created:**
- `lib/auth.ts` - Authentication utilities
- `app/api/auth/route.ts` - Auth API endpoints
- `middleware.ts` - Auth middleware
```

#### context/PRD.md Updates

**Current Status:**
- Update version number if needed
- Update phase status

**Progress Log:**
Add new session entry:
```markdown
### YYYY-MM-DD - Session [N]
**[Phase Name] [Status]:**
- ✅ [Accomplishment 1]
- ✅ [Accomplishment 2]
- ✅ [Key decision made]
- 🎯 **[Phase Status]**
```

**Implementation Plan:**
- Mark completed phases with ✅
- Update current phase progress
- Adjust timeline if needed

**Future Roadmap:**
- Move completed items from future to done
- Add new items discovered

#### context/ARCHITECTURE.md Updates

**If architectural changes:**
- Document new patterns introduced
- Update system design
- Add new dependencies/integrations
- Update data flow if changed

**If no changes:**
- Skip or add note: "No architectural changes this session"

#### context/DECISIONS.md Updates

**For each decision made:**
```markdown
## [Decision Title] - YYYY-MM-DD

**Decision:** What was decided

**Context:** Why this decision was needed

**Alternatives Considered:**
- Option A - Why not chosen
- Option B - Why not chosen

**Trade-offs:**
- Pros: [List]
- Cons: [List]

**When to Reconsider:**
- [Conditions that would make this decision obsolete]
```

**If no decisions:**
- Skip updates

#### context/CODE_STYLE.md Updates

**Rarely needs updates unless:**
- New patterns adopted
- Style rules changed
- Language-specific conventions added

**Most sessions:** Skip this file

#### context/KNOWN_ISSUES.md Updates

**Remove fixed issues:**
- Check git history for fixes
- Remove from appropriate sections
- Note in SESSIONS.md what was fixed

**Add new issues discovered:**
```markdown
## [Issue Title]

**Severity:** Blocking | Non-Critical | Minor

**Description:** What's wrong

**Impact:** What this affects

**Workaround:** Temporary solution (if any)

**Discovered:** YYYY-MM-DD Session [N]
```

**Update priorities:**
- Move blocking → non-critical if partially fixed
- Add to technical debt if deferred

#### context/SESSIONS.md Updates

**Auto-detect session number:**
```bash
# Count existing sessions to determine next number
LAST_SESSION=$(grep -c "^## Session" context/SESSIONS.md)
NEXT_SESSION=$((LAST_SESSION + 1))
echo "Creating Session $NEXT_SESSION entry"
```

**Always add detailed entry:**
```markdown
## Session [N] - YYYY-MM-DD HH:MM

**Duration:** [X] hours

**Focus:** [Main work area]

**Accomplishments:**
- [Detailed list of what was done]
- [Include file paths and line numbers]
- [Note any decisions made]

**Files Modified:**
- `path/to/file.ts:123-145` - [What changed]
- `path/to/file.tsx:67` - [What changed]

**Files Created:**
- `path/to/new-file.ts` - [Purpose]

**Decisions Made:**
- [Link to DECISIONS.md entries]

**Issues Discovered:**
- [Link to KNOWN_ISSUES.md entries]

**Issues Resolved:**
- [What was fixed]

**Work In Progress:**
- [What's incomplete]
- [What to resume next session]

**Next Steps:**
- [Immediate next actions]

**Commands Run:**
- [Key commands executed]

**Notes:**
- [Any other relevant context]
```

#### context/tasks/next-steps.md Updates

**Mark completed actions:**
- Change [ ] to [✅]
- Move to "Completed" section if appropriate

**Add new immediate actions:**
- Based on current state
- Based on issues discovered
- Based on WIP

**Update blockers:**
- Add new blockers
- Remove resolved blockers
- Update status

**Refresh priorities:**
- Reorder based on current goals
- Add urgency markers if needed

#### context/tasks/todo.md Updates

**Current session todos:**
- Mark completed items with ✅
- Add any new items discovered
- Preserve incomplete items for next session

### Step 4: Cross-Check Consistency

Verify documentation tells coherent story:

**Consistency checks:**
- [ ] CLAUDE.md status matches PRD.md status
- [ ] DECISIONS.md choices reflected in ARCHITECTURE.md
- [ ] KNOWN_ISSUES.md blockers mentioned in next-steps.md
- [ ] SESSIONS.md entry matches actual work done
- [ ] All docs tell same story

**If inconsistencies found:**
- Fix them immediately
- Document why inconsistency existed

### Step 5: Capture Work-In-Progress

**Critical for session continuity:**

In SESSIONS.md, explicitly note:
- Exact task in progress when stopped
- Files open and being edited
- Line numbers of current work
- Mental model / approach being used
- Next specific action to take

**Example WIP capture:**
```markdown
**Work In Progress:**
- Implementing JWT refresh logic in `lib/auth.ts`
- Currently at line 145, need to add refresh token validation
- Approach: Using jose library for JWT verification
- Next: Add refresh endpoint at `app/api/auth/refresh/route.ts`
- Mental model: Refresh tokens stored in httpOnly cookie, access tokens in memory
```

### Step 6: Report Updates

Provide clear summary:

```
✅ Context Updated

**Files Updated:**
- CLAUDE.md - Updated critical path, added Session 12 accomplishments
- PRD.md - Session 12 logged, Phase 2 at 60% complete
- DECISIONS.md - Documented JWT library choice
- KNOWN_ISSUES.md - Fixed 2 bugs, added 1 new limitation
- SESSIONS.md - Complete session 12 log with WIP state
- next-steps.md - 3 items completed, 2 new actions added

**Key Changes Captured:**
- Implemented authentication system (auth.ts, API routes)
- Decided to use 'jose' library over 'jsonwebtoken'
- Fixed CORS issue, added new rate limiting concern
- WIP: Refresh token logic at lib/auth.ts:145

**Current Status:** Phase 2 - Authentication (60% complete)

**Next Session:** Resume refresh token implementation
```

## Important Guidelines

### Update Philosophy

**Be thorough but efficient:**
- Update what changed, not everything
- Use git history to catch missed changes
- Focus on material changes, not cosmetic

**Think about the reader:**
- Future Claude instances need full context
- Future you needs to remember why
- Make it scannable and clear

**Keep it honest:**
- Don't hide issues or technical debt
- Document the "why" behind weird decisions
- Admit when something is hacky or temporary

**See:** `.claude/docs/save-context-guide.md` - "Update Philosophy"

### What to Capture

**Always capture:**
- Files modified (with line numbers)
- Decisions made (with reasoning)
- Issues found (with severity)
- **Work in progress** (with exact state) ← CRITICAL!
- Next immediate actions

**Never skip:**
- SESSIONS.md entry (most important!)
- WIP state (critical for continuity)
- Consistency checks

**Can skip if unchanged:**
- ARCHITECTURE.md, CODE_STYLE.md (rarely change)
- DECISIONS.md (if no decisions made)

**See:** `.claude/docs/save-context-guide.md` - "The Critical Importance of WIP"

## Success Criteria

✅ All relevant files updated
✅ SESSIONS.md has complete, detailed entry
✅ WIP state preserved with exact resume point
✅ Consistency maintained
✅ Next session can resume seamlessly

**See:** `.claude/docs/save-context-guide.md` - "Success Criteria"

## Time Investment

- Routine: 30-60 seconds
- Session end: 2-3 minutes
- Complex: 5 minutes

**Worth every second** - saves hours of re-explanation later.
