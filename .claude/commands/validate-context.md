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
7. Reports documentation health score
8. Provides actionable recommendations

## Execution Steps

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
🔍 Validating Claude Context System...

📄 Checking required documentation files...
  ✅ context/CLAUDE.md
  ✅ context/PRD.md
  ...

🔎 Checking for unresolved placeholders...
  ⚠️  Unresolved placeholders found:
    context/CLAUDE.md:45: [TODO: Add deployment instructions]

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

### Step 3: Generate Recommendations Report

Based on validation results, provide actionable recommendations:

**If errors found (exit code 2):**
```markdown
❌ **Critical Issues Found**

**High Priority Fixes:**
1. Create missing DECISIONS.md - Run /save-context to generate
2. Fix invalid JSON in .context-config.json
3. Add missing required sections to CLAUDE.md

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
3. Add more detail to sparse ARCHITECTURE.md

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
