# Usage Examples

Real-world workflows showing how to use the Claude Context System in common scenarios.

## Overview

This guide demonstrates practical usage patterns for different situations. Each example shows:
- When to use which commands
- What to expect at each step
- Common pitfalls to avoid
- Success criteria

---

## Example 1: Daily Development Flow

**Scenario:** Active development on an existing project with context system already initialized.

### Morning: Session Start

```
1. Open project in Claude Code
2. Run: /review-context
```

**What happens:**
```
📋 Context Review Report

**Confidence Score: 95/100** - Perfect

✅ **Accurate Documentation:**
- CLAUDE.md - All current, verified
- SESSIONS.md - Last entry yesterday, complete WIP
- next-steps.md - 3 action items ready

**Last Session:** Session 23 - 2025-10-03
**Last Work:** Implementing user profile page (complete)
**Resume Point:** Start next feature from backlog

**Recommendation:** ✅ Ready to resume work immediately

**Next Steps from docs:**
1. Add user settings page
2. Implement account deletion flow
3. Add profile photo upload

Ready to continue?
```

**Your response:** "Yes, let's start with the user settings page"

### During Work: Frequent Checkpoints

**Every 30-60 minutes while coding:**

```
/quick-save-context
```

**What happens:**
```
✅ Quick checkpoint saved

Updated:
- SESSIONS.md - Added progress note
- next-steps.md - Marked settings page in progress

Time: ~5 seconds
```

**Why:** Lightweight safety net. If session crashes, you have recent checkpoint.

### After Completing Feature

```
/save-context
```

**What happens:**
```
✅ Context Updated

**Files Updated:**
- CLAUDE.md - Updated feature list, added settings page
- PRD.md - Marked feature complete in progress log
- SESSIONS.md - Complete session 24 entry with accomplishments
- next-steps.md - Settings page marked done, moved to next item

**Key Changes Captured:**
- Implemented user settings page (app/settings/page.tsx)
- Added settings API route (app/api/settings/route.ts)
- Created SettingsForm component (components/SettingsForm.tsx)
- Decided to use form validation library 'zod'

**Current Status:** User Management - 75% complete

**Next Session:** Implement account deletion flow
```

### End of Day: Session Close

```
/save-context
```

**Even if you just ran it 10 minutes ago.** Why? Ensures clean session boundary with proper WIP capture if needed.

**What happens:**
```
✅ Context Updated

**Work In Progress:**
- Started account deletion flow
- Currently at: app/api/account/delete/route.ts:23
- Next: Add confirmation modal component
- Mental model: Two-step delete (email confirm + password verify)

**Next Session:** Complete deletion flow, test thoroughly
```

---

## Example 2: New Project Setup

**Scenario:** Just created a new Next.js app, want to add context system.

### Step 1: Get the System

```bash
# Clone repo
git clone https://github.com/rexkirshner/claude-context-system.git

# Copy commands to your project
cd my-new-project
mkdir -p .claude
cp -r ../claude-context-system/.claude/commands .claude/

# Clean up
rm -rf ../claude-context-system
```

### Step 2: Initialize in Claude Code

```
/init-context
```

**What happens:**
```
🎯 Initializing Claude Context System

**Step 1: Analyzing project...**
- Detected: Next.js 14 application
- Package manager: npm
- Found: package.json, src/, app/ directories

**Step 2: Creating context structure...**
✅ Created context/
✅ Created context/tasks/
✅ Created context/reviews/

**Step 3: Generating documentation...**
✅ CLAUDE.md (analyzed project structure)
✅ PRD.md (with project name from package.json)
✅ ARCHITECTURE.md (detected Next.js App Router)
✅ CODE_STYLE.md (with your workflow preferences)
✅ DECISIONS.md (empty, ready for decisions)
✅ KNOWN_ISSUES.md (empty, ready for issues)
✅ SESSIONS.md (Session 1 placeholder)
✅ next-steps.md (initial setup tasks)
✅ todo.md (empty, ready for tasks)

**Step 4: Configuration...**
✅ .context-config.json created

**✅ Initialization Complete!**

Next steps:
1. Review context/CLAUDE.md - verify project info
2. Review context/PRD.md - add project goals
3. Run /save-context to establish Session 1 baseline
```

### Step 3: Customize Documentation

Review and customize the generated files:
- Update project description in CLAUDE.md
- Add project goals to PRD.md
- Document initial architecture decisions

