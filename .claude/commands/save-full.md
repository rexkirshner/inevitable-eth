---
name: save-full
description: Comprehensive session documentation for breaks and handoffs (10-15 minutes)
---

# /save-full Command

**Comprehensive session documentation** - Creates detailed SESSIONS.md entry with mental models and decision rationale. Use before breaks, handoffs, or milestones.

**For regular session updates, use `/save` (2-3 minutes)**

**⏱️ Estimated time:** 10-15 minutes

**Philosophy:**
- Capture TodoWrite state for productivity tracking
- Extract mental models and decision rationale for AI agents
- Update what changed (not everything)
- Grow documentation when complexity demands

**Reference guide:** `.claude/docs/save-context-guide.md` (philosophy, examples, not a checklist)

## When to Use This Command

**Use /save-full (comprehensive) when:**
- Taking break >1 week
- Handing off to another agent/developer
- Major milestone completed
- Want detailed session history entry

**Frequency:** ~3-5 times per 20 sessions (occasional, not every session)

**For regular sessions:** Use `/save` instead (2-3 minutes)

**Rule of thumb:** Most sessions use `/save`. Use `/save-full` when you need comprehensive documentation.

## What This Command Does

**Everything /save does:**
1. Updates STATUS.md (current tasks, blockers, next steps)
2. Auto-generates Quick Reference section in STATUS.md (dashboard)

**PLUS comprehensive documentation:**
3. **Creates SESSIONS.md entry** - Structured 40-60 lines with:
   - What changed and why
   - Problem solved (issue, constraints, approach, rationale)
   - Mental models (current understanding, insights, gotchas)
   - Files modified (with context)
   - Work in progress (precise resume point)
   - TodoWrite state (completed vs. pending)
4. **Updates DECISIONS.md** - If significant decision made
5. **Optional: Exports JSON** - For multi-agent workflows (--with-json flag)

**Purpose:** Comprehensive context for AI agents to review, understand, and take over development.

---

## Execution Steps

### Step 0: Load Shared Functions

**ACTION:** Source the common functions library:

**Note:** The Bash tool doesn't handle multi-line if-then-else blocks well. Use simple sequential commands instead.

**Check if common-functions.sh exists:**
```bash
test -f "scripts/common-functions.sh" && echo "common-functions.sh found" || echo "common-functions.sh not found (will use direct commands)"
```

**If found, you can source it, but continue with direct bash commands either way for compatibility.**

**Why this matters:** Provides access to performance-optimized functions, input validation, progress indicators, and standardized error handling.

---

### Step 1: Find and Verify Context Directory

**v3.0.0:** Commands now work from subdirectories using find-context-folder.sh helper script.

**ACTION:** Use the helper script to find context folder:

```bash
source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
CONTEXT_DIR=$(find_context_folder) || exit 1

echo "✅ Found context at: $CONTEXT_DIR"
```

**Note:** This searches current directory, parent directory, and grandparent directory for context/ folder. Use `$CONTEXT_DIR` variable throughout this command instead of hardcoded `context/`.

**Alternative if script not available:**
```bash
test -d "context" && echo "context" || test -d "../context" && echo "../context" || test -d "../../context" && echo "../../context" || echo "ERROR: context/ not found"
```

**Why this works:**
- Searches current directory first
- Then parent directory (for `backend/` subdirs)
- Then grandparent (for `backend/src/` subdirs)
- Validates with `.context-config.json` check
- Works from anywhere in project structure

---

### Step 2: Analyze What Changed

**Try helper script first (optional):**
```bash
test -x "scripts/save-full-helper.sh" && echo "Helper script available" || echo "Helper script not available - will use manual process"
```

**If helper is available, you can try running it:**
```bash
./scripts/save-full-helper.sh 2>/dev/null && echo "Helper succeeded - draft at context/.session-draft.md" || echo "Helper failed or not available - using manual process"
```

**Manual analysis process - use simple sequential commands:**
```bash
echo "Gathering session information..."
echo ""

# Check for git repository and analyze changes
echo "Checking for git repository..."
git rev-parse --git-dir > /dev/null 2>&1 && echo "Git repository detected" || echo "Not a git repository"
echo ""

# If git repository, get change information
echo "Recent commits (last 10):"
git log --oneline -10 2>/dev/null || echo "No git history available"
echo ""

echo "Working directory status:"
git status 2>/dev/null || echo "Not a git repository"
echo ""

echo "Staged changes:"
git diff --cached --stat 2>/dev/null || echo "No git repository or no staged changes"
echo ""

echo "✅ Analysis complete - ready to create session entry"
echo ""
```

