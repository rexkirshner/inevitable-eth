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

### Step 0: Load Shared Functions

**ACTION:** Source the common functions library:

```bash
# Load shared utilities (v2.3.0+)
if [ -f "scripts/common-functions.sh" ]; then
  source scripts/common-functions.sh
else
  echo "⚠️  Warning: common-functions.sh not found (using legacy mode)"
fi
```

**Why this matters:** Provides access to performance-optimized functions, version checking, progress indicators, and standardized logging.

---

### Step 0.5: Find Context Folder

**ACTION:** Source the context folder detection script and find the context directory:

```bash
# Load context folder detection (v3.0.0+)
source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
CONTEXT_DIR=$(find_context_folder) || exit 1

echo "✅ Found context at: $CONTEXT_DIR"
```

**Why this matters:** Allows command to work from subdirectories (backend/, src/, etc.) by searching up to 2 parent directories.

---

### Step 1: Verify Context Exists

**NOTE:** This step is now handled by Step 0.5 (find_context_folder fails if context/ not found)

```
If context/ folder missing:
- Report: "No context found. Run /init-context to set up."
- Stop execution

If context/ exists:
- Proceed to Step 1.5
```

### Step 1.5: Check for System Updates

**Check if newer version available on GitHub:**

**ACTION:** Use the Bash tool to check version using shared functions:

```bash
# Get current version using shell-compatible approach (v3.5.0+ - fixes zsh parsing error)
# Fallback chain: VERSION file → .context-config.json → "unknown"
CURRENT_VERSION=$(cat VERSION 2>/dev/null)
if [ -z "$CURRENT_VERSION" ]; then
  CURRENT_VERSION=$(grep -m 1 '"version":' context/.context-config.json 2>/dev/null | sed 's/.*"version": "\([^"]*\)".*/\1/')
fi
if [ -z "$CURRENT_VERSION" ]; then
  CURRENT_VERSION="unknown"
fi

# Fetch latest version from GitHub (with retry logic)
log_verbose "Checking for system updates..."
LATEST_VERSION=$(curl --connect-timeout 5 --max-time 10 -sL \
  https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/VERSION 2>/dev/null | tr -d ' \n')

# Fallback to config file if VERSION file not found
if [ -z "$LATEST_VERSION" ]; then
  LATEST_VERSION=$(curl --connect-timeout 5 --max-time 10 -sL \
    https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/config/.context-config.template.json \
    | grep -m 1 '"version":' | sed 's/.*"version": "\([^"]*\)".*/\1/' 2>/dev/null)
fi

# Compare versions (skip if current version is unknown)
if [ "$CURRENT_VERSION" != "unknown" ] && [ -n "$LATEST_VERSION" ] && [ "$CURRENT_VERSION" != "$LATEST_VERSION" ]; then
  echo "UPDATE_AVAILABLE|$CURRENT_VERSION|$LATEST_VERSION"
else
  echo "UP_TO_DATE|$CURRENT_VERSION"
fi
```

**After running the check:**

**If output contains "UPDATE_AVAILABLE":**

Parse the versions and ask user:

```
📦 Update Available

Your AI Context System: v[CURRENT_VERSION]
Latest on GitHub: v[LATEST_VERSION]

Would you like to update now? [Y/n]

(This will run /update-context-system)
```

**If user responds Y or yes:**
- Report: "Running /update-context-system..."
- **ACTION:** Execute the /update-context-system command
- After update completes, resume from Step 2 of this command

**If user responds n or no:**
- Report: "⏭️ Skipping update - continuing with context review"
- Note in final report: "System update available (v[LATEST_VERSION])"
- Continue to Step 2

**If output contains "UP_TO_DATE":**
- Silently continue to Step 2 (no message needed)