### Step 4: Establish Baseline

```
/save-context
```

**What happens:**
```
✅ Context Updated

**Session 1 Baseline Established**

This is your starting point. All future sessions build on this.

Ready to start coding!
```

---

## Example 3: After Long Break (2+ Weeks)

**Scenario:** You haven't touched a project in weeks, maybe months. Need to resume work.

### Step 1: Review Context

```
/review-context
```

**What happens:**
```
📋 Context Review Report

**Confidence Score: 72/100** - Adequate

✅ **Accurate Documentation:**
- CLAUDE.md - Current
- ARCHITECTURE.md - Matches code

⚠️ **Issues Found:**
- SESSIONS.md - Last entry 3 weeks old
- KNOWN_ISSUES.md - May have resolved issues not documented
- next-steps.md - Priorities may have shifted

**Last Session:** Session 15 - 2025-09-13
**Last Work:** Refactoring authentication system
**Resume Point:** WIP at lib/auth.ts:145 - token refresh logic

**Recommendation:** ⚠️ Review gaps before continuing

**Suggested Actions:**
1. Check git log for work since last session
2. Review current code state vs documented state
3. Update KNOWN_ISSUES.md if issues resolved
4. Run /save-context to update documentation
```

### Step 2: Investigate Gaps

```bash
# Check what happened since last session
git log --oneline --since="2025-09-13"

# Check current state
git status
git diff
```

**You discover:** 2 commits were made, authentication refactor was completed.

### Step 3: Update Documentation

```
/save-context
```

**In your message to Claude:**
"The authentication refactor was completed. Commits show token refresh logic was implemented and tested. Please update documentation to reflect this is done."

**What happens:**
```
✅ Context Updated

**Updated based on git history:**
- SESSIONS.md - Added retrospective entries for completed work
- KNOWN_ISSUES.md - Removed auth refresh limitation (now fixed)
- next-steps.md - Marked auth refactor complete
- PRD.md - Updated progress (Authentication: 100% complete)

**Current Status:** Ready for next feature

**Next Steps:**
1. Implement user profile management
2. Add email verification
```

### Step 4: Resume Fresh

Now run `/review-context` again:

```
📋 Context Review Report

**Confidence Score: 94/100** - Perfect

✅ Ready to resume work immediately

**Next Steps:**
1. Implement user profile management
2. Add email verification
```

**Key Lesson:** After long breaks, always:
1. Run /review-context first
2. Check git history for gap
3. Run /save-context to update
4. Then resume work

---

## Example 4: Team Handoff

**Scenario:** You need to hand off a project to another developer or Claude instance.

### Step 1: Ensure Documentation Current

```
/save-context
```

**Make sure everything is captured:**
- All recent work documented
- WIP state clear
- Known issues listed
- Next steps defined

### Step 2: Validate Quality

```
/validate-context
```

**What happens:**
```
📋 Context Validation Report

**Health Score: 95/100** - Excellent

✅ **Structure:**
- All required files present
- All sections complete

✅ **Content Quality:**
- No placeholders unfilled
- Consistent across docs

⚠️ **Minor Issues:**
- SESSIONS.md: 2 entries could be more detailed
- DECISIONS.md: 1 decision missing "when to reconsider"

**Recommendation:** ✅ Ready for handoff (minor issues non-blocking)
```

### Step 3: Export for Sharing

```
/export-context
```

**What happens:**
```
✅ Export Complete

**File created:** context-export-2025-10-04.md

**Contents:**
- Complete table of contents
- All context documentation in one file
- 2,450 lines total
- Easy to read and search

**Location:** Current directory

Share this file with:
- Team members
- Other Claude instances
- External reviewers
- Backup/archive
```

### Step 4: Handoff Message

**Send to new developer:**
```
Here's the project context export. To get started:

1. Read context-export-2025-10-04.md (or import to context/)
2. Run /review-context to verify
3. Start working - everything you need is documented

Current status: User auth complete, profile management in progress.
Next: Implement profile edit form (see next-steps.md)
```

**New developer:**
```
/review-context
```

**They get full context immediately. No 30-minute explanation call needed.**

---

## Example 5: Quality Check Workflow

**Scenario:** Feature complete, want thorough quality check before deployment.

### Step 1: Ensure Documentation Current

```
/save-context
```

**Critical:** Review must reflect current code state.

### Step 2: Run Validation