**Key improvements:**
- ✅ No command substitution
- ✅ Auto-runs helper script if available
- ✅ Graceful fallback to manual process
- ✅ Git repo check before git commands
- ✅ Progress indicator with time estimate

---

### Step 3: Create SESSIONS.md Entry (Append-Only Strategy)

```bash
echo "Step 3/10: Creating SESSIONS.md entry..."
echo "⏱️ Estimated time remaining: ~8-10 minutes"
echo ""

# Detect next session number (NO command substitution)
echo "Detecting next session number..."
grep -c "^## Session" "$CONTEXT_DIR/SESSIONS.md"
echo ""

# AI reads the output above (e.g., "12") and uses it
# The AI will create the session entry with the next number

echo "Please provide the following information for the session entry:"
echo ""
echo "1. Session number (based on count above + 1):"
echo "2. Today's date (YYYY-MM-DD):"
echo "3. Current phase/focus:"
echo "4. Session duration (hours):"
echo "5. Brief session focus (1-2 sentences):"
echo ""
```

**Create the session entry** using the Write tool on a draft file, then append:

```bash
echo "Creating session draft..."
echo ""

# AI creates the session entry using Write tool in a draft file
# Template provided below for AI to fill in

echo "Once you've created the draft, append it to SESSIONS.md:"
echo ""
echo "  cat context/.session-draft.md >> $CONTEXT_DIR/SESSIONS.md"
echo "  rm context/.session-draft.md"
echo ""
```

**Session Entry Template** (40-60 lines with depth for AI agents):

```markdown
## Session [N] - YYYY-MM-DD

**Duration:** [X]h | **Focus:** [Brief description] | **Status:** ✅/⏳

### TL;DR
- [Key accomplishment 1]
- [Key accomplishment 2]
- [Key accomplishment 3]

### Problem Solved
**Issue:** [What problem did this session address?]
**Constraints:** [What limitations existed?]
**Approach:** [How did you solve it? What was your thinking?]
**Why this approach:** [Rationale for the chosen solution]

### Decisions
- **[Decision topic]:** [What and why] → See DECISIONS.md D[ID]
- Or: No significant technical decisions this session

### Files
**NEW:** `path/to/file.ts:1-150` - [Purpose and key contents]
**MOD:** `path/to/file.tsx:123-145` - [What changed and why]
**DEL:** `path/to/old-file.ts` - [Why removed]

### Mental Models
**Current understanding:** [Explain your mental model of the system]
**Key insights:** [Insights AI agents should know]
**Gotchas discovered:** [Things that weren't obvious]

### Work In Progress
**Task:** [What's incomplete - be specific]
**Location:** `file.ts:145` in `functionName()`
**Current approach:** [Detailed mental model of what you're doing]
**Why this approach:** [Rationale]
**Next specific action:** [Exact next step]
**Context needed:** [What you need to remember to resume]

### TodoWrite State
**Completed:**
- ✅ [Todo 1]
- ✅ [Todo 2]

**In Progress:**
- ⏳ [Todo 3]

### Next Session
**Priority:** [Most important next action]
**Blockers:** [None / List blockers with details]

---
```

**Critical for AI Agents:**
- TL;DR section - Quick scan of key points
- Problem Solved section - Shows your thinking process
- Mental Models section - AI understands your approach
- Decisions linked to DECISIONS.md - Full rationale available
- Structured but comprehensive (40-60 lines, not 10 or 190)

**Auto-Archiving Check (v3.5.0 - MODULE-102):**

