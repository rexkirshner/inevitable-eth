# Save Context Guide

Comprehensive guide for using `/save-context` to maintain perfect session continuity.

## Philosophy

Save-context is the **heartbeat** of the Claude Context System. It's what makes the Prime Directive possible:

> "I can end any session abruptly, start a new session days later, run /review-context, and continue exactly where I left off without any re-explanation or context loss."

Everything in the system exists to serve session continuity. Save-context is how we achieve it.

## The Safety Net Principle

**Core concept:** Better to save too often than lose context.

Think of save-context like saving a video game:
- You don't wait until you beat the boss to save
- You save before trying something risky
- You save after making progress
- You save when taking a break
- You definitely save before turning off the console

**Same applies here:**
- Save after completing work
- Save before taking breaks (even 5 minutes)
- Save before experiments
- Save at session end (always!)
- Save when switching tasks

**If you're unsure whether to save:** Save.

## When To Use This Command

### High-Priority Save Times

**Always save:**
- ✅ **At session end** - Non-negotiable, even if "nothing happened"
- ✅ **Before breaks** - Even 5-minute breaks, because sessions can end abruptly
- ✅ **After completing work** - Any significant accomplishment
- ✅ **After decisions** - Technical choices need to be documented
- ✅ **Before /code-review** - Capture state before quality audit

**Frequently save:**
- 🔄 **Every 30-60 minutes** - During active development
- 🔄 **When switching tasks** - Context switch = save point
- 🔄 **After discovering issues** - Don't lose the discovery
- 🔄 **Before experiments** - Save known-good state first

### Recommended Frequency

**Active development:** Every 30-60 minutes
**Major milestones:** Immediately after
**Session end:** Always, no exceptions
**Quick updates:** Use /quick-save-context (when available)

**Rule of thumb:** If it would take >5 minutes to re-explain what you did, save now.

## What Gets Captured

### Essential Captures

**Always captured:**
1. **Session activity** - What was done, in detail
2. **Files changed** - With line numbers for significant changes
3. **Decisions made** - With reasoning and alternatives
4. **Issues found** - New bugs, limitations, concerns
5. **Work in progress** - Exact state of incomplete work
6. **Next steps** - Immediate actions for next session

**File updates:**
- `SESSIONS.md` - Detailed session log (most important!)
- `CLAUDE.md` - Critical path, current status
- `PRD.md` - Progress log, phase status
- `DECISIONS.md` - New decisions (if any)
- `KNOWN_ISSUES.md` - New/fixed issues
- `next-steps.md` - Updated action items
- `todo.md` - Completed/new todos

### Optional Captures

**Only if changed:**
- `ARCHITECTURE.md` - Architectural changes (rare)
- `CODE_STYLE.md` - Style rule changes (very rare)

**Philosophy:** Update what changed, not everything.

## The Critical Importance of WIP

**Work In Progress capture is the most valuable part of save-context.**

### Why WIP Matters

When you return to a project:
- You've forgotten the mental model you had
- You don't remember what you were about to do next
- You can't recall why you chose a particular approach
- You've lost the context of the current task

**WIP capture solves this** by preserving:
- Exact task in progress when stopped
- Files being edited and line numbers
- Mental model / approach being used
- Next specific action to take
- Why you chose this approach

### Good WIP Examples

**Example 1: Mid-implementation**
```markdown
**Work In Progress:**
- Implementing JWT refresh logic in `lib/auth.ts`
- Currently at line 145, need to add refresh token validation
- Approach: Using jose library for JWT verification
- Next: Add refresh endpoint at `app/api/auth/refresh/route.ts`
- Mental model: Refresh tokens in httpOnly cookie, access tokens in memory
- Why this approach: More secure than localStorage, supports serverless
```

**Example 2: Debugging**
```markdown
**Work In Progress:**
- Debugging CORS error in production API
- Error occurs in `app/api/users/route.ts:23` when calling from frontend
- Hypothesis: Missing origin in middleware allowlist
- Tested locally: Works fine, issue is production-only
- Next: Check Vercel environment variables, verify ALLOWED_ORIGINS
- Files open: middleware.ts, .env.production, app/api/users/route.ts
```

**Example 3: Refactoring**
```markdown
**Work In Progress:**
- Refactoring Dashboard.tsx to reduce bundle size
- Completed: Extracted 3 components (lines 45-120)
- In progress: Moving data fetching to server component
- Currently at: Creating app/dashboard/ServerDashboard.tsx
- Next: Update imports in page.tsx, test data flow
- Goal: Reduce client bundle by ~50KB
- Challenge: Need to preserve real-time updates
```

