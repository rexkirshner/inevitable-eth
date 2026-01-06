# Session History

**Structured, comprehensive history** - for AI agent review and takeover. Append-only.

**For current status:** See `STATUS.md` (single source of truth)
**For quick reference:** See Quick Reference section in `STATUS.md` (auto-generated)

---

## Session [N] | [YYYY-MM-DD] | [Phase Name]

**Duration:** [X]h | **Focus:** [Brief description] | **Status:** ✅ Complete / ⏳ In Progress

### TL;DR
**MANDATORY - 2-3 sentences summarizing what was accomplished this session**

[2-3 sentences: what was accomplished, key decisions made, current state]

### Accomplishments

- ✅ [Key accomplishment 1 with context]
- ✅ [Key accomplishment 2 with context]
- ✅ [Key accomplishment 3 with context]

### Problem Solved

**Issue:** [What problem did this session address?]

**Constraints:** [What limitations existed?]
- [Constraint 1]
- [Constraint 2]

**Approach:** [How did you solve it? What was your thinking?]

**Why this approach:** [Rationale for the chosen solution]

### Decisions

- **[Decision topic]:** [What and why] → See DECISIONS.md [ID]
- **[Decision topic]:** [What and why]

### Files

**NEW:**
- `path/to/file.ts:1-150` - [Purpose and key contents]

**MOD:**
- `path/to/file.tsx:123-145` - [What changed and why]
- `path/to/config.json` - [What changed]

**DEL:**
- `path/to/old-file.ts` - [Why removed and what replaced it]

### Mental Models

**Current understanding:**
[Explain your mental model of the system/feature you're working on]

**Key insights:**
- [Insight 1 that AI agents should know]
- [Insight 2]

**Gotchas discovered:**
- [Gotcha 1 - thing that wasn't obvious]
- [Gotcha 2]

### Work In Progress

**Task:** [What's incomplete - be specific]
**Location:** `file.ts:145` in `functionName()`
**Current approach:** [Detailed mental model of what you're doing]
**Why this approach:** [Rationale]
**Next specific action:** [Exact next step]
**Context needed:** [What you need to remember to resume]

### TodoWrite State

**Captured from TodoWrite:**
- [Completed todo 1]
- [Completed todo 2]
- [ ] [Incomplete todo - in WIP]

### Next Session

**Priority:** [Most important next action]
**Blockers:** [None / List blockers with details]
**Questions:** [Open questions for next session]

### Git Operations
**MANDATORY - Auto-logged from conversation**

- **Commits:** [N] commits
- **Pushed:** [YES | NO | USER WILL PUSH]
- **Approval:** ["Exact user quote approving push" | "Not pushed"]

### Tests & Build

- **Tests:** [X/Y passing | All passing | Not run]
- **Build:** [Success | Failure | Not run]
- **Coverage:** [N% | Not measured]

---

## Example: Initial Session

Here's what your first session entry might look like after running `/init-context` and `/save`:

## Session 1 | 2025-10-09 | Project Initialization

**Duration:** 0.5h | **Focus:** Setup AI Context System v2.1 | **Status:** ✅ Complete

### TL;DR

Initialized AI Context System with CLAUDE.md at project root + 5 core files in context/. System ready for minimal-overhead documentation during development with comprehensive save points before breaks.

### Changed

- ✅ Initialized AI Context System v2.1
- ✅ Created CLAUDE.md at project root + 5 core files in context/ (CONTEXT, STATUS, DECISIONS, SESSIONS)
- ✅ Configured .context-config.json with version 2.1.0

### Decisions

- **Documentation System:** Chose AI Context System v2.1 for session continuity and AI agent handoffs
- **File Structure:** Using v2.1 structure with STATUS.md as single source of truth (includes auto-generated Quick Reference)

### Files

**NEW:**
- `CLAUDE.md` - AI entry point (auto-loaded by Claude Code, at project root)
- `context/CONTEXT.md` - Project orientation (platform-neutral)
- `context/STATUS.md` - Single source of truth with auto-generated Quick Reference section
- `context/DECISIONS.md` - Decision log with rationale
- `context/SESSIONS.md` - This file (structured session history)
- `context/.context-config.json` - System configuration v2.1.0

### Next Session

**Priority:** Begin development work with context system in place
**Blockers:** None
**Questions:** None - system ready to use

---

## Session Template

```markdown
## Session [N] | [YYYY-MM-DD] | [Phase Name]

**Duration:** [X]h | **Focus:** [Brief] | **Status:** ✅/⏳

### TL;DR
[MANDATORY - 2-3 sentences summary]

### Accomplishments
- ✅ [Accomplishment 1]
- ✅ [Accomplishment 2]

### Decisions
- **[Topic]:** [Decision and why] → See DECISIONS.md [ID]

### Files
**NEW:** `file` (+N lines) - [Purpose]
**MOD:** `file:lines` (+N, -M) - [What changed]
**DEL:** `file` - [Why removed]

### Work In Progress
**Task:** [What's incomplete]
**Location:** `file:line`
**Approach:** [How you're solving it]
**Next:** [Exact action to resume]

### Next Session
**Priority:** [Most important next]
**Blockers:** [None / List]

### Git Operations
**MANDATORY - Auto-logged**
- **Commits:** [N] commits
- **Pushed:** [YES | NO | USER WILL PUSH]
- **Approval:** ["User quote" | "Not pushed"]

### Tests & Build
- **Tests:** [Status]
- **Build:** [Status]
```

---

## Session Index

Quick navigation to specific work.

| # | Date | Phase | Focus | Status |
|---|------|-------|-------|--------|
| 1 | YYYY-MM-DD | Phase | [Brief] | ✅ |
| 2 | YYYY-MM-DD | Phase | [Brief] | ✅ |
| N | YYYY-MM-DD | Phase | [Brief] | ⏳ |

---

## Tips

**For AI Agent Review & Takeover:**
- **Mental models are critical** - AI needs to understand your thinking
- **Capture constraints** - AI should know what limitations existed
- **Explain rationale** - WHY you chose this approach
- **Document gotchas** - Save AI from discovering the same issues
- **Show problem-solving** - AI learns from your approach

**Be structured AND comprehensive:**
- Use structured format (scannable sections)
- But include depth (mental models, rationale, constraints)
- 40-60 lines per session is appropriate for AI understanding
- Structured ≠ minimal. AI needs context.

**Key sections for AI:**
1. **Problem Solved** - What issue existed, constraints, approach
2. **Mental Models** - Your understanding of the system
3. **Decisions** - Link to DECISIONS.md for full rationale
4. **Work In Progress** - Detailed enough for takeover
5. **TodoWrite State** - What was accomplished vs. pending