```bash
# Check SESSIONS.md size and offer archiving (v3.5.0+)
echo "Checking SESSIONS.md file size..."
SESSIONS_LINES=$(wc -l < "$CONTEXT_DIR/SESSIONS.md" | tr -d ' ')

if [ "$SESSIONS_LINES" -gt 2000 ]; then
  # Check if user has disabled auto-archiving
  if [ -f "$CONTEXT_DIR/.no-archive" ]; then
    echo ""
    echo "ℹ️  Auto-archiving disabled for this project"
    echo "   SESSIONS.md is large ($SESSIONS_LINES lines) but archiving is skipped"
    echo "   To re-enable: rm $CONTEXT_DIR/.no-archive"
    echo ""
  else
    echo ""
    echo "📦 SESSIONS.md is large ($SESSIONS_LINES lines)"
    echo "   Archiving old sessions improves performance."
    echo ""
    read -p "Archive old sessions (keep last 10)? [Y/n] " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
      echo ""
      echo "🗄️  Archiving old sessions..."
      bash "$(dirname "$CONTEXT_DIR")/scripts/archive-sessions-helper.sh" --keep 10 --context "$CONTEXT_DIR"

    if [ $? -eq 0 ]; then
      echo "✅ Old sessions archived successfully"
      echo ""
      # Refresh line count after archiving
      SESSIONS_LINES=$(wc -l < "$CONTEXT_DIR/SESSIONS.md" | tr -d ' ')
      echo "📊 SESSIONS.md now has $SESSIONS_LINES lines"
    else
      echo ""
      echo "❌ Archiving failed!"
      echo ""
      echo "⚠️  IMPORTANT: Check your SESSIONS.md file"
      echo "   • Backup available at: $CONTEXT_DIR/SESSIONS.md.backup"
      echo "   • To restore: cp $CONTEXT_DIR/SESSIONS.md.backup $CONTEXT_DIR/SESSIONS.md"
      echo "   • Verify SESSIONS.md has correct content before proceeding"
      echo ""
      echo "   Possible causes:"
      echo "   - Disk full (check available space)"
      echo "   - Permissions issue (check file permissions)"
      echo "   - Corrupted SESSIONS.md format"
      echo ""
      echo "   Recommended: Fix the issue and run archiving manually:"
      echo "   bash scripts/archive-sessions-helper.sh --keep 10 --context $CONTEXT_DIR"
      echo ""
    fi
    else
      echo "Skipped archiving (file will continue growing)"
      echo ""
      # Offer to disable future prompts
      read -p "Don't ask again? [y/N] " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        touch "$CONTEXT_DIR/.no-archive"
        echo "✅ Auto-archiving disabled for this project"
        echo "   To re-enable: rm $CONTEXT_DIR/.no-archive"
      fi
    fi
    echo ""
  fi
fi

echo "✅ Session entry ready to append"
echo ""
```

---

### Step 4: Update STATUS.md

```bash
echo "Step 4/10: Updating STATUS.md..."
echo "⏱️ Estimated time remaining: ~6-8 minutes"
echo ""

echo "Update the following sections in STATUS.md:"
echo ""
echo "1. Current Phase/Focus - Where are you now?"
echo "2. Active Tasks - From TodoWrite state"
echo "3. Work In Progress - Detailed WIP from session"
echo "4. Recent Accomplishments - What you completed"
echo "5. Next Session Priorities - What to do next"
echo "6. Blockers - Any issues preventing progress"
echo ""

echo "STATUS.md is the single source of truth for 'what's happening now'"
echo ""
echo "✅ Use Edit tool to update each section"
echo ""
```

---

### Step 5: Update DECISIONS.md (If Needed)

```bash
echo "Step 5/10: Checking for new decisions..."
echo "⏱️ Estimated time remaining: ~5-7 minutes"
echo ""

echo "Did you make any significant technical decisions this session?"
echo ""
echo "Examples of decisions that should be documented:"
echo "  • Choice of library/framework"
echo "  • Architectural pattern decision"
echo "  • Data model design"
echo "  • API design approach"
echo "  • Security implementation choice"
echo ""

# If yes, AI creates decision entry
# If no, skip this step

echo "If yes, add entry to DECISIONS.md with:"
echo "  • Context (problem, constraints)"
echo "  • Decision (what you chose)"
echo "  • Rationale (WHY this approach)"
echo "  • Alternatives considered"
echo "  • Tradeoffs accepted"
echo "  • When to reconsider"
echo ""

echo "Then link from SESSIONS.md entry: 'See DECISIONS.md D[ID]'"
echo ""
```

---

### Step 6: Update Quick Reference in STATUS.md

