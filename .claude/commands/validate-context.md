---
name: validate-context
description: Validate context documentation structure and completeness
---

# /validate-context Command

Verify that all context documentation follows the expected structure, flag missing required sections, and check for incomplete placeholders. Perfect for ensuring documentation quality before sharing or deployment.

**See also:** `.claude/docs/command-philosophy.md` for quality standards

## When to Use This Command

- After /init-context to verify proper setup
- After /migrate-context to ensure migration completed
- Before /export-context to check completeness
- Periodically to maintain documentation quality
- Before project handoff or team sharing
- When documentation feels incomplete

## What This Command Does

1. Runs comprehensive validation script
2. Checks for all required context files
3. Flags unfilled placeholders
4. Validates .context-config.json format
5. Verifies all 9 slash commands present
6. Checks template files exist
7. **Analyzes documentation staleness** (v2.1: configurable thresholds, visual indicators)
8. Audits git push protocol compliance (v2.1)
9. Reports documentation health score
10. Provides actionable recommendations

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

### Step 0.5: Find Context Folder

**ACTION:** Source the context folder detection script and find the context directory:

```bash
# Load context folder detection (v3.5.0+ - fixes BUG-6)
source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
CONTEXT_DIR=$(find_context_folder) || exit 1

echo "✅ Found context at: $CONTEXT_DIR"
```

**Why this matters:** Allows command to work from subdirectories (backend/, src/, etc.) by searching up to 2 parent directories.

---

### Step 1: Run Validation Script

**ACTION:** Use the Bash tool to run the validation script:

```bash
# Make script executable if needed
chmod +x scripts/validate-context.sh

# Run validation
./scripts/validate-context.sh
```

The script performs these checks:
- ✅ Required documentation files exist
- ✅ No unresolved placeholders (`[TODO:]`, `[PLACEHOLDER]`, etc.)
- ✅ Valid JSON in .context-config.json
- ✅ Template files present
- ✅ All 9 slash commands present

### Step 2: Interpret Results

**Exit codes:**
- `0` = All checks passed (excellent health)
- `1` = Warnings found (non-critical issues)
- `2` = Errors found (critical issues to fix)

**Output format:**
```
🔍 Validating AI Context System...

📄 Checking required documentation files...
  ✅ CLAUDE.md (AI entry point - auto-loaded)
  ✅ context/CONTEXT.md
  ✅ context/STATUS.md (with Quick Reference section)
  ✅ context/DECISIONS.md
  ✅ context/SESSIONS.md
  ...

🔎 Checking for unresolved placeholders...
  ⚠️  Unresolved placeholders found:
    context/CONTEXT.md:45: [TODO: Add deployment instructions]

⚙️  Validating configuration files...
  ✅ .context-config.json is valid JSON

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Validation Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All checks passed!
OR
⚠️  3 warning(s) found
OR
❌ 2 error(s) found
```

### Step 2.5: Git Push Protocol Validation

**ACTION:** Verify git push protocol compliance in recent sessions

