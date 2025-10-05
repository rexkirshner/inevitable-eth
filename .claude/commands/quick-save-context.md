---
name: quick-save-context
description: Quick checkpoint - updates SESSIONS.md and tasks only
---

# /quick-save-context Command

Lightweight checkpoint that captures current progress without full documentation regeneration. Perfect for frequent saves during active work.

## When to Use This Command

- During active coding (every 15-30 minutes)
- After completing a subtask
- Before switching contexts briefly
- When you want to checkpoint but documentation is still accurate

**Use `/save-context` instead when:**
- Major features completed
- Architecture changed
- New decisions made
- End of session

## What This Command Does

1. Auto-detects next session number
2. Adds entry to SESSIONS.md
3. Updates context/tasks/next-steps.md
4. Updates context/tasks/todo.md
5. Captures git state
6. Reports what changed

**What it skips:** Full documentation regeneration (CLAUDE.md, PRD.md, ARCHITECTURE.md, etc.)

## Execution Steps

### Step 1: Auto-detect Session Number

```bash
# Count existing sessions
LAST_SESSION=$(grep -c "^## Session" context/SESSIONS.md 2>/dev/null || echo "0")
NEXT_SESSION=$((LAST_SESSION + 1))

echo "📝 Quick Save - Session $NEXT_SESSION"
```

### Step 2: Gather Current State

**Git status:**
```bash
# Recent commit
git log -1 --oneline 2>/dev/null

# Current changes
git status --short

# Current branch
git branch --show-current 2>/dev/null
```

**Files changed since last save:**
```bash
# Modified files
git diff --name-only

# Staged files
git diff --cached --name-only
```

### Step 3: Update SESSIONS.md

Add lightweight entry at the top:

```markdown
## Session [N] - [TIMESTAMP]

**Quick Save Checkpoint**

**Recent Work:**
- [Brief 1-2 sentence summary of what you just did]

**Files Modified:**
- `[file1]`
- `[file2]`

**Current Focus:**
- [What you're working on now]

**Next:** [Immediate next step]

---
```

**Example:**
```markdown
## Session 23 - 2025-10-04 14:30

**Quick Save Checkpoint**

**Recent Work:**
- Added user authentication to API endpoints
- Fixed validation bug in login form

**Files Modified:**
- `api/auth.ts`
- `components/LoginForm.tsx`

**Current Focus:**
- Implementing password reset flow

**Next:** Add email verification step

---
```

### Step 4: Update Tasks

**Update context/tasks/next-steps.md:**
- Mark completed items as [✅]
- Add any new immediate actions discovered
- Update "In Progress" section

**Update context/tasks/todo.md:**
- Check off completed todos
- Add any new todos discovered while working
- Update priority if needed

### Step 5: Generate Quick Report

```markdown
✅ Quick Save Complete - Session [N]

**Captured:**
- Session checkpoint in SESSIONS.md
- Task updates in next-steps.md
- Todo updates in todo.md

**Files Modified Since Last Save:**
- file1.ts (15 lines changed)
- file2.tsx (8 lines changed)

**Current State:**
- Branch: feature/auth
- Last commit: "Add login endpoint"
- 2 files modified, 0 staged

**Time Since Last Save:** 23 minutes

---

💡 Tip: Run /save-context when you complete this feature for full documentation update.
```

## Comparison: /quick-save-context vs /save-context

| Feature | /quick-save-context | /save-context |
|---------|-------------|---------------|
| **Speed** | ~5 seconds | ~30-60 seconds |
| **Updates** | SESSIONS.md, tasks/ | All context docs |
| **Use Case** | Frequent checkpoints | Major milestones |
| **Session Entry** | Brief | Comprehensive |
| **Git Analysis** | Basic | Detailed |
| **Doc Regeneration** | No | Yes |
| **Frequency** | Every 15-30 min | End of feature/session |

## Usage Examples

### During Active Development
```
[15:00] Start working on feature
[15:20] /quick-save-context  # First checkpoint
[15:45] /quick-save-context  # Progress checkpoint
[16:10] /quick-save-context  # Final checkpoint
[16:15] /save-context  # Feature complete, full save
```

### Bug Fix Session
```
/quick-save-context  # Found the bug
/quick-save-context  # Applied fix
/quick-save-context  # Verified fix works
/save-context  # Bug fixed, update all docs
```

### Quick Context Switch
```
# Working on Feature A
/quick-save-context

# Quick detour to fix urgent bug
[fix bug]
/quick-save-context

# Back to Feature A
[resume work]
/save-context  # When Feature A is done
```

## Important Notes

### When Quick Save is Perfect
- Active coding sessions
- Iterative development
- Want to capture progress frequently
- Documentation is still accurate

### When to Use Full Save Instead
- Completed a feature
- Made architectural decisions
- Changed project structure
- End of work session
- Before /code-review
- Before deployment

### Session Numbering
- Quick saves increment session numbers
- Each quick save gets its own session number
- This is intentional - shows granular activity
- Can consolidate in final /save-context if desired

### Performance
- Quick save is designed to be fast (<5 seconds)
- No file reading/analysis beyond tasks/
- Minimal git operations
- Can run as often as you want

## Success Criteria

Quick save succeeds when:
- Session entry added to SESSIONS.md
- Tasks updated in context/tasks/
- Current state captured
- Report generated
- Completes in under 10 seconds

**Perfect quick save:**
- Captures exactly what you just did
- Updates task completion
- No documentation drift
- Ready to resume immediately