```bash
echo "Step 6/10: Updating Quick Reference section..."
echo "⏱️ Estimated time remaining: ~3-5 minutes"
echo ""

echo "The Quick Reference section provides a dashboard view at the top of STATUS.md"
echo ""

# Read current values (no command substitution needed)
echo "Gathering current values..."
echo ""

echo "Project name from config:"
cat "$CONTEXT_DIR/.context-config.json" | grep '"name"' | head -1
echo ""

echo "Current phase from STATUS.md:"
grep -A 2 "## Current Phase" "$CONTEXT_DIR/STATUS.md" | grep "Phase:"
echo ""

echo "Active tasks count:"
grep -c "^- \[ \]" "$CONTEXT_DIR/STATUS.md" || echo "0"
echo ""

echo "Use these values to update the Quick Reference section"
echo "Located between ## 📊 Quick Reference and the next ---"
echo ""
echo "✅ Use Edit tool to update Quick Reference"
echo ""
```

---

### Step 7: Optional Files

```bash
echo "Step 7/10: Checking optional documentation files..."
echo "⏱️ Estimated time remaining: ~2-3 minutes"
echo ""

# Check for optional files
if [ -f "$CONTEXT_DIR/ARCHITECTURE.md" ]; then
  echo "📐 ARCHITECTURE.md exists"
  echo "   Update if: Architectural changes or design decisions made"
  echo "   Skip if: No architecture changes this session"
  echo ""
fi

if [ -f "$CONTEXT_DIR/PRD.md" ]; then
  echo "📋 PRD.md exists"
  echo "   Update if: Product vision or roadmap changed"
  echo "   Skip if: Just implementation work"
  echo ""
fi

# Suggest new files if needed
echo "Checking if new documentation files needed..."
echo ""

if [ ! -f "$CONTEXT_DIR/ARCHITECTURE.md" ]; then
  # Count files in src (if exists)
  if [ -d "src" ]; then
    echo "Checking project complexity..."
    find src -type f 2>/dev/null | wc -l
    echo ""

    echo "If file count > 20 and complexity is growing:"
    echo "  Consider creating ARCHITECTURE.md for system design documentation"
    echo ""
  fi
fi

echo "✅ Optional files checked"
echo ""
```

---

### Step 8: Check CONTEXT.md Currency

```bash
echo "Step 8/10: Checking CONTEXT.md currency..."
echo "⏱️ Estimated time remaining: ~2 minutes"
echo ""

# Check if CONTEXT.md exists
if [ ! -f "$CONTEXT_DIR/CONTEXT.md" ]; then
  echo "ℹ️  CONTEXT.md not found - skipping currency check"
  echo ""
else
  # Extract "Last Updated" date from CONTEXT.md (common pattern: "Last Updated: YYYY-MM-DD")
  CONTEXT_LAST_UPDATED=$(grep -iE "Last Updated:.*[0-9]{4}-[0-9]{2}-[0-9]{2}" "$CONTEXT_DIR/CONTEXT.md" | \
                          grep -oE "[0-9]{4}-[0-9]{2}-[0-9]{2}" | head -1)

  if [ -n "$CONTEXT_LAST_UPDATED" ]; then
    # Calculate days since last update
    CONTEXT_DAYS_OLD=$(days_since_date "$CONTEXT_LAST_UPDATED" 2>/dev/null || echo "-1")

    if [ "$CONTEXT_DAYS_OLD" = "-1" ]; then
      echo "ℹ️  Could not parse CONTEXT.md date: $CONTEXT_LAST_UPDATED"
      echo ""
    elif [ "$CONTEXT_DAYS_OLD" -gt 7 ]; then
      echo "⚠️  CONTEXT.md is $CONTEXT_DAYS_OLD days old (last updated: $CONTEXT_LAST_UPDATED)"
      echo ""
      echo "   Consider updating:"
      echo "   • Current Phase / Project Status"
      echo "   • Recent accomplishments and goals"
      echo "   • Last Updated date"
      echo ""
    else
      echo "✅ CONTEXT.md is current ($CONTEXT_DAYS_OLD days old)"
      echo ""
    fi

    # Show current phase for verification
    echo "   Current Phase in CONTEXT.md:"
    CURRENT_PHASE=$(grep -A2 "## Current Phase" "$CONTEXT_DIR/CONTEXT.md" | tail -2 | head -1 | sed 's/^[[:space:]]*//')
    if [ -n "$CURRENT_PHASE" ]; then
      echo "   $CURRENT_PHASE"
    else
      echo "   (Could not detect - verify manually)"
    fi
    echo ""
  else
    echo "ℹ️  No 'Last Updated' date found in CONTEXT.md"
    echo "   Add a 'Last Updated: YYYY-MM-DD' line to enable staleness tracking"
    echo ""
  fi
fi
```