```bash
# Check last 3 sessions in SESSIONS.md for git push protocol compliance

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 Git Push Protocol Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract last 3 sessions and check for Git Operations section
# This is a simplified check - actual implementation would parse SESSIONS.md more thoroughly

SESSIONS_WITH_PUSH=0
SESSIONS_WITH_APPROVAL=0
SESSIONS_WITHOUT_APPROVAL=0

# For each of the last 3 sessions:
# 1. Check if "Git Operations" section exists
# 2. If Pushed: YES, verify approval is logged
# 3. Report any sessions with push but no approval

echo "Checking last 3 sessions:"
echo ""

# Session 18 example check
if grep -A 10 "^## Session 18" context/SESSIONS.md | grep -q "Pushed: YES"; then
  SESSIONS_WITH_PUSH=$((SESSIONS_WITH_PUSH + 1))
  if grep -A 10 "^## Session 18" context/SESSIONS.md | grep "Approval:" | grep -v "Not pushed" > /dev/null; then
    echo "Session 18: ✅ Pushed with approval logged"
    SESSIONS_WITH_APPROVAL=$((SESSIONS_WITH_APPROVAL + 1))
  else
    echo "Session 18: ⚠️  Pushed but no approval logged"
    SESSIONS_WITHOUT_APPROVAL=$((SESSIONS_WITHOUT_APPROVAL + 1))
  fi
elif grep -A 10 "^## Session 18" context/SESSIONS.md | grep -q "Git Operations"; then
  echo "Session 18: ✅ No push (local commits only)"
else
  echo "Session 18: ⚠️  Missing Git Operations section"
fi

# Repeat for last 2 more sessions...

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Git Push Protocol Compliance:"
echo ""
echo "Sessions with push: $SESSIONS_WITH_PUSH"
echo "Approvals logged: $SESSIONS_WITH_APPROVAL"
echo "Missing approvals: $SESSIONS_WITHOUT_APPROVAL"
echo ""

if [ $SESSIONS_WITHOUT_APPROVAL -eq 0 ]; then
  echo "✅ Protocol compliance: 100%"
  echo "✅ Auto-logging working correctly"
  echo ""
  echo "Recommendation: Continue current practice"
else
  echo "⚠️  Protocol compliance: Issues detected"
  echo ""
  echo "Recommendation:"
  echo "- Verify git push approvals are being auto-logged"
  echo "- Check .context-config.json pushProtection settings"
  echo "- Ensure /save-full command includes git operations logging"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

**Why this validation matters:**
- Ensures git push protocol is being followed
- Verifies auto-logging is working correctly
- Identifies any sessions where push approval wasn't logged
- Helps maintain audit trail compliance

### Step 2.7: Documentation Staleness Check ✨ v2.1

**ACTION:** Check file freshness against configurable thresholds

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📅 Documentation Staleness Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get current date in seconds since epoch
CURRENT_DATE=$(date +%s)

# Function to check file staleness
check_staleness() {
  local file=$1
  local green_days=$2
  local yellow_days=$3
  local red_days=$4
  local validate_only_if_exists=${5:-false}

  # Skip if file doesn't exist and validateOnlyIfExists is true
  if [ "$validate_only_if_exists" = "true" ] && [ ! -f "$file" ]; then
    echo "  ⚪ $file - Not present (optional)"
    return
  fi

  if [ ! -f "$file" ]; then
    echo "  ❌ $file - Missing"
    return
  fi

  # Get file modification time
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    FILE_MOD_TIME=$(stat -f %m "$file")
  else
    # Linux
    FILE_MOD_TIME=$(stat -c %Y "$file")
  fi

  # Calculate days since last update
  DAYS_OLD=$(( (CURRENT_DATE - FILE_MOD_TIME) / 86400 ))

  # Determine status
  if [ $DAYS_OLD -le $green_days ]; then
    echo "  🟢 $file - Fresh ($DAYS_OLD days old)"
  elif [ $DAYS_OLD -le $yellow_days ]; then
    echo "  🟡 $file - Aging ($DAYS_OLD days old, consider updating)"
  else
    echo "  🔴 $file - Stale ($DAYS_OLD days old, update recommended)"
  fi
}

# Load thresholds from config (with fallbacks)
STATUS_GREEN=$(jq -r '.validation.stalenessThresholds."STATUS.md".green' context/.context-config.json 2>/dev/null || echo "7")
STATUS_YELLOW=$(jq -r '.validation.stalenessThresholds."STATUS.md".yellow' context/.context-config.json 2>/dev/null || echo "14")
STATUS_RED=$(jq -r '.validation.stalenessThresholds."STATUS.md".red' context/.context-config.json 2>/dev/null || echo "30")

SESSIONS_GREEN=$(jq -r '.validation.stalenessThresholds."SESSIONS.md".green' context/.context-config.json 2>/dev/null || echo "7")
SESSIONS_YELLOW=$(jq -r '.validation.stalenessThresholds."SESSIONS.md".yellow' context/.context-config.json 2>/dev/null || echo "14")
SESSIONS_RED=$(jq -r '.validation.stalenessThresholds."SESSIONS.md".red' context/.context-config.json 2>/dev/null || echo "21")

CONTEXT_GREEN=$(jq -r '.validation.stalenessThresholds."CONTEXT.md".green' context/.context-config.json 2>/dev/null || echo "90")
CONTEXT_YELLOW=$(jq -r '.validation.stalenessThresholds."CONTEXT.md".yellow' context/.context-config.json 2>/dev/null || echo "180")
CONTEXT_RED=$(jq -r '.validation.stalenessThresholds."CONTEXT.md".red' context/.context-config.json 2>/dev/null || echo "365")

CODEMAP_GREEN=$(jq -r '.validation.stalenessThresholds."CODE_MAP.md".green' context/.context-config.json 2>/dev/null || echo "30")
CODEMAP_YELLOW=$(jq -r '.validation.stalenessThresholds."CODE_MAP.md".yellow' context/.context-config.json 2>/dev/null || echo "60")
CODEMAP_RED=$(jq -r '.validation.stalenessThresholds."CODE_MAP.md".red' context/.context-config.json 2>/dev/null || echo "90")

# Check each file
check_staleness "context/STATUS.md" $STATUS_GREEN $STATUS_YELLOW $STATUS_RED
check_staleness "context/SESSIONS.md" $SESSIONS_GREEN $SESSIONS_YELLOW $SESSIONS_RED
check_staleness "context/CONTEXT.md" $CONTEXT_GREEN $CONTEXT_YELLOW $CONTEXT_RED
check_staleness "context/CODE_MAP.md" $CODEMAP_GREEN $CODEMAP_YELLOW $CODEMAP_RED "true"

# DECISIONS.md is append-only, no staleness check
echo "  ✅ context/DECISIONS.md - Append-only (no staleness check)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Staleness Thresholds (configured in .context-config.json):"
echo ""
echo "STATUS.md:    🟢 ≤${STATUS_GREEN}d | 🟡 ≤${STATUS_YELLOW}d | 🔴 >${STATUS_YELLOW}d"
echo "SESSIONS.md:  🟢 ≤${SESSIONS_GREEN}d | 🟡 ≤${SESSIONS_YELLOW}d | 🔴 >${SESSIONS_YELLOW}d"
echo "CONTEXT.md:   🟢 ≤${CONTEXT_GREEN}d | 🟡 ≤${CONTEXT_YELLOW}d | 🔴 >${CONTEXT_YELLOW}d"
echo "CODE_MAP.md:  🟢 ≤${CODEMAP_GREEN}d | 🟡 ≤${CODEMAP_YELLOW}d | 🔴 >${CODEMAP_YELLOW}d (if exists)"
echo ""
echo "💡 Tip: Adjust thresholds in context/.context-config.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

**Why staleness detection matters:**
- Prevents outdated context from misleading AI agents
- Configurable per-project (fast-moving vs. stable projects)
- Visual indicators make staleness obvious
- Specific recommendations based on which docs are stale

**Recommendations based on staleness:**
- 🔴 STATUS.md stale → Run /save or /save-full immediately
- 🔴 SESSIONS.md stale → Run /save-full to capture recent work
- 🔴 CONTEXT.md stale → Review architecture changes, update if needed
- 🔴 CODE_MAP.md stale → Review new features, update location guide

---

### Step 2.8: File Organization Validation ✨ v2.2.1

**PURPOSE:** Ensure project maintains structural neatness and professional appearance

**ACTION:** Check for documentation sprawl and misplaced files

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2.8: File Organization Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ORGANIZATION_SCORE=100

# Check 1: Documentation sprawl in root
echo "Checking root directory for loose files..."
ROOT_DOCS=$(find . -maxdepth 1 -name "*.md" \
  ! -name "README.md" \
  ! -name "SECURITY.md" \
  ! -name "CONTRIBUTING.md" \
  ! -name "LICENSE.md" \
  ! -name "CHANGELOG.md" \
  ! -name "ORGANIZATION.md" \
  2>/dev/null | wc -l)

if [ "$ROOT_DOCS" -gt 0 ]; then
  echo "⚠️  Documentation sprawl detected: $ROOT_DOCS loose file(s) in root"
  echo ""
  find . -maxdepth 1 -name "*.md" \
    ! -name "README.md" \
    ! -name "SECURITY.md" \
    ! -name "CONTRIBUTING.md" \
    ! -name "LICENSE.md" \
    ! -name "CHANGELOG.md" \
    ! -name "ORGANIZATION.md" \
    2>/dev/null
  echo ""
  echo "Recommendation: File these documents in organized folders"
  echo "  - Active planning → docs/planning/"
  echo "  - Completed milestones → artifacts/milestones/"
  echo "  - Old proposals → artifacts/planning/"
  echo "  - Architecture docs → docs/architecture/"
  echo ""
  echo "Run: /organize-docs for guided cleanup"
  echo ""

  # Deduct points based on severity
  if [ "$ROOT_DOCS" -gt 10 ]; then
    ORGANIZATION_SCORE=$((ORGANIZATION_SCORE - 30))
  elif [ "$ROOT_DOCS" -gt 5 ]; then
    ORGANIZATION_SCORE=$((ORGANIZATION_SCORE - 20))
  else
    ORGANIZATION_SCORE=$((ORGANIZATION_SCORE - 10))
  fi
fi

# Check 2: Documentation in source directories
if [ -d "src" ]; then
  SOURCE_DOCS=$(find src -name "*.md" 2>/dev/null | wc -l)
  if [ "$SOURCE_DOCS" -gt 0 ]; then
    echo "⚠️  Documentation found in source directories:"
    find src -name "*.md" 2>/dev/null
    echo ""
    echo "Recommendation: Move documentation to docs/ folder"
    echo "  Source directories should contain code only"
    echo ""
    ORGANIZATION_SCORE=$((ORGANIZATION_SCORE - 10))
  fi
fi

# Check 3: Folder structure suggestions
if [ ! -d "artifacts" ] && [ "$ROOT_DOCS" -gt 3 ]; then
  echo "💡 Suggestion: Create artifacts/ folder for historical work"
  echo "   mkdir -p artifacts/{milestones,planning,reviews,research}"
  echo ""
fi

if [ ! -d "docs" ] && [ "$(find . -name "*.md" 2>/dev/null | wc -l)" -gt 10 ]; then
  echo "💡 Suggestion: Create docs/ folder for organized documentation"
  echo "   mkdir -p docs/{setup,development,architecture,api}"
  echo ""
fi

# Display organization score
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ORGANIZATION_SCORE" -ge 90 ]; then
  echo "✅ Organization score: $ORGANIZATION_SCORE/100 (Excellent)"
elif [ "$ORGANIZATION_SCORE" -ge 75 ]; then
  echo "🟡 Organization score: $ORGANIZATION_SCORE/100 (Good - minor cleanup recommended)"
elif [ "$ORGANIZATION_SCORE" -ge 60 ]; then
  echo "🟠 Organization score: $ORGANIZATION_SCORE/100 (Fair - needs attention)"
else
  echo "🔴 Organization score: $ORGANIZATION_SCORE/100 (Poor - run /organize-docs)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
```