```
/validate-context
```

**What happens:**
```
📋 Context Validation Report

**Health Score: 92/100** - Excellent

✅ Documentation is current and complete

Minor suggestions:
- Add more details to 2 recent decisions
- Document workaround for known issue #3

**Recommendation:** ✅ Ready for code review
```

### Step 3: Comprehensive Code Review

```
/code-review
```

**What to expect:**
- This takes time (10-30 minutes depending on code size)
- Thorough analysis of all code
- No changes made (read-only review)

**What happens:**
```
🔍 Starting Code Review

This will be thorough and unhurried.
I will NOT make any changes during this review.
All issues found will be documented for fixing later.

[... comprehensive analysis ...]

✅ Code Review Complete

**Report saved to:** artifacts/code-reviews/session-24-review.md

**Summary:**
- Grade: B+
- Critical Issues: 0
- High Priority: 2
- Medium Priority: 5
- Low Priority: 8

**Top 3 Recommendations:**
1. Add input validation to user settings form (HIGH)
2. Optimize profile image loading (MEDIUM)
3. Add error boundary to settings page (MEDIUM)

**Next Steps:**
1. Review full report
2. Prioritize fixes
3. Address in new session (don't fix during review!)
```

### Step 4: Review Report

**Read:** `artifacts/code-reviews/session-24-review.md`

**Example issue from report:**
```markdown
### High Priority Issues

**H1: Missing input validation**
- Severity: High
- Location: components/SettingsForm.tsx:45-67
- Issue: Email field accepts any string without validation
- Impact: Invalid emails can be submitted
- Root Cause: Form validation library configured but not applied to this field
- Suggestion: Add zod email schema: z.string().email()
- Effort: 5 minutes
```

### Step 5: Fix in New Session

**Key principle:** Review finds problems, fixes happen separately.

```
Let's address the high priority issues from the review:
1. Add email validation to settings form
2. Optimize profile image loading

[work on fixes...]
```

### Step 6: After Fixes

```
/save-context
```

**Document what was fixed:**
```
Accomplishments:
- ✅ Fixed email validation (issue H1 from review)
- ✅ Optimized profile image loading (issue H2 from review)
```

---

## Example 6: Emergency Recovery

**Scenario:** Session crashed mid-work, unsaved changes lost.

### Step 1: Don't Panic

Your last `/save-context` or `/quick-save-context` preserved most work.

### Step 2: Review What Was Saved

```
/review-context
```

**What happens:**
```
📋 Context Review Report

**Confidence Score: 88/100** - Good

**Last Session:** Session 18 - 2025-10-04 14:35
**Last Work:** Implementing notification system

**Work In Progress:**
- Creating notification API route
- Currently at: app/api/notifications/route.ts:45
- Next: Add database schema for notifications
- Approach: Real-time updates via Server-Sent Events

**Files Modified (from last save):**
- app/api/notifications/route.ts (partial)
- lib/notifications.ts (helper functions)

**Likely Lost:**
- Any work after 14:35 (last quick-save)
- Estimate: 15-20 minutes of work
```

### Step 3: Check Git

```bash
git status
git diff
```

**See what's uncommitted.** May recover some work.

### Step 4: Resume From Last Known State

Start from the documented WIP point. You have:
- Exact file and line number
- The approach you were taking
- Next action to take

**This is why WIP capture is critical.**

### Step 5: Prevent Future Loss

**Going forward:**
- Run `/quick-save-context` every 15-30 minutes
- Run `/save-context` after any significant work
- Commit to git more frequently

**Remember:** Better to over-save than lose context.

---

## Example 7: Debugging Session

**Scenario:** Complex bug, need to track investigation and solution.

### Step 1: Document the Bug

**Before debugging, capture the issue:**

```
/save-context
```

**In message to Claude:**
"Found a bug: User profile images aren't loading on production. Works locally. Need to debug."

### Step 2: Investigation

**As you debug, track decisions:**

```
We've discovered:
1. Images load locally but not in production
2. Console shows CORS errors
3. Images are served from different origin in production

This is a CORS configuration issue.
```

### Step 3: Document Decision

**When you choose an approach:**

```
/save-context
```