### Bad WIP Examples

**Too vague:**
```markdown
**Work In Progress:**
- Working on authentication
- Need to finish it
```
*Problem:* Doesn't say what's incomplete, where to resume, or what approach was being used.

**Too brief:**
```markdown
**Work In Progress:**
- lib/auth.ts line 145
```
*Problem:* No context about what's being done or why.

**No next action:**
```markdown
**Work In Progress:**
- Was implementing refresh tokens
- Got stuck on validation
```
*Problem:* Doesn't say what to try next, what was already attempted.

### WIP Checklist

Good WIP capture includes:
- [ ] **File location** - Path and line number
- [ ] **Current task** - Specific, not vague
- [ ] **Approach** - The strategy being used
- [ ] **Next action** - Exact next step to take
- [ ] **Mental model** - How you're thinking about the problem
- [ ] **Why** - Reasoning behind approach (optional but helpful)

## Update Philosophy

### Be Thorough But Efficient

**Thorough means:**
- Capture all material changes
- Include enough detail for full understanding
- Don't skip important context
- Link related information

**Efficient means:**
- Don't update files that haven't changed
- Use git history to catch what you missed
- Focus on substance, not cosmetic changes
- Don't rewrite entire files, just update relevant sections

**Balance:** Capture everything important without wasting time on unchanged content.

### Think About The Reader

**Who's reading this?**
- Future Claude instances (most common)
- Future you, weeks later
- New contributors to project
- Other developers

**What do they need?**
- Full context to continue work
- Understanding of why decisions were made
- Clear picture of current state
- Ability to resume without re-explanation

**How to write for them:**
- Be specific, not vague
- Include file paths and line numbers
- Explain the "why" not just the "what"
- Make it scannable (use headings, bullets)
- Link related information

### Keep It Honest

**Document reality, not ideal:**
- Don't hide issues or technical debt
- Admit when something is hacky or temporary
- Note when you're uncertain
- Document the "why" behind weird decisions

**Examples of honest documentation:**

**Hacky solution:**
```markdown
**Decisions Made:**
- Using setTimeout for form validation (TEMPORARY)
- This is a hack - proper solution is debounced validation
- Reason: Ran into race condition with React state
- TODO: Refactor to use proper debouncing (next session)
```

**Uncertainty:**
```markdown
**Issues Discovered:**
- API sometimes returns 500 on user creation
- Not sure if it's rate limiting or database issue
- Workaround: Retry logic added
- Need to investigate server logs in next session
```

**Technical debt:**
```markdown
**Accomplishments:**
- ✅ Implemented user search
- Note: Uses client-side filtering (< 1000 users works fine)
- Will need server-side search when user count grows
- Acceptable tech debt for MVP
```

### Maintain Narrative

Documentation should tell a coherent story over time.

**Connect the dots:**
- Decisions lead to implementations
- Implementations reveal issues
- Issues lead to new decisions
- Progress builds over sessions

**Link related information:**
```markdown
**Decisions Made:**
- Chose Prisma over raw SQL (see DECISIONS.md entry "Database ORM Choice")

**Accomplishments:**
- ✅ Implemented Prisma schema (based on decision in Session 8)
- ✅ Created initial migration

**Issues Discovered:**
- Prisma generates large bundle size (mentioned in KNOWN_ISSUES.md)

**Next Steps:**
- Consider Prisma Data Proxy for edge deployment (relates to bundle issue)
```

**Show progression:**
- Session 10: Decided on Prisma
- Session 11: Implemented schema
- Session 12: Discovered bundle size issue
- Session 13: Researching Data Proxy solution

## File-by-File Update Guide

### SESSIONS.md (MOST IMPORTANT)

**Always update, never skip.**

This is the single most important file for session continuity.

**Required sections:**
- Session number and date
- Duration
- Focus (main work area)
- Accomplishments (detailed)
- Files Modified/Created (with line numbers)
- Work In Progress (exact state)
- Next Steps (immediate actions)

**Optional but valuable:**
- Decisions Made (link to DECISIONS.md)
- Issues Discovered/Resolved
- Commands Run
- Notes (anything else relevant)

**How to auto-detect session number:**
```bash
LAST_SESSION=$(grep -c "^## Session" context/SESSIONS.md)
NEXT_SESSION=$((LAST_SESSION + 1))
```