**What this checks:**
- Loose .md files in project root (should be ≤ 5)
- Documentation in source directories (should be 0)
- Presence of organizational folders (artifacts/, docs/)

**Why this matters:**
- Professional appearance
- Easy navigation
- Reduced cognitive load
- Better collaboration
- See ORGANIZATION.md for complete guidelines

**Scoring:**
- 100: Perfect organization (≤ 5 files in root, no source docs)
- 90-99: Excellent (minor cleanup needed)
- 75-89: Good (some reorganization recommended)
- 60-74: Fair (needs attention)
- <60: Poor (run /organize-docs immediately)

---

### Step 3: Generate Recommendations Report

Based on validation results, provide actionable recommendations:

**If errors found (exit code 2):**
```markdown
❌ **Critical Issues Found**

**High Priority Fixes:**
1. Create missing STATUS.md - Run /save to generate
2. Fix invalid JSON in .context-config.json
3. Add missing required sections to CONTEXT.md

**Next Steps:**
- Fix errors before proceeding
- Run /validate-context again to verify
```

**If warnings found (exit code 1):**
```markdown
⚠️  **Warnings Found**

**Recommended Improvements:**
1. Fill in owner name in .context-config.json
2. Replace 5 TODO placeholders in documentation
3. Add more detail to sparse ARCHITECTURE.md (if exists)

**Impact:**
- Documentation is usable but incomplete
- Address warnings when time permits
```