**Why this matters:** CONTEXT.md is the main project overview file. Stale CONTEXT.md can mislead AI agents about project phase, goals, and current state.

**Threshold:** 7 days - Projects evolve quickly, main context should stay current.

**Non-blocking:** This is a warning only - won't prevent save from completing.

---

### Step 9: Check README.md Staleness

```bash
echo "Step 9/10: Checking README.md currency..."
echo "⏱️ Estimated time remaining: ~1-2 minutes"
echo ""

# Check if README.md exists in project root
if [ ! -f "README.md" ]; then
  echo "ℹ️  README.md not found - skipping staleness check"
  echo ""
else
  # Calculate days since README.md was last modified
  README_DAYS_OLD=$(days_since_file_modified "README.md" 2>/dev/null || echo "-1")

  if [ "$README_DAYS_OLD" = "-1" ]; then
    echo "ℹ️  Could not check README.md modification date"
    echo ""
  elif [ "$README_DAYS_OLD" -gt 14 ]; then
    echo "⚠️  README.md is $README_DAYS_OLD days old"
    echo ""
    echo "   Consider updating:"
    echo "   • Tech stack versions (framework, runtime, major dependencies)"
    echo "   • Module/feature list (if new modules added)"
    echo "   • Accomplishments and project status"
    echo "   • Installation or setup instructions (if changed)"
    echo ""
  else
    echo "✅ README.md is current ($README_DAYS_OLD days old)"
    echo ""
  fi
fi
```

**Why this matters:** README.md is the first file developers see. Outdated tech stack versions or missing features create confusion and slow onboarding.

**Threshold:** 14 days - README evolves slower than CONTEXT.md, less frequent updates acceptable.

**Non-blocking:** This is a warning only - won't prevent save from completing.

---

### Step 10: Git Push Protection & Final Report

