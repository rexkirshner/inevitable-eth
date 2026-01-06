# Command Philosophy

Core principles that guide all AI Context System commands.

## The Prime Directive: Session Continuity

> "I can end any session abruptly, start a new session days later, run /review-context, and continue exactly where I left off without any re-explanation or context loss."

Everything exists to serve this goal.

## Core Principles

### 1. Simplicity First

**Make every command and code change as simple as possible.**

- Prefer simple solutions over complex ones
- Minimal code impact per change
- Avoid massive or complex changes
- Every change should impact as little as possible

**Applied to commands:**
- Clear, linear execution steps
- No complex logic unless absolutely necessary
- Bash scripts over intricate awk/sed when possible

### 2. User Approval for Destructive Actions

**NEVER push to GitHub without explicit approval.**

**Critical Distinction: Commit ≠ Push**

Git operations are DISTINCT and require SEPARATE approval:
- `git add` → Staging (reversible)
- `git commit` → Local history (reversible with reset)
- `git push` → **PUBLICATION** (visible to others, permanent)

**When user says "commit", do ONLY commit:**
```
User: "ok, let's commit to git"
✅ CORRECT: Stage files, commit locally, STOP and report
❌ WRONG: Stage files, commit locally, push to GitHub
```

**Push requires EXPLICIT approval phrases:**
- "push to github"
- "push to origin"
- "push everything"
- "publish changes"
- "commit and push"

**Push permission NEVER carries forward:**
```
Session start:
User: "commit and push to github"
→ OK to push THIS commit

Later in same session:
User: "ok let's commit these changes"
→ NOT OK to push (only commit)
→ Permission does NOT carry forward
→ EACH push requires NEW approval
```

**Why this matters:**
- Commit = safe, local, reversible
- Push = public, permanent, affects team
- User may want to review/amend before pushing
- Violating this breaks user trust and control

**Commands that modify code, delete files, or push to remote:**
- Must ask user first
- Clear about what will change
- Provide preview when possible
- Wait for explicit approval
- NEVER assume permission carries forward

### 3. Context Folder Detection (v3.0.0+)

**Commands must work from subdirectories.**

**Real-world issue:** Users run commands from `backend/`, `frontend/`, `src/` directories
**Solution:** Find context folder automatically (up to 2 parent directories)

**Pattern for all commands:**

```bash
# Step 1: Find Context Folder (add to ALL commands)
source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
CONTEXT_DIR=$(find_context_folder) || exit 1

# Then use $CONTEXT_DIR throughout the command instead of hardcoded "context/"
cat "$CONTEXT_DIR/STATUS.md"
echo "Content" >> "$CONTEXT_DIR/SESSIONS.md"
```

**Why this matters:**
- Users work in subdirectories (`cd backend && /save`)
- Old behavior: "context/ not found" error
- New behavior: Searches `./context`, `../context`, `../../context`
- Validates with `.context-config.json` check
- Clear error if truly not found

**Commands updated:** /save, /save-full, /review-context, /init-context (others in progress)

### 4. Command Syntax Limitations (Claude Code Platform)

**Commands with `$(...)` may fail when executed via SlashCommand tool.**

**Real-world issue:** Commands containing command substitution syntax (`$(...)`) can fail with parse errors when executed through Claude Code's SlashCommand tool.

**Examples that may fail:**
```bash
# Command substitution in variable assignment
MV_CMD=$(which git)

# Command substitution in conditionals
if [ "$(git status)" ]; then

# Command substitution in strings
git commit -m "$(cat <<'EOF'
Message here
EOF
)"
```

**Workaround options:**

1. **Execute manually using Bash tool** (most reliable):
   - AI assistant reads the command file
   - Executes bash commands directly using Bash tool
   - No SlashCommand parsing involved

2. **Rewrite to avoid command substitution** (if possible):
   ```bash
   # Before (may fail)
   DEST_DIR=$(dirname "$dest")

   # After (works)
   DEST_DIR="${dest%/*}"
   ```

3. **Use heredocs without command substitution**:
   ```bash
   # Avoid $(cat <<'EOF') pattern
   # Instead use heredoc directly in git commit
   ```

**Why this matters:**
- SlashCommand has parsing limitations we cannot control
- Manual execution via Bash tool always works
- Commands should document if they require manual execution
- Not a bug in our system - it's a Claude Code platform limitation

**Commands affected:** /organize-docs (Step 5 safe_move function)

### 5. No Broken Promises

**Only promise what we actually deliver.**

v1.4.0 removed JSON artifacts because:
- Promised "fast agent loading"
- Never implemented the loading
- Feature added complexity without value

**Lesson:** Don't implement speculative features. Deliver what works.

### 6. Honesty About Enforcement

**Be clear about what's enforced vs. what's just reference.**