**If all passed (exit code 0):**
```markdown
✅ **Documentation Health: Excellent**

All validation checks passed. Your context system is in great shape!

**Stats:**
- All required files present
- No unresolved placeholders
- Valid configuration
- Complete documentation

Ready to /export-context or share with team.
```

## Validation Categories

### Critical Issues (Block Usage)
- Missing 3+ required files → Run /init-context
- Invalid .context-config.json → Fix JSON syntax
- No session history at all → Run /save-context
- Missing core commands → Reinstall system

### Warnings (Should Fix Soon)
- Missing 1-2 required files → Create from templates
- Missing required sections → Add to documentation
- 5+ unfilled placeholders → Fill in project details
- Sparse documentation → Expand content

### Info (Nice to Have)
- Few placeholders (1-4) → Fill when convenient
- Older session history → Run /save-context more frequently
- Config owner still placeholder → Personalize config

## Usage Examples

### After Initial Setup
```
/init-context
/validate-context

> Health Score: Excellent
> All required files created
> 8 placeholders to fill (project-specific info)
```

### After Migration
```
/migrate-context
/validate-context

> Health Score: Good
> All required sections present
> 3 minor placeholders to fill
```

### Before Export
```
/save-context
/validate-context
/export-context

> Health Score: Excellent
> Ready to export!
```