**Captures in DECISIONS.md:**
```markdown
## Image CORS Configuration - 2025-10-04

**Decision:** Configure CORS headers on image CDN to allow our production domain

**Context:** Production images failing due to CORS. Localhost worked because same-origin.

**Alternatives Considered:**
- Serve images from same domain - Requires infrastructure change, slower
- Use proxy endpoint - Adds latency, wastes server resources
- Configure CDN CORS - Simple, performant, correct solution

**Trade-offs:**
- Pros: Fast, simple, follows best practices
- Cons: Requires CDN configuration access

**Implementation:** Added allowed origins to CDN config

**When to Reconsider:**
- If we change CDN providers
- If we need more complex access control
```

### Step 4: Capture Solution

```
/save-context
```

**Captures in SESSIONS.md:**
```markdown
**Accomplishments:**
- ✅ Debugged production image loading issue
- ✅ Root cause: CORS misconfiguration on CDN
- ✅ Solution: Added production domain to CDN allowed origins
- ✅ Verified fix in production

**Decisions Made:**
- CORS configuration approach (see DECISIONS.md)

**Issues Resolved:**
- Profile images not loading in production
```

**Value:** Next time a similar issue occurs, you have the investigation and solution documented.

---

## Example 8: Refactoring Project

**Scenario:** Major refactoring - moving from Pages Router to App Router in Next.js.

### Step 1: Document the Plan

```
/save-context
```

**Captures in DECISIONS.md:**
```markdown
## Migration to App Router - 2025-10-04

**Decision:** Migrate from Pages Router to App Router (Next.js)

**Context:** App Router offers better performance, streaming, and is the future of Next.js

**Approach:**
- Phase 1: Create parallel app/ directory
- Phase 2: Migrate routes one by one
- Phase 3: Remove pages/ directory
- Duration: ~2 weeks

**When to Reconsider:**
- If App Router has critical bugs
- If migration takes >1 month
```

### Step 2: Track Progress

**After each migration session:**

```
/save-context
```

**Captures:**
- Which routes migrated
- Patterns learned
- Issues encountered
- Remaining work

### Step 3: Multiple Sessions

**Session 25:**
```
Migrated: Home page, About page
Pattern: Using RSC for data fetching
Issue: Auth middleware needs updating
```

**Session 26:**
```
Migrated: Blog pages, Profile pages
Solved: Auth middleware working with App Router
Remaining: Admin pages, API routes
```

**Session 27:**
```
Migrated: All remaining pages
Removed: pages/ directory
Complete: App Router migration done
```

### Step 4: Retrospective

After completion, SESSIONS.md shows complete timeline:
- What was migrated when
- Problems encountered
- Solutions found
- Total effort

**Value:** Future migrations have a playbook.

---

## Example 9: Learning New Technology

**Scenario:** Adding Stripe payments to your app, first time using Stripe.

### Step 1: Document Initial State

```
/save-context
```

**Captures:**
```markdown
**Starting:** Stripe integration for payments
**Knowledge:** Never used Stripe before
**Goal:** Implement checkout flow
```

### Step 2: Track Learning

**As you learn, make decisions:**

```
Decided to use Stripe Checkout (hosted) instead of Elements (embedded)
- Simpler integration
- PCI compliance handled by Stripe
- Good enough for MVP

Documented in DECISIONS.md
```

### Step 3: Capture Patterns

**As you implement:**

```
/save-context
```

**Captures in ARCHITECTURE.md:**
```markdown
### Payment Flow

1. User clicks "Subscribe"
2. Frontend calls /api/checkout/session
3. Backend creates Stripe Checkout Session
4. User redirected to Stripe-hosted checkout
5. Webhook receives payment confirmation
6. Database updated with subscription status

**Key Files:**
- app/api/checkout/session/route.ts - Create checkout
- app/api/webhooks/stripe/route.ts - Handle events
- lib/stripe.ts - Stripe client configuration
```

### Step 4: Document Learnings

**Captures gotchas in KNOWN_ISSUES.md or CODE_STYLE.md:**

```markdown
## Stripe Integration Patterns

**Webhook signature verification:**
ALWAYS verify webhook signatures. Use raw body, not parsed JSON.

**Test mode:**
Use test API keys until thoroughly tested. Production keys only after testing.

**Idempotency:**
Include idempotency keys for payment operations.
```

**Value:** Next Stripe integration (or helping teammate) is much faster.

---

## Common Patterns

### The Save-Early-Save-Often Pattern

```
Morning:        /review-context
While coding:   /quick-save-context (every 30-60 min)
After feature:  /save-context
End of day:     /save-context (even if just ran it)
```