- `preference-catalog.yaml` - Reference only
- `CLAUDE.template.md` - Actual source of truth
- `.context-config.json` - Partially enforced

If a file isn't used by commands, say so clearly.

### 7. Separation of Concerns

**Commands DO, documentation EXPLAINS.**

- Commands: Execution steps
- Docs: Why, when, how, philosophy
- Checklists: Specialized audit criteria

This separation keeps commands scannable.

### 8. Capture Everything, Lose Nothing

**When in doubt, save it.**

/save-context should be:
- Run frequently (every 30-60 minutes)
- Before breaks (even 5-minute ones)
- At session end (always!)
- After decisions
- When switching tasks

Better to over-save than lose context.

### 9. Thoroughness When Time Permits

**/code-review takes its time.**

- No rushing
- No time pressure
- Comprehensive analysis
- "Only when you have plenty of time"

Quality commands need time to be thorough.

### 10. Fast Paths for Common Cases

**/quick-save-context for active work.**

- 5-second checkpoint
- Updates SESSIONS.md and tasks/ only
- Run every 15-30 minutes
- Lightweight alternative to full save

Frequent saves shouldn't be painful.

## The "No Changes" Rule

**Code review NEVER makes changes.**

Why this rule exists:
- Past experience: changes during review broke things
- Time pressure leads to hasty fixes
- Review and fix are different mindsets
- Analysis requires different pace than implementation

**Temptations to resist:**
- "This is a quick fix" - NO, document it
- "Just renaming a variable" - NO, document it
- "One-line change" - NO, document it

**What to do instead:**
- Document the issue thoroughly
- Explain how to fix it
- Note effort required
- Let user decide when to fix

## Documentation Philosophy

### Templates as Source of Truth

Templates propagate improvements across all projects.

- `CLAUDE.template.md` - Communication style, workflow
- `CODE_STYLE.template.md` - Development principles
- `ARCHITECTURE.template.md` - Design patterns

Update template → all projects get improvement via `/update-context-system`

### Markdown Over JSON

Markdown is:
- Human-readable
- Git-friendly
- Easy to edit
- Sufficient for context loading

JSON artifacts were removed because they didn't deliver value.

### Cross-Document Consistency

Documentation must tell coherent story:
- CLAUDE.md status == PRD.md status
- DECISIONS.md choices reflected in ARCHITECTURE.md
- KNOWN_ISSUES.md blockers mentioned in next-steps.md
- SESSIONS.md entry matches actual work done

Commands check for inconsistencies.

## Error Handling Philosophy

### Fail Clearly, Never Silently

When something goes wrong:
- Report what failed clearly
- Show what was successfully created
- Provide manual recovery steps
- Never leave partial state

### Provide Escape Hatches

- `/init-context` checks if context/ exists, warns before reinitializing
- `/update-context-system` compares versions, exits if already current
- `/validate-context` reports confidence score, recommends /save-context if low

### Trust but Verify

/review-context approach:
- Trust docs when recent (<48 hours)
- Verify against code when older
- Check for contradictions
- Report confidence score

## Success Metrics

### Perfect Outcome

**For /save-context:**
- All relevant files updated
- SESSIONS.md has complete entry
- WIP state preserved
- Consistency maintained
- Next session can resume seamlessly

**For /review-context:**
- Score 90-100
- Can state exact resume point
- Understand full context
- Ready to continue seamlessly

**For /code-review:**
- Thorough and unhurried
- Issues with root causes
- Clear fix suggestions
- Zero code changes
- Maintainable codebase as result

### Good Enough

Don't let perfect be the enemy of good:
- /save-context with minor gaps is better than no save
- /review-context score 75+ is usable
- /validate-context warnings are non-critical

## Anti-Patterns to Avoid

### Communication Anti-Patterns

- ❌ Verbose explanations unless requested
- ❌ Preamble like "I'll help you..."
- ❌ Postamble like "In summary..."
- ❌ Making assumptions about user intent
- ❌ Using emojis unless explicitly requested

### Technical Anti-Patterns

- ❌ Pushing to GitHub without explicit approval
- ❌ Complex changes when simple ones work
- ❌ Temporary fixes instead of root cause solutions
- ❌ Lazy coding or shortcuts
- ❌ Making assumptions during debugging
- ❌ Implementing speculative features

### Documentation Anti-Patterns

- ❌ Stale documentation (update or delete it)
- ❌ Contradictions between files
- ❌ Unfilled placeholders left indefinitely
- ❌ Broken promises (JSON artifacts)
- ❌ Files that claim to be enforced but aren't

## Evolution

This system evolves based on real usage:

**v1.0.0** - Initial release with 4 commands
**v1.3.0** - General-purpose template sync
**v1.4.0** - Removed JSON artifacts (honesty > promises)
**v1.5.0** - Extracted docs from commands (simplicity)

**Lesson:** Ship, learn, refine. Don't over-engineer upfront.