**Quality checklist:**
- [ ] Detailed enough for full understanding
- [ ] Includes file paths and line numbers
- [ ] WIP section has exact resume point
- [ ] Next steps are specific and actionable
- [ ] Tells complete story of session

### CLAUDE.md

**Update sections:**

**Development Status:**
- Current phase/milestone
- Mark completed work ✅
- Update in-progress items

**Commands:**
- Add new npm scripts
- Update command descriptions if changed

**Architecture:**
- Add new patterns (if architectural changes)
- Update directory structure (if changed)
- Document new integrations

**Critical Path:**
- Add "Completed in Session [N]" section
- List key accomplishments with ✅
- Update "Key Files Modified/Created"
- Set current status

**Example:**
```markdown
## Critical Path

**Current Status:** Phase 2 - Feature Implementation (60% complete)

**Completed in Session 12:**
- ✅ Implemented user authentication system
- ✅ Added JWT token management
- ✅ Created login/logout flows

**Key Files Modified/Created:**
- `lib/auth.ts` - Authentication utilities
- `app/api/auth/route.ts` - Auth API endpoints
- `middleware.ts` - Auth middleware

**In Progress:**
- Refresh token logic (WIP at lib/auth.ts:145)

**Next Session:**
- Complete refresh endpoint
- Add auth tests
```

### PRD.md

**Update sections:**

**Current Status:**
- Version number (if milestone reached)
- Phase status

**Progress Log:**
```markdown
### YYYY-MM-DD - Session [N]
**[Phase Name] [Status]:**
- ✅ [Accomplishment 1]
- ✅ [Accomplishment 2]
- ✅ [Key decision made]
- 🎯 **Phase Status: 60% complete**
```

**Implementation Plan:**
- Mark completed phases ✅
- Update current phase progress
- Adjust timeline if needed

**Future Roadmap:**
- Move completed items from future to done
- Add new items discovered during session

### ARCHITECTURE.md

**Only update if architectural changes occurred.**

**When to update:**
- New patterns introduced
- System design changed
- New dependencies/integrations added
- Data flow modified

**What to document:**
- The new pattern/structure
- Why it was introduced
- How it fits into existing architecture
- Any trade-offs made

**When to skip:**
- No architectural changes this session
- Only implementation details changed
- Just adding more of existing patterns

**Can add note:** "No architectural changes in Session [N]"

### DECISIONS.md

**Only update if decisions were made.**

**What qualifies as a decision:**
- Technology choices (libraries, tools, services)
- Architectural patterns (how to structure code)
- Trade-offs (choosing between options)
- Process changes (workflow, conventions)