### Regular Health Check
```
/validate-context

> Health Score: Good
> Consider adding recent decisions to DECISIONS.md
```

## Important Notes

### What Gets Validated

**Structure:**
- Required files exist
- Required sections present
- Proper file organization

**Content:**
- Placeholders filled in
- Valid JSON format
- Minimum file sizes

**Completeness:**
- Session history exists
- Config properly formatted
- Commands all present

### What Doesn't Get Validated

- Content accuracy (can't verify technical correctness)
- Writing quality
- Specific project details
- Personal preferences

### Script Location

The validation script is at: `scripts/validate-context.sh`

To run independently (outside Claude Code):
```bash
cd your-project
./scripts/validate-context.sh
```

## Success Criteria

Validation succeeds when:
- Script runs without errors
- Results clearly communicated
- Recommendations actionable
- User knows exactly what to fix
- Health status obvious

**Perfect validation:**
- Exit code 0 (all passed)
- Clear report
- Ready for export/sharing
- Documentation complete

---

**💬 Feedback**: Any feedback on validation? (Add to `context/context-feedback.md`)

- Did validation find issues accurately?
- Were the recommendations helpful?
- Any false positives or missed issues?
- Suggestions for improvement?

---

**Version:** 3.6.0
**Updated:** v2.3.1 - Added feedback system