```bash
echo "Step 10/10: Finalizing save and checking git push approval..."
echo "⏱️ Estimated time remaining: ~1 minute"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚨 GIT PUSH PROTECTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Before pushing to GitHub, verify:"
echo ""
echo "1. Did user explicitly say 'push' in their LAST message?"
echo "   [ ] Yes, user explicitly said to push"
echo "   [ ] No or unclear"
echo ""
echo "2. Do I have permission for THIS SPECIFIC push?"
echo "   [ ] Yes, user approved in last message"
echo "   [ ] No or based on general workflow description"
echo ""
echo "3. Is this a production deployment or build trigger?"
echo "   [ ] Yes (requires explicit approval)"
echo "   [ ] No"
echo ""
echo "DECISION LOGIC:"
echo ""
echo "If ANY answer is 'No' or 'unclear':"
echo "  ✅ STOP - Commit locally only"
echo "  ✅ Ask user: 'Ready to push to GitHub? This will trigger [action]. Approve?'"
echo "  ✅ Wait for explicit 'yes' / 'push' / 'approved'"
echo ""
echo "If ALL answers are 'Yes':"
echo "  ✅ Verify by re-reading user's exact message"
echo "  ✅ Confirm approval is for THIS push (not workflow description)"
echo "  ✅ Then proceed with push"
echo ""
echo "REMEMBER:"
echo "  • General workflow instructions ≠ permission for this specific push"
echo "  • ALWAYS ask explicitly before every push"
echo "  • Permission does NOT carry forward between sessions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Organization reminder (if needed)
echo "Checking for loose documentation files..."
LOOSE_COUNT=$(find . -maxdepth 1 -name "*.md" \
  ! -name "README.md" \
  ! -name "SECURITY.md" \
  ! -name "CONTRIBUTING.md" \
  ! -name "LICENSE.md" \
  ! -name "CHANGELOG.md" \
  ! -name "ORGANIZATION.md" \
  2>/dev/null | wc -l | tr -d ' ')

if [ "$LOOSE_COUNT" -gt 2 ]; then
  echo ""
  echo "🧹━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "   ORGANIZATION REMINDER"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Detected $LOOSE_COUNT loose documentation files in root."
  echo ""
  echo "💡 Consider running /organize-docs for guided cleanup"
  echo ""
  echo "Suggested locations:"
  echo "  📁 Active planning     → docs/planning/"
  echo "  📁 Completed work      → artifacts/milestones/"
  echo "  📁 Old proposals       → artifacts/planning/"
  echo ""
  echo "Or say 'skip organization' to continue"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi

# Final report
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ COMPREHENSIVE SAVE COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Core Updates:"
echo "  ✅ SESSIONS.md - Comprehensive session entry (mental models, WIP)"
echo "  ✅ STATUS.md - Updated tasks, blockers, priorities, Quick Reference"
echo "  ✅ DECISIONS.md - [Updated / No new decisions]"
echo ""
echo "Optional Updates:"
echo "  • ARCHITECTURE.md - [Updated / Skipped]"
echo "  • PRD.md - [Updated / Skipped]"
echo ""
echo "For AI Agents:"
echo "  • Mental models captured in SESSIONS.md"
echo "  • Decision rationale in DECISIONS.md"
echo "  • Full context available for review/takeover"
echo ""
echo "Time Invested: ~10-15 minutes (comprehensive documentation)"
echo ""
echo "Next Session:"
echo "  • Use /save for quick updates (2-3 min)"
echo "  • Use /save-full again before next break/handoff"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

---

## Important Guidelines

### Update Philosophy

**Dual purpose in mind:**
- **For you:** Capture TodoWrite state, update STATUS.md, quick recovery
- **For AI agents:** Mental models, decision rationale, comprehensive context

**Be structured AND comprehensive:**
- Structured format (scannable sections)
- Include depth (mental models, rationale, constraints)
- Include file paths and line numbers
- Capture the "why" not just the "what"
- Document WIP state precisely
- **Structured ≠ minimal** - AI agents need context

**Grow when needed:**
- Don't create files prematurely
- Suggest ARCHITECTURE/PRD when complexity warrants
- DECISIONS.md is always core (AI agents need it)

**See:** `.claude/docs/save-context-guide.md` for philosophy, examples, best practices

### What to Always Capture

**Non-negotiable (Core Files):**
- **SESSIONS.md entry** - Comprehensive with mental models (40-60 lines)
- **STATUS.md update** - Current tasks, blockers, priorities, Quick Reference
- **DECISIONS.md entry** - If significant decisions made (WHY)
- **Work in progress** - Exact resume point with mental model
- **TodoWrite state** - Capture completed vs. pending

**Critical for AI agents:**
- Mental models - How you understand the system
- Decision rationale - WHY you chose this approach
- Problem-solving approach - How you tackled the issue
- Constraints - What limitations existed
- Gotchas discovered - Things that weren't obvious

**Can skip:**
- Optional files that didn't change (PRD, ARCHITECTURE)
- Sections that have no updates

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

**Why:** Future AI agent (or you) needs exact context to resume.

### Append-Only Strategy for Large SESSIONS.md Files

**Problem:** SESSIONS.md files can grow beyond 25K tokens (Read tool limit)

**Solution:** Always append, never edit the full file

**Process:**
1. Create session entry in draft file (context/.session-draft.md)
2. Append draft to SESSIONS.md: `cat context/.session-draft.md >> context/SESSIONS.md`
3. Delete draft: `rm context/.session-draft.md`

**Benefits:**
- Works with any file size
- No Read tool limitations
- Fast operation
- Zero risk of corruption

**When to archive:**
- When SESSIONS.md > 5000 lines
- Move sessions 1-50 to artifacts/sessions/archive-YYYY-QN.md
- Keep recent 50-100 sessions in main file

## Success Criteria

✅ SESSIONS.md has comprehensive entry (40-60 lines with TL;DR)
✅ Mental models captured for AI understanding
✅ TodoWrite state preserved
✅ WIP state captured precisely
✅ STATUS.md updated as single source of truth
✅ Quick Reference in STATUS.md updated
✅ DECISIONS.md updated if decisions made
✅ Can resume seamlessly next session
✅ **AI agents can review with full context**
✅ **AI agents can take over development**
✅ **No command substitution blocking automation**
✅ **Progress indicators throughout**
✅ **File size warnings for large SESSIONS.md**

## Time Investment

- Simple session: 10-12 minutes
- Complex session with decisions: 12-15 minutes
- With new optional file: 15-20 minutes

**Worth every second** - enables perfect session continuity AND AI agent review/takeover.

---

**Version:** 3.6.0
**Updated:** v3.1.0 - Removed all command substitution, added progress indicators, implemented append-only SESSIONS.md strategy, added git repo checks, added file size warnings