### The Quality-Check Pattern

```
Feature done:    /save-context
Validation:      /validate-context
Deep review:     /code-review
Fix issues:      (new session)
Final check:     /save-context
```

### The Handoff Pattern

```
Current state:   /save-context
Validate:        /validate-context
Export:          /export-context
Share:           Send export file + instructions
```

### The Resume-After-Break Pattern

```
Review:          /review-context
Check gaps:      git log, git status
Update:          /save-context (if needed)
Verify:          /review-context (again)
Resume:          Start working
```

---

## Anti-Patterns (Don't Do This)

### ❌ Never Saving

**Bad:**
```
Code for 8 hours straight
Never run /save-context
Session crashes
Lose everything
```

**Good:**
```
/quick-save-context every 30 minutes
/save-context after major milestones
Never lose >30 minutes of work
```

### ❌ Saving Without Context

**Bad:**
```
/save-context
"update stuff"
```

**Good:**
```
/save-context
"Implemented user authentication with JWT tokens.
Created login/logout flows, added middleware for protected routes.
Decided to use 'jose' library over 'jsonwebtoken' for Edge compatibility."
```

### ❌ Skipping Review on Resume

**Bad:**
```
Open project after 2 weeks
Start coding immediately
Waste time re-learning context
```

**Good:**
```
/review-context
Read last session notes
Check WIP state
Resume efficiently
```

### ❌ Making Changes During Code Review

**Bad:**
```
/code-review
"Let me fix this real quick"
(breaks review process, mixes concerns)
```

**Good:**
```
/code-review
Read full report
/save-context (to capture current state)
Fix issues in new focused session
```

---

## Success Metrics

**You're using the system well when:**

✅ New sessions start with `/review-context`
✅ You save context every 30-60 minutes (quick or full)
✅ Session ends always include `/save-context`
✅ You can resume after weeks with high confidence
✅ Team handoffs require minimal explanation
✅ Git history and SESSIONS.md tell same story
✅ WIP captures are detailed and actionable
✅ Code reviews are thorough because no time pressure
✅ Documentation drift is minimal (everything stays current)
✅ You rarely repeat explanations to Claude

**The ultimate test:**
> "I can end any session abruptly, start a new session days later, run /review-context, and continue exactly where I left off without any re-explanation or context loss."

When this is true, you've mastered the system.

---

## Tips & Tricks

### Tip 1: Use Quick-Save for Active Work

Don't let `/save-context` feel heavy. Use `/quick-save-context` frequently during active coding. Full save at natural breakpoints.

### Tip 2: Descriptive Session Messages

When running `/save-context`, give Claude context:
- What you accomplished
- What decisions you made
- What you're about to start
- Any blockers or issues

### Tip 3: WIP is King

The most valuable part of `/save-context` is **Work In Progress** capture:
- Exact file and line number
- What you were doing
- Why you chose this approach
- What's next

### Tip 4: Review Before Major Decisions

Before architectural decisions, run `/review-context` to understand current state and past decisions.

### Tip 5: Validate Before Sharing

Always `/validate-context` before:
- Team handoffs
- Client demos
- Deployment
- Long breaks

### Tip 6: Commit After Save

Good pattern:
```
/save-context
git add .
git commit -m "Implemented feature X"
```

Git and context docs stay in sync.

### Tip 7: Use Code Review for Learning

Run `/code-review` on completed features to learn:
- What you could improve
- Patterns to adopt
- Anti-patterns to avoid

---

## Troubleshooting

### "Context feels stale"

**Solution:**
```
/save-context
```

Run it. Even if you think nothing changed.

### "Can't resume after long break"

**Solution:**
```
/review-context
git log --since="[last session date]"
/save-context (fill in gaps)
/review-context (verify)
```

### "Lost work to session crash"

**Solution:**
Check last `/quick-save-context` time. Resume from there.

**Prevention:**
More frequent quick-saves (every 15-30 min).

### "Documentation contradicts code"

**Solution:**
```
/save-context
```

Tell Claude what actually happened. It will update docs to match reality.

---

## Conclusion

The Claude Context System works best when:
- You save early and often
- You review at session start
- You capture detailed WIP
- You separate review from fixes
- You trust the process

**Remember:** The system is your safety net. Use it freely. Over-saving is impossible. Under-saving is risky.

Happy coding! 🚀
