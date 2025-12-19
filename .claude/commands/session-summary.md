---
name: session-summary
description: View condensed session history for quick navigation
---

# /session-summary Command

**Purpose:** Quick navigation of session history via TL;DR summaries

**Use this when:**
- Starting a new session and want to quickly catch up
- Looking for when a specific feature was implemented
- Reviewing recent work before a handoff
- Understanding project progression at a glance

## Usage

```bash
/session-summary              # Show last 5 sessions
/session-summary --last 10    # Show last N sessions
/session-summary --full       # Show full summaries, not just TL;DR
```

## Execution Steps

### Step 1: Verify SESSIONS.md Exists

```bash
if [ ! -f "context/SESSIONS.md" ]; then
  echo "❌ No session history found"
  echo "Run /save-full to create your first session entry"
  exit 1
fi
```

### Step 2: Parse Command Arguments

**ACTION:** Check for flags

```bash
LIMIT=5              # Default: show last 5 sessions
SHOW_FULL=false      # Default: just show TL;DR

while [[ $# -gt 0 ]]; do
  case $1 in
    --last)
      LIMIT="$2"
      shift 2
      ;;
    --full)
      SHOW_FULL=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: /session-summary [--last N] [--full]"
      exit 1
      ;;
  esac
done
```

### Step 3: Extract Session Summaries

**ACTION:** Parse SESSIONS.md and extract session information

**For each session:**
1. Extract session number, date, and phase from header: `## Session N | YYYY-MM-DD | Phase`
2. Extract TL;DR section content (2-3 sentence summary)
3. Extract Status from session header
4. Extract Next Session priority if available

```bash
# Use Read tool to read SESSIONS.md
# Parse using grep/sed to extract:
# - Session headers: grep '^## Session'
# - TL;DR content: Extract text between '### TL;DR' and next '###'
# - Status: Extract from session header
```

### Step 4: Display Session History

**ACTION:** Output formatted summary to user

**Format (default - TL;DR only):**
```
📖 Session History (Last 5)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 18 | 2025-10-08 | Code Review & Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TL;DR: Validated hosting refactor (Grade A), synthesized
comprehensive context system feedback with recommendations.

Status: ✅ Complete
Next: Review feedback, approve improvements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 17 | 2025-10-08 | Production Migration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TL;DR: Migrated strangewater.xyz to production, fixed
contribute button, completed hosting analysis.

Status: ✅ Complete
Next: Review hosting options, start refactor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 16 | 2025-10-07 | Hosting Refactor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TL;DR: Refactored entire hosting architecture from platform-
specific to service-based with dependency injection pattern.

Status: ✅ Complete
Next: Test all hosting providers, validate patterns

[... 2 more sessions ...]

─────────────────────────────────────────────
💡 Tip: Use /session-summary --full for detailed view
📖 Full history: context/SESSIONS.md
```

**Format (--full mode):**
```
📖 Session History (Last 5) - Full Details

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Session 18 | 2025-10-08 | Code Review & Feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TL;DR:
Validated hosting refactor (Grade A), synthesized comprehensive
context system feedback with recommendations.

Accomplishments:
✅ Code review of hosting refactor (Grade: A)
✅ Comprehensive feedback collection
✅ Created improvement recommendations document

Files Changed:
- context/context-feedback.md (+2,712 lines) - Feedback
- context/codex-improvement-proposal.md (+60 lines) - Analysis

Decisions:
- Hosting architecture validated (see DECISIONS.md #45)
- Context system improvements prioritized (see DECISIONS.md #46)

Status: ✅ Complete
Next: Review feedback, approve improvements, begin implementation

[... 4 more sessions ...]

─────────────────────────────────────────────
📖 Full history: context/SESSIONS.md
```

### Step 5: Handle Edge Cases

**If no sessions found:**
```
📖 Session History

❌ No session entries found in SESSIONS.md

Run /save-full to create your first comprehensive session entry.

💡 Tip: /save-full is for comprehensive documentation (use before
breaks/handoffs). For quick updates, use /save.
```

**If fewer sessions than requested:**
```
📖 Session History (Showing all 3 sessions, requested 5)

[... show all available sessions ...]
```

## Important Notes

### What This Command Shows

**TL;DR mode (default):**
- Session number, date, phase
- 2-3 sentence summary (from TL;DR section)
- Status (complete/in progress)
- Next priority

**Full mode (--full flag):**
- Everything from TL;DR mode
- Accomplishments list
- Files changed with line counts
- Key decisions made
- Blockers (if any)

### When to Use This Command

**Use /session-summary when:**
- ✅ Starting a new session (quick catch-up)
- ✅ Looking for when something was implemented
- ✅ Need to explain recent progress
- ✅ Reviewing before creating handoff documentation

**Don't use when:**
- ❌ Need full session details (read SESSIONS.md directly)
- ❌ Need to see code changes (use git log)
- ❌ Looking for specific decision rationale (use DECISIONS.md)

**Philosophy:** Quick navigation, not full documentation.

### Session History Best Practices

**For best results:**
1. Always include mandatory TL;DR in session entries (enforced by v2.1)
2. Make TL;DR 2-3 sentences: what + why + current state
3. Be specific in accomplishments (not "made progress")
4. Include file locations for resume context

**Good TL;DR examples:**
- ✅ "Implemented newsletter signup with rate limiting (10/hour). Chose Redis for distributed rate limiting across serverless functions. All tests passing, ready for production."
- ✅ "Fixed critical XSS vulnerability in contribution form by switching to parameterized queries. Validated fix with security tests. Deployed to staging for verification."

**Bad TL;DR examples:**
- ❌ "Made progress on the feature" (too vague)
- ❌ "Fixed some bugs and added tests" (not specific)
- ❌ "Worked on the project" (useless for context)

## Success Criteria

Command succeeds when:
- Session history displayed in clear, scannable format
- TL;DR summaries provide quick understanding
- User can navigate to specific sessions if needed
- Output fits in terminal without excessive scrolling
- Most recent sessions shown first (reverse chronological)

**Perfect execution:**
- Quick overview in <5 seconds
- Easy to scan and find relevant sessions
- Clear what was accomplished when
- Links to full documentation for details