**If version check fails (network issue, etc.):**
- Silently continue to Step 2 (don't block review on network)

### Step 1.6: Critical Protocol Reminder

**🚨 Set session flags and remind about critical protocols:**

**ACTION:** Initialize session state and display critical reminders

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 CRITICAL PROTOCOL REMINDER - Session Start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Git Push Permission Protocol:**

RULE: NEVER push to GitHub without explicit user permission.

Why this matters:
- Triggers builds (costs quota/money)
- Deploys to production (user controls timing)
- Trust issue (autonomous actions erode confidence)

SESSION FLAG SET:
PUSH_APPROVED = false

**v2.2.0 ENFORCEMENT:** This flag now BLOCKS git push in /save-full

HOW TO APPROVE (when user explicitly requests push):
1. User says "push", "deploy", or "push to github" in their message
2. Set: PUSH_APPROVED = true
3. Run /save-full (will check flag and allow push)

APPROVAL PHRASES (from .context-config.json):
✅ "push to github"
✅ "deploy this"
✅ "yes push"
✅ "go ahead and push"

NOT APPROVAL:
❌ "save and push" in workflow description
❌ "then push" in instructions
❌ Any mention of push without explicit "do it now"

BEFORE SETTING PUSH_APPROVED=true, ASK:
"Did the user say YES PUSH THIS in their LAST message?"

If NO → Keep PUSH_APPROVED=false, /save-full will block push
If YES → Set PUSH_APPROVED=true, verify by re-reading, auto-log approval

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**This reminder is displayed at session start to prevent git push violations.**

### Step 2: Load All Documentation

Read and parse all context files:

```
Files to load:
- $CONTEXT_DIR/CONTEXT.md (v2.0+) or context/CLAUDE.md (pre-v2.0)
- $CONTEXT_DIR/STATUS.md (v2.1+ includes Quick Reference section)
- $CONTEXT_DIR/DECISIONS.md
- $CONTEXT_DIR/SESSIONS.md (see smart loading strategy below)
- $CONTEXT_DIR/PRD.md (optional)
- $CONTEXT_DIR/CODE_MAP.md (optional, v2.1+)
- $CONTEXT_DIR/ARCHITECTURE.md (optional)
- $CONTEXT_DIR/CODE_STYLE.md (optional)
- $CONTEXT_DIR/KNOWN_ISSUES.md (optional)
- $CONTEXT_DIR/.context-config.json
```

**Note any missing files** - will affect confidence score.

#### SESSIONS.md Smart Loading (v3.5.0 - Automated)

**Step 1: Detect file size**

First, check if SESSIONS.md exists and get its line count:

```bash
if [ -f "$CONTEXT_DIR/SESSIONS.md" ]; then
  FILE_SIZE=$(wc -l < "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null | tr -d ' ')

  # Validate FILE_SIZE is a number
  if ! [[ "$FILE_SIZE" =~ ^[0-9]+$ ]]; then
    echo "⚠️  Could not determine SESSIONS.md size"
    FILE_SIZE=0
  fi

  if [ "$FILE_SIZE" -eq 0 ]; then
    echo "⚠️  SESSIONS.md is empty"
  else
    echo "📖 SESSIONS.md size: $FILE_SIZE lines"
  fi
else
  echo "⚠️  SESSIONS.md not found"
  FILE_SIZE=0
fi
```

**Step 2: Determine Session Index size (for medium/large files)**

For medium and large files, we need to know where Session Index ends to load it completely.

```bash
# Find line number where Session Index ends (first --- separator after index)
if [ "$FILE_SIZE" -ge 1000 ]; then
  INDEX_END=$(grep -n "^---$" "$CONTEXT_DIR/SESSIONS.md" | head -1 | cut -d: -f1)
  if [ -z "$INDEX_END" ]; then
    # No separator found, assume index is first 300 lines
    INDEX_END=300
  fi
  echo "📋 Session Index ends at line $INDEX_END"
fi
```

**Step 3: Apply smart loading strategy based on file size**

**If file size < 1000 lines (small file):**
- Use Read tool to load entire file: `Read "$CONTEXT_DIR/SESSIONS.md"`
- Display: "📖 Loading SESSIONS.md fully ($FILE_SIZE lines)"

**If file size 1000-5000 lines (medium file):**
- Display: "📖 Loading SESSIONS.md strategically ($FILE_SIZE lines)"
- Display: "   Reading: Session index + recent sessions"
- Part 1: Use Read tool with `limit=$INDEX_END` to get complete session index
- Part 2: Calculate offset: `OFFSET = FILE_SIZE - 500`
- Part 2: Use Read tool with `offset=$OFFSET limit=500` to get recent sessions

**If file size > 5000 lines (large file):**
- Display: "📖 Loading SESSIONS.md minimally ($FILE_SIZE lines - very large)"
- Display: "   Reading: Session index + current session only"
- Part 1: Use Read tool with `limit=$INDEX_END` to get complete session index
- Part 2: Calculate offset: `OFFSET = FILE_SIZE - 300`
- Part 2: Use Read tool with `offset=$OFFSET limit=300` to get current session
- Display warning:
  ```
  ⚠️  SESSIONS.md is very large ($FILE_SIZE lines)
     Consider archiving old sessions to improve performance
  ```

**Why this works:**
- Auto-detects file size and chooses optimal strategy
- Small files (<1000 lines): Full read
- Medium files (1000-5000 lines): Index + recent sessions (800 lines total)
- Large files (>5000 lines): Index + current session only (500 lines total) + warning
- Prevents token limit crashes on large files
- Clear instructions, not mixed bash/tool calls

---

### Step 2.7: Documentation Staleness Check ✨ v3.3.0

**NEW in v3.3.0:** Proactive detection of stale documentation to prevent context drift.

Check the currency of all context documentation files and identify gaps:

```bash
echo ""
echo "📅 Documentation Staleness Analysis"
echo ""

# Define thresholds (configurable from .context-config.json in future)
THRESHOLD_GREEN=7
THRESHOLD_YELLOW=14

# Check all context/*.md files
for file in "$CONTEXT_DIR"/*.md; do
  # Skip if no files found
  [ -e "$file" ] || continue

  FILENAME=$(basename "$file")

  # Calculate days since last modification
  DAYS_OLD=$(days_since_file_modified "$file" 2>/dev/null || echo "-1")

  if [ "$DAYS_OLD" = "-1" ]; then
    echo "  ⚠️  $FILENAME - Could not check staleness"
  elif [ "$DAYS_OLD" -le "$THRESHOLD_GREEN" ]; then
    echo "  🟢 $FILENAME - Current ($DAYS_OLD days old)"
  elif [ "$DAYS_OLD" -le "$THRESHOLD_YELLOW" ]; then
    echo "  🟡 $FILENAME - Getting stale ($DAYS_OLD days old)"
  else
    echo "  🔴 $FILENAME - Stale ($DAYS_OLD days old, update recommended)"
  fi
done

echo ""
```

**Color coding:**
- 🟢 Green: ≤7 days (current)
- 🟡 Yellow: 8-14 days (getting stale)
- 🔴 Red: >14 days (stale, update recommended)

**Module Documentation Check:**

```bash
echo "📂 Module Documentation Check"
echo ""

# Check for src/modules/ directory (common pattern)
if [ -d "src/modules" ]; then
  MISSING_READMES=()
  TOTAL_MODULES=0

  for module_dir in src/modules/*/; do
    # Skip if no modules found
    [ -d "$module_dir" ] || continue

    TOTAL_MODULES=$((TOTAL_MODULES + 1))
    MODULE_NAME=$(basename "$module_dir")

    if [ ! -f "${module_dir}README.md" ]; then
      MISSING_READMES+=("$MODULE_NAME")
    fi
  done

  # Report results
  if [ "$TOTAL_MODULES" -eq 0 ]; then
    echo "  ℹ️  No modules found in src/modules/"
  elif [ ${#MISSING_READMES[@]} -eq 0 ]; then
    echo "  ✅ All $TOTAL_MODULES modules have READMEs"
  else
    echo "  ⚠️  Missing READMEs for ${#MISSING_READMES[@]} of $TOTAL_MODULES modules:"
    for missing in "${MISSING_READMES[@]}"; do
      echo "     - $missing"
    done
  fi
else
  echo "  ℹ️  No src/modules/ directory found - skipping module check"
fi

echo ""
```

**Decision Documentation Check:**

```bash
echo "📋 Decision Documentation"
echo ""

if [ ! -f "$CONTEXT_DIR/DECISIONS.md" ]; then
  echo "  ⚠️  DECISIONS.md not found"
  echo ""
else
  # Count documented decisions
  DECISION_COUNT=$(grep "^### D[0-9]" "$CONTEXT_DIR/DECISIONS.md" 2>/dev/null | wc -l | tr -d ' ')
  # Use wc -l instead of grep -c to avoid multiline output issues
  if [ -z "$DECISION_COUNT" ]; then
    DECISION_COUNT="0"
  fi

  # Count total git commits (if in git repo)
  if git rev-parse --git-dir > /dev/null 2>&1; then
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")

    echo "  Documented decisions: $DECISION_COUNT"
    echo "  Total commits: $COMMIT_COUNT"

    # Heuristic: Expect ~1 decision per 20-30 commits
    EXPECTED_DECISIONS=$((COMMIT_COUNT / 25))

    if [ "$DECISION_COUNT" -lt 5 ] && [ "$COMMIT_COUNT" -gt 50 ]; then
      echo "  ⚠️  Consider documenting more architectural decisions"
      echo "      (Expected ~$EXPECTED_DECISIONS decisions for $COMMIT_COUNT commits)"
    elif [ "$DECISION_COUNT" -ge 5 ]; then
      echo "  ✅ Good decision documentation coverage"
    else
      echo "  ✅ Decision count reasonable for project size"
    fi
  else
    echo "  Documented decisions: $DECISION_COUNT"
    echo "  ℹ️  Not a git repository - can't compare to commits"
  fi
fi

echo ""
```

**Why this matters:**
- Detects documentation drift before it becomes a problem
- Identifies missing module READMEs (common gap)
- Highlights underused DECISIONS.md (architectural context loss)
- Proactive warnings = better context maintenance

**Non-blocking:** This is informational only - won't prevent review from completing.

---

### Step 2.8: Cross-Document Consistency ✨ v3.5.0

**NEW in v3.5.0:** Automated consistency verification across context files to catch drift.

Check that key fields align across CONTEXT.md, STATUS.md, and SESSIONS.md:

```bash
echo ""
echo "🔍 Cross-Document Consistency Check"
echo ""

# 1. Last Updated Dates
echo "📅 Last Updated Dates:"
# Extract just the YYYY-MM-DD portion for flexibility (handles dates with times, etc.)
CONTEXT_DATE=$(grep "Last Updated:" "$CONTEXT_DIR/CONTEXT.md" 2>/dev/null | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
STATUS_DATE=$(grep "Last Updated:" "$CONTEXT_DIR/STATUS.md" 2>/dev/null | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
SESSIONS_DATE=$(grep "Last Updated:" "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')

echo "  CONTEXT.md:  ${CONTEXT_DATE:-not found}"
echo "  STATUS.md:   ${STATUS_DATE:-not found}"
echo "  SESSIONS.md: ${SESSIONS_DATE:-not found}"
echo ""

# 2. Phase Consistency
echo "🎯 Current Phase:"
CONTEXT_PHASE=$(grep -E "^Phase:|^\*\*Phase:\*\*" "$CONTEXT_DIR/CONTEXT.md" 2>/dev/null | sed 's/.*Phase: *//' | sed 's/\*\*//g' | head -1)
STATUS_PHASE=$(grep -E "^Phase:|^\*\*Phase:\*\*" "$CONTEXT_DIR/STATUS.md" 2>/dev/null | sed 's/.*Phase: *//' | sed 's/\*\*//g' | head -1)

echo "  CONTEXT.md: ${CONTEXT_PHASE:-not found}"
echo "  STATUS.md:  ${STATUS_PHASE:-not found}"

if [ -n "$CONTEXT_PHASE" ] && [ -n "$STATUS_PHASE" ] && [ "$CONTEXT_PHASE" != "$STATUS_PHASE" ]; then
  echo ""
  echo "  ⚠️  Phase mismatch detected:"
  echo "      CONTEXT.md: \"$CONTEXT_PHASE\""
  echo "      STATUS.md:  \"$STATUS_PHASE\""
  echo ""
  echo "  📝 Action Required:"
  echo "     1. Determine which phase is correct (usually STATUS.md is most current)"
  echo "     2. Update the out-of-date file to match"
  echo "     3. Typically: Edit CONTEXT.md to match STATUS.md"
  echo "     4. Or if CONTEXT.md is correct: Update STATUS.md with /save command"
  echo ""
fi
echo ""

# 3. Session Count
echo "📊 Session Statistics:"
if [ -f "$CONTEXT_DIR/SESSIONS.md" ]; then
  SESSION_COUNT=$(grep -cE "^## Session [0-9]+" "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null || echo "0")
  echo "  Total sessions documented: $SESSION_COUNT"
else
  echo "  SESSIONS.md not found"
fi
echo ""
```

**What this checks:**
- **Date alignment**: Ensures documentation is updated together
- **Phase consistency**: Catches phase drift between files
- **Session tracking**: Validates session count is accurate

**Why this matters:**
- Manual cross-file comparison is error-prone
- Catches inconsistencies early
- Specific, actionable warnings
- Maintains context quality automatically

**Non-blocking:** This is informational only - won't prevent review from completing.

---

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

#### CONTEXT.md Verification

**Getting Started section:**
- [ ] Verify links to STATUS.md, SESSIONS.md, DECISIONS.md work
- [ ] Check that orientation paths (5-min, 30-min) are accurate

**Tech Stack section:**
- [ ] Verify listed technologies match package.json (or equivalent)
- [ ] Check links to DECISIONS.md for rationale are correct

**High-Level Architecture section:**
- [ ] Verify architecture pattern matches actual implementation
- [ ] Check system diagram reflects current structure
- [ ] Confirm key components are accurately described

**Directory Structure section:**
- [ ] Check directories mentioned actually exist
- [ ] Verify file paths are correct
- [ ] Confirm folder structure matches description

**Environment Setup section:**
- [ ] Run listed commands to verify they exist (dev, test, build)
- [ ] Check prerequisites are accurate
- [ ] Verify environment variables section is current

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

#### STATUS.md Verification (v2.1+)

**Quick Reference section (auto-generated):**
- [ ] Project info accurate (name, phase, status)
- [ ] URLs current (production, staging, repository)
- [ ] Tech stack summary matches CONTEXT.md
- [ ] Commands work (dev, test, build)
- [ ] Current focus reflects first active task
- [ ] Last session link works
- [ ] Documentation health timestamp recent

**Active Tasks section:**
- [ ] Tasks are accurate and current
- [ ] Completed items marked done
- [ ] Work In Progress section reflects reality
- [ ] Blockers are current
- [ ] Next session priorities make sense

**Check against actual state:**
- [ ] Matches git status and recent commits
- [ ] WIP location references exist
- [ ] Next actions are actionable

**Issues found:**
- Stale tasks
- Missing recent work
- Incorrect WIP state
- Quick Reference out of sync (needs /save or /save-full)

### Step 5: Check Cross-Document Consistency

Verify documentation tells coherent story:

**Status consistency:**
- [ ] STATUS.md Quick Reference section reflects current state
- [ ] STATUS.md matches latest SESSIONS.md entry
- [ ] Progress matches across docs
- [ ] Dates/versions align

**Technical consistency:**
- [ ] ARCHITECTURE.md reflects DECISIONS.md choices
- [ ] CODE_STYLE.md matches actual code patterns
- [ ] Tech stack consistent across docs

**Issue tracking consistency:**
- [ ] KNOWN_ISSUES.md blockers mentioned in STATUS.md
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

[If update was available but skipped in Step 1.5]
📦 **System Update Available:** v[CURRENT] → v[LATEST]
   Run /update-context-system when convenient

✅ **Accurate Documentation:**
- CONTEXT.md - Architecture and setup verified
- STATUS.md - Current state matches reality (Quick Reference up to date)
- SESSIONS.md - Complete WIP capture with TL;DR summaries

⚠️ **Issues Found:**
- KNOWN_ISSUES.md - 2 resolved issues not removed
- DECISIONS.md - Missing recent JWT library choice
- STATUS.md - 1 completed task not marked done

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
1. [Top priority from STATUS.md]
2. [Second priority]
3. [Third priority]

**Suggested Actions:**
- [If issues found] Update KNOWN_ISSUES.md to remove fixed items
- [If decisions missing] Document JWT library decision
- [If WIP unclear] Check git status and recent commits
- [If update available] Run /update-context-system to get latest improvements
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
- Understand user preferences from CONTEXT.md
- Check STATUS.md for current priorities
- Review CODE_STYLE.md standards (if exists)
- Note any critical issues from KNOWN_ISSUES.md (if exists)
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

---

## Session Start: Git Workflow Reminder

**After completing context review**, present this copy-paste prompt to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 COPY-PASTE PROMPT FOR THIS SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For this session, please follow these git workflow rules:

1. **Commit liberally and often** - Create git commits whenever you complete a logical unit of work (fixing a bug, adding a feature, refactoring a section, etc.)

2. **NEVER push to GitHub without explicit permission** - You may stage files (git add) and commit locally (git commit), but ONLY push to remote (git push) when I explicitly say "push to github" or similar.

3. **Permission does NOT carry forward** - If I say "commit and push" for one change, that permission applies ONLY to that specific commit. Future commits require NEW explicit permission to push.

Think of it as: Local commits are safe and encouraged. Remote pushes require explicit approval each time.

Understood?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Why this matters:**
- Standardizes git workflow expectations across all AI assistants
- Prevents accidental pushes to remote repository
- Encourages frequent local commits (good practice)
- User controls when work is published to team

**User action:** Copy the prompt above and paste it into your session to set ground rules with the AI.

---

**Version:** 3.6.0
**Updated:** v3.0.4 - Added git workflow reminder for session start
