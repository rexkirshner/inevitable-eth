---
name: save
description: Quick session save - updates current state only (2-3 minutes)
---

# /save Command

**Quick session save** - Updates current state without comprehensive documentation. Use this for most sessions during continuous work.

**For comprehensive documentation before breaks/handoffs, use `/save-full`**

## When to Use This Command

**Every session (default):**
- End of work session
- Switching tasks
- Quick check-in points

**Target time: 2-3 minutes**

## What This Command Does

1. Auto-extracts git changes (status, diff, staged)
2. Updates STATUS.md (current tasks, blockers, next steps)
3. Auto-generates Quick Reference section in STATUS.md (dashboard)
4. Reports what changed

**Does NOT:**
- Create SESSIONS.md entry (use /save-full for that)
- Update DECISIONS.md (add manually when needed)
- Export JSON (use /export-context when needed)

## Execution Steps

### Step 1: Find Context Folder

**v3.0.0:** Commands now work from subdirectories (backend/, frontend/, etc.)

```bash
# Find context folder (works from project root or subdirectories)
source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
CONTEXT_DIR=$(find_context_folder) || exit 1

echo "✅ Found context at: $CONTEXT_DIR"
```

**Note:** This searches current directory, parent directory, and grandparent directory for context/ folder. Use `$CONTEXT_DIR` variable throughout this command instead of hardcoded `context/`.

### Step 2: Auto-Extract Git Data

**ACTION:** Use Bash tool to extract git information with simple sequential commands:

**Check if git repository:**
```bash
git rev-parse --git-dir > /dev/null 2>&1 && echo "Git repository detected" || echo "Not a git repository"
```

**If git repository detected, get branch and status:**
```bash
git branch --show-current
```

```bash
git status --short
```

```bash
git log --oneline -5
```

**Note:** The Bash tool works best with simple, single-line commands. Avoid complex multi-line if-then-else blocks. Use multiple sequential Bash tool calls instead.

### Step 3: Update STATUS.md

**ACTION:** Use Read tool to read current STATUS.md, then use Edit tool to update:

**Prompt user for quick updates:**
```
Current tasks? (comma-separated, or press enter to keep existing):
>

Blockers? (or press enter for none):
>

Next steps? (or press enter to keep existing):
>
```

**Update Work In Progress section:**
```markdown
## Work In Progress

**Current Task:** [What you're working on right now]
**Location:** `file.ts:line` (if applicable)
**Next Action:** [Specific next step when you resume]
**Blockers:** [None / List any blockers]

**Last Updated:** [YYYY-MM-DD HH:MM]
```

**Update Active Tasks section:**
```markdown
## Active Tasks

- [ ] [Task 1]
- [ ] [Task 2]
- [x] [Completed task]

**Priority:** [Next most important task]
```

### Step 4: Auto-Generate Quick Reference in STATUS.md

**ACTION:** Run the update-quick-reference.sh script to auto-generate the Quick Reference section:

```bash
echo "Step 4/5: Auto-generating Quick Reference section..."
echo ""

# Run the auto-generation script
./scripts/update-quick-reference.sh

echo ""
echo "✅ Quick Reference auto-generated"
echo ""
```

**What this does:**
- Extracts project info from .context-config.json
- Extracts current phase and focus from STATUS.md
- Finds last session from SESSIONS.md
- Calculates documentation health
- Generates Quick Reference section automatically

**Auto-populates:**
1. Project name, URLs, tech stack (from config)
2. Current phase and status (from STATUS.md)
3. Active tasks / current focus (from STATUS.md)
4. Last session link (from SESSIONS.md)
5. Documentation health (file age heuristic)

**No manual editing required!** The script handles all 15+ fields automatically.

**Note:** Requires `jq` to be installed:
```bash
# macOS: brew install jq
# Linux: apt-get install jq
```

### Step 5: Report Updates

**ACTION:** Output summary to user:

```
✅ Quick Save Complete

**Updated:**
- STATUS.md - Work in progress, active tasks, and Quick Reference (auto-generated)

**Time:** ~2-3 minutes

**Git Status:** 3 new, 5 modified, 2 staged files on branch main

**Current Focus:** [Brief summary from STATUS.md]

**Quick Reference:** Auto-updated in STATUS.md (project info, URLs, current phase)

**Next Session:**
Run /save again for quick update, or /save-full before breaks/handoffs.

---

💡 Tip: Run /save-full before taking breaks >1 week or handing off to another agent
```

## Important Notes

### This is the Default Command

For **continuous work** (most sessions):
- Use `/save`
- 2-3 minutes
- Updates current state
- No comprehensive session history

For **breaks/handoffs** (occasional):
- Use `/save-full`
- 10-15 minutes
- Creates SESSIONS.md entry
- Comprehensive documentation

### What Gets Updated

**Every /save:**
- ✅ STATUS.md (current tasks, blockers, next steps, Quick Reference section auto-generated)

**Not updated:**
- ❌ SESSIONS.md (use /save-full)
- ❌ DECISIONS.md (update manually when important decision made)

**Note:** In v2.1, QUICK_REF.md has been consolidated into STATUS.md as an auto-generated section at the top.

### Time Investment

**Target:** 2-3 minutes per session

**20 sessions:**
- 17× /save: 34-51 minutes
- 3× /save-full: 30-45 minutes
- **Total: 64-96 minutes** (vs. 100-200 min in v1.8.0)

### When to Use /save-full

Use `/save-full` (comprehensive) when:
- Taking break >1 week
- Handing off to another agent
- Major milestone completed
- Want comprehensive session history entry

Frequency: ~3-5 times per 20 sessions

## Workflow Example

**Typical 20-Session Project:**

```
Session 1-5:   /save (2-3 min each)
Session 6:     /save-full (weekend break coming)
Session 7-12:  /save (2-3 min each)
Session 13:    /save-full (major milestone completed)
Session 14-19: /save (2-3 min each)
Session 20:    /save-full (project handoff)
```

**Time Investment:**
- 17× /save: ~40-50 min
- 3× /save-full: ~30-45 min
- **Total: ~70-95 min** (instead of 100-200 min)

**Savings: 30-50% reduction in overhead**

## Success Criteria

Save succeeds when:
- STATUS.md updated with current state
- Quick Reference section in STATUS.md regenerated
- Completed in 2-3 minutes
- User knows where they left off
- Can resume easily next session

**Perfect save:**
- Quick and painless (no overhead feeling)
- Current state captured
- Ready to resume work
- Comprehensive docs when actually needed (use /save-full)