**What's NOT a decision:**
- Implementation details (how to write a specific function)
- Bug fixes (choosing to fix a bug isn't a decision)
- Following existing patterns (not a new decision)

**Format:**
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

**Example:**
```markdown
## JWT Library: jose vs jsonwebtoken - 2025-10-04

**Decision:** Use 'jose' library for JWT handling

**Context:** Need JWT verification for authentication. Two popular options: 'jose' (modern, Edge-compatible) and 'jsonwebtoken' (traditional, Node-only)

**Alternatives Considered:**
- jsonwebtoken - Battle-tested, 20K GitHub stars, but Node-only
- jose - Edge Runtime compatible, modern APIs, but newer

**Trade-offs:**
- Pros: Works on Edge Runtime, better TypeScript support, JOSE standard compliant
- Cons: Smaller community, newer (potential bugs), different API from jsonwebtoken

**When to Reconsider:**
- If we move away from Edge Runtime
- If jose library becomes unmaintained
- If we hit bugs that block development
```

### KNOWN_ISSUES.md

**Two types of updates:**

**1. Remove fixed issues:**
```bash
# Check git history for fixes
git log --oneline --since="1 week ago" | grep -i "fix"

# Remove from KNOWN_ISSUES.md
# Note in SESSIONS.md what was fixed
```

**2. Add new issues discovered:**
```markdown
## [Issue Title]

**Severity:** Blocking | Non-Critical | Minor

**Description:** What's wrong

**Impact:** What this affects

**Workaround:** Temporary solution (if any)

**Discovered:** YYYY-MM-DD Session [N]
```

**Severity guidelines:**
- **Blocking:** Prevents progress, must fix to continue
- **Non-Critical:** Causes problems but can work around
- **Minor:** Inconvenience, low priority

**Update priorities:**
- Move Blocking → Non-Critical if partial fix
- Add to Technical Debt section if deferred
- Remove entirely if fully fixed

### next-steps.md

**Four types of updates:**

**1. Mark completed actions:**
```markdown
- [✅] Implement authentication (completed Session 12)
```

**2. Add new immediate actions:**
- Based on current state
- Based on issues discovered
- Based on WIP

**3. Update blockers:**
- Add new blockers discovered
- Remove resolved blockers
- Update blocker status

**4. Refresh priorities:**
- Reorder based on current goals
- Add urgency markers if critical
- Remove obsolete items

**Keep it actionable:**
- Items should be specific, not vague
- Should be doable in 1-2 hours max
- Should have clear success criteria

### todo.md

**Simple updates:**
- Mark completed items ✅
- Add new items discovered
- Preserve incomplete items for next session

**Philosophy:** This is session-level todos, not project-level (that's next-steps.md)

### CODE_STYLE.md

**Rarely needs updates.**

**Only update when:**
- New patterns adopted project-wide
- Style rules changed
- Language-specific conventions added
- Team agreements made

**Most sessions:** Skip this file entirely.

## Cross-Check Consistency

After updating individual files, verify the documentation tells a coherent story.

### Consistency Checks

**Status alignment:**
- [ ] CLAUDE.md status == PRD.md status
- [ ] Both show same phase/percentage
- [ ] Completed work matches in both

**Decisions reflected:**
- [ ] DECISIONS.md choices appear in ARCHITECTURE.md
- [ ] Technical decisions mentioned in relevant files
- [ ] Reasoning is consistent

**Issues tracked:**
- [ ] KNOWN_ISSUES.md blockers mentioned in next-steps.md
- [ ] Fixed issues removed from KNOWN_ISSUES.md
- [ ] New issues added from session discoveries

**Session coherence:**
- [ ] SESSIONS.md entry matches actual work done
- [ ] Files listed as modified actually were
- [ ] Accomplishments align with git history

**All docs tell same story:**
- [ ] No contradictions between files
- [ ] Timeline makes sense
- [ ] Progression is logical

### If Inconsistencies Found

**Don't ignore them:**
1. Fix immediately
2. Document why inconsistency existed
3. Add to SESSIONS.md notes
4. Prevent recurrence (update save-context process if needed)

**Example fix:**
```markdown
**Notes:**
- Fixed inconsistency: CLAUDE.md showed Phase 2 at 80%, PRD.md showed 60%
- Cause: Forgot to update PRD.md in Session 11
- Correct status: 60% (PRD was right, CLAUDE was outdated)
- Updated CLAUDE.md to match
```

## Common Mistakes

### Mistake 1: Skipping WIP

**Symptom:** SESSIONS.md has accomplishments but no WIP section

**Impact:** Next session requires re-explanation of current state

**Fix:** Always include detailed WIP, even if session feels "complete"

### Mistake 2: Vague Descriptions

**Bad:**
```markdown
**Accomplishments:**
- Fixed authentication
- Updated API
- Added some tests
```

**Good:**
```markdown
**Accomplishments:**
- ✅ Fixed authentication bug where logout didn't clear session (lib/auth.ts:89)
- ✅ Updated API to return user role in /api/me response (app/api/me/route.ts:15)
- ✅ Added unit tests for token validation (lib/auth.test.ts:23-67, 5 test cases)
```

### Mistake 3: Forgetting Next Steps

**Symptom:** SESSIONS.md has no "Next Steps" section

**Impact:** Next session starts with "what should I do next?"

**Fix:** Always include 2-5 specific next actions

### Mistake 4: Not Checking Consistency

**Symptom:** CLAUDE.md says Phase 2 complete, PRD.md says Phase 1

**Impact:** Confusion, contradictory information

**Fix:** Run consistency checks before finishing save-context

### Mistake 5: Hiding Problems

**Bad:**
```markdown
**Accomplishments:**
- ✅ Implemented user search
```

**Good:**
```markdown
**Accomplishments:**
- ✅ Implemented user search (client-side only, works for <1000 users)

**Technical Debt Added:**
- User search uses client-side filtering
- Will need server-side search at scale
- Acceptable for MVP, flagged for future refactor
```

## Time Investment

**Typical times:**
- **Routine update:** 30-60 seconds
- **Session end:** 2-3 minutes
- **Complex multi-feature session:** 5 minutes

**Worth every second:** Saves hours of re-explanation later.

**Time breakdown:**
- 30% - Analyzing changes (git diff, file changes)
- 40% - Writing SESSIONS.md entry
- 20% - Updating other files (CLAUDE.md, PRD.md, etc.)
- 10% - Consistency checks

## Success Criteria

Save-context succeeds when:

✅ All relevant files updated
✅ SESSIONS.md has complete, detailed entry
✅ WIP state preserved with exact resume point
✅ Consistency maintained across all docs
✅ Next session can resume seamlessly without re-explanation
✅ User knows exactly what was captured

**Perfect save:**
- Comprehensive session log
- Crystal-clear WIP state
- Specific next actions
- All inconsistencies resolved
- Future Claude can continue immediately

## Advanced Techniques

### Git Integration

**Use git to catch missed changes:**
```bash
# What changed since last save?
git diff HEAD~1..HEAD --name-only

# What was in last few commits?
git log --oneline -5 --stat

# Who changed this file recently?
git log --oneline -10 -- path/to/file.ts
```

**Helps with:**
- Remembering what files changed
- Catching changes you forgot
- Understanding commit history

### Session Markers

**Add markers for easy navigation:**
```markdown
## Session 12 - 2025-10-04 🔥 MAJOR MILESTONE
## Session 13 - 2025-10-05 🐛 DEBUGGING SESSION
## Session 14 - 2025-10-06 ♻️ REFACTORING
## Session 15 - 2025-10-07 ✨ NEW FEATURE
```

**Benefits:**
- Easy to scan session history
- Visual categorization
- Quick identification of important sessions

### Diff-Based Updates

**When many files changed:**
```bash
# Generate diff summary
git diff --stat

# Use to guide updates
# Update only files with material changes
```

**Efficient for large sessions:**
- Don't manually check every file
- Let git tell you what changed
- Focus updates on significant changes

### Quick Save vs Full Save

**Quick save (if /quick-save-context available):**
- Updates SESSIONS.md and next-steps.md only
- Takes 10-15 seconds
- Good for mid-session checkpoints

**Full save (this command):**
- Updates all documentation files
- Takes 2-5 minutes
- Good for session end, major milestones

**Strategy:**
- Quick save every 15-30 minutes during active work
- Full save at session end or major checkpoints

## Error Recovery

### If Context Folder Missing

**Problem:** context/ doesn't exist

**Solution:**
```markdown
1. Automatically run /init-context first
2. Then proceed with save
3. Note in SESSIONS.md that context was recreated
```

**Report:**
```
⚠️ context/ folder not found
✅ Running /init-context to create structure...
✅ Context initialized
✅ Proceeding with save-context...
```

### If Can't Determine Changes

**Problem:** Unclear what changed

**Solution:**
1. Document uncertainty in SESSIONS.md
2. Add TODO markers
3. Request user clarification next session

**Example:**
```markdown
**Notes:**
- Unable to determine exact changes to API routes (git history unclear)
- TODO: User should verify API changes are documented correctly
- Captured what was visible in current state
```

### If Git Unavailable

**Problem:** Not a git repository or git not installed

**Solution:**
1. Use file system timestamps
2. Analyze file content directly
3. Note git history not available

**Example:**
```markdown
**Notes:**
- Git not available, using file timestamps
- Recent files: lib/auth.ts (modified 2 min ago), app/api/me/route.ts (modified 5 min ago)
- Changes documented based on file inspection
```

## Integration With Other Commands

### Before /code-review

**Always run save-context first:**
1. Captures current state
2. Provides baseline for review
3. Ensures review reflects latest code

**Workflow:**
```
1. Complete feature work
2. Run /save-context
3. Run /code-review
4. Review finds issues
5. Fix issues in new session
6. Run /save-context again
```

### After /init-context

**First save after initialization:**
- Documents initial project state
- Establishes Session 1 baseline
- Captures setup decisions

### With /review-context

**Save-context creates what review-context reads:**
- Better saves = better reviews
- Comprehensive SESSIONS.md = higher confidence scores
- Clear WIP = easier resumption

**Feedback loop:**
- Review-context reveals gaps in documentation
- Improve save-context process based on gaps
- Better saves lead to better reviews

## Summary

**Save-context is your safety net:**
- Run it frequently (every 30-60 minutes)
- Always at session end
- Before breaks and experiments
- After decisions and discoveries

**Key principles:**
- Better to save too often than lose context
- WIP capture is most valuable
- Be thorough but efficient
- Keep it honest
- Maintain narrative coherence

**Success means:**
- Next session resumes seamlessly
- No re-explanation needed
- Future Claude knows exactly what to do
- Full context preserved

**Perfect outcome:**
> "I can open a new session weeks later, run /review-context, and continue exactly where I left off with full understanding of the code, decisions, and current state."
