# Update System Guide

Comprehensive guide for updating the AI Context System to latest versions.

---

## 🎉 What's New in v3.3.0

**Release Date:** 2025-11-13
**Focus:** Template Protection & Documentation Currency

### New Features

#### 1. Template Markers (Template Protection)

**Problem Solved:** Users and AI agents were deleting important template sections thinking they were "just template text to replace."

**Solution:** Templates now have clear HTML comment markers:

- `<!-- TEMPLATE SECTION: KEEP ALL -->` - Preserve structure and content
- `<!-- TEMPLATE SECTION: CUSTOMIZE -->` - Replace with project-specific content
- `<!-- TEMPLATE: READ-ONLY -->` - Do not modify this file
- `[FILL: description]` - Clear placeholders for values
- `[FILL: e.g., example]` - Example text with guidance

**Templates Updated:**
- `CODE_STYLE.template.md` - Protected Core Principles (65+ lines)
- `CLAUDE.md.template` - AI entry point (auto-loaded at project root)
- `CONTEXT.template.md` - Protected 3 critical structural sections

**Impact:** Prevents 80-90% of template structure errors

**To Adopt:** Run `/update-templates` to get template markers in your context files.

---

#### 2. Documentation Staleness Detection

**Problem Solved:** Documentation became stale during active development with no workflow reminders.

**Solution:** Proactive staleness warnings in `/save-full` and `/review-context`:

**Enhanced `/save-full`:**
- **Step 8:** Checks CONTEXT.md currency (warns if >7 days old)
- **Step 9:** Checks README.md staleness (warns if >14 days old)
- Non-blocking warnings with actionable suggestions

**Enhanced `/review-context`:**
- **Step 2.7:** Documentation Staleness Check
  - Color-coded staleness for all context/*.md files (🟢🟡🔴)
  - Missing module README detection
  - Decision documentation ratio analysis

**Impact:** Prevents documentation drift before it becomes a problem

**To Adopt:** Automatic - new steps work immediately after update.

---

#### 3. Decision Documentation Guidance

**Problem Solved:** DECISIONS.md underused - only 2 entries despite major architectural decisions.

**Solution:** Added comprehensive guidance to `CLAUDE.md.template`:

- When to document decisions (5 categories with examples)
- DECISIONS.md format example with metrics
- When NOT to document (avoid noise)
- Proactive prompts for AI agents

**Impact:** Better architectural decision capture and context preservation

**To Adopt:** Run `/update-templates` to get decision guidance in `CLAUDE.md`.

---

#### 4. Deletion Protection

**Problem Solved:** No confirmation before deleting customized documentation during system updates.

**Solution:** Interactive `confirm_deletion()` function:

- Shows file details before deletion
- Requires explicit "yes" confirmation
- Default: keep file (safe)
- Integrated with `/update-context-system`

**Impact:** Zero data loss from accidental deletions

**To Adopt:** Automatic - integrated into update commands.

---

### Upgrade from v3.2.3 → v3.3.0

**All changes are backward compatible and non-breaking.**

**Automatic (runs with `/update-context-system`):**
- ✅ Helper functions added (`days_since_date`, `days_since_file_modified`)
- ✅ `/save-full` enhanced with Steps 8 & 9
- ✅ `/review-context` enhanced with Step 2.7
- ✅ Deletion protection in update commands

**Manual (run `/update-templates` after update):**
- ⏸️ Template markers in CODE_STYLE.md
- ⏸️ Template markers in CONTEXT.md
- ⏸️ Decision guidance in CLAUDE.md

**Recommended Upgrade Steps:**
1. Run `/update-context-system` (updates commands & scripts)
2. Run `/update-templates` (adds template markers to your files)
3. Review new staleness warnings in next `/save-full`

**Migration Notes:**
- No breaking changes
- All new features are opt-in or automatic
- Existing workflows continue to work unchanged

---

## Philosophy

The update system balances two competing needs:
1. **Get latest improvements** - New features, bug fixes, better templates
2. **Preserve your content** - Never lose project-specific documentation

**Core principle:** Commands update automatically. Templates update with approval.

## When To Update

**Good times to update:**
- Periodically (monthly) to get latest improvements
- When new features announced
- After bug fixes released
- Before starting new projects (get latest for init)

**Bad times to update:**
- Mid-feature development (finish first)
- When context is stale (run /save-context first)
- During code review (wait until after)
- Right before deployment (too risky)

**Recommendation:** Update monthly during low-activity periods.

## What Gets Updated

### Automatically Updated (No Approval)

**`.claude/commands/*.md` files:**
- init-context.md
- migrate-context.md
- save-context.md
- quick-save-context.md
- review-context.md
- code-review.md
- validate-context.md
- export-context.md
- update-context-system.md (self-update!)

**Why automatic:**
- Pure execution logic
- No project-specific content
- Bugs fixed immediately
- New features available instantly

### Requires Approval (Interactive)

**Template sections in your `context/` files:**
- CLAUDE.md - Workflow guidance sections
- CODE_STYLE.md - Coding principles
- ARCHITECTURE.md - Pattern guidance
- etc.

**Why approval needed:**
- Contains project-specific content
- Changes affect workflow
- User should understand updates
- May conflict with customizations

## Update Modes

### Default: Interactive Mode

```
/update-context-system
```

**Behavior:**
1. Updates commands automatically ✅
2. Shows diffs for template changes
3. Asks for approval on each change
4. Applies only approved changes

**Best for:**
- First time updating
- Want to review changes
- Selective updates
- Understanding what changed

### Fast: Accept-All Mode

```
/update-context-system --accept-all
```

**Behavior:**
1. Updates commands automatically ✅
2. Applies all template changes automatically
3. No prompts, fully automated

**Best for:**
- Trust all updates
- Want speed over control
- Fresh projects with minimal customization
- You'll review changes in git after

**Caution:** Review git diff after to see what changed.

## How Template Updates Work

### Section-Based Detection

The system doesn't replace entire files. It updates **specific sections**.

**Example: CLAUDE.md**

Your file:
```markdown
## Project Overview
[Your custom content about your specific project]

## Core Development Methodology
[Standard workflow rules - from template]

## Important Notes
[Your custom project notes]
```

Template improved:
```markdown
## Core Development Methodology
[Better workflow rules - improved template]
```

**What happens:**
- Compares your "Core Development Methodology" section with new template
- If different: Shows diff, asks for approval
- If you approve: Updates just that section
- Your "Project Overview" and "Important Notes" untouched

### Blacklisted Sections (Never Updated)

Some sections are always project-specific and never updated:

**In CLAUDE.md:**
- Project Overview
- Commands (your npm scripts)
- Architecture (your structure)
- Development Status
- Important Notes
- Critical Path
- Examples from Past Sessions

**In CODE_STYLE.md:**
- File Structure (your patterns)
- Component Patterns (your conventions)
- Project-specific examples

**In ARCHITECTURE.md:**
- Overview (your system)
- System Architecture (your design)
- Data Flow (your implementation)
- Components (your structure)
- Dependencies (your choices)

**Reason:** These contain your project content, never generic template content.

### Marker System

**Change Detected:**
```
SECTION_CHANGED|CLAUDE.md|Core Development Methodology
```

**Missing Section:**
```
SECTION_MISSING|CLAUDE.md|Debugging Guidance
```

**For each marker:**
1. Show diff (what's changing)
2. Ask for approval
3. Apply if approved
4. Skip if declined

## Version Checking

**Critical:** Update only runs if newer version available.

**Version comparison:**
```bash
Current:  1.5.0
Latest:   1.6.0
Action:   Proceed with update
```

```bash
Current:  1.6.0
Latest:   1.6.0
Action:   Exit immediately (already current)
```

**Why important:**
- Prevents unnecessary updates
- Avoids file churn
- Respects current state
- Fast exit if current

## Self-Update Feature

**Unique aspect:** The update command updates itself!

**Process:**
1. Download latest version
2. Update all commands (including update-context-system.md)
3. **Reload updated command** (read new file)
4. Continue with new logic for template detection

**Why:** Ensures latest update logic used for template changes.

**Example:**
```
Version 1.5.0 update command: Basic template comparison
Version 1.6.0 update command: Improved section detection

Running 1.5.0 command:
1. Downloads 1.6.0
2. Updates commands (now have 1.6.0 update command)
3. Reloads command (now using 1.6.0 logic)
4. Template detection uses improved algorithm ✅
```

## Safety Features

### Backups

**Before updating:**
```bash
cp -r .claude/commands .claude/commands.backup
```

**If update fails:**
```bash
rm -r .claude/commands
mv .claude/commands.backup .claude/commands
```

**Automatic cleanup:**
Backups removed after successful update.

### Git Integration

**Best practice:**
```bash
# Before update
git status  # Clean working directory
git add -A
git commit -m "Before update to v1.6.0"

# Run update
/update-context-system

# After update
git diff  # Review changes
git add -A
git commit -m "Updated to v1.6.0"
```

**Benefits:**
- Easy rollback (git reset --hard HEAD^)
- Clear diff of changes
- Audit trail

### Dry Run (Manual)

**Want to see what would change?**

```bash
# Download latest
curl -L https://github.com/rexkirshner/ai-context-system/archive/refs/heads/main.zip -o /tmp/latest.zip
unzip /tmp/latest.zip -d /tmp/

# Compare versions
diff -u .claude/commands/save-context.md /tmp/ai-context-system-main/.claude/commands/save-context.md

# Compare templates (CLAUDE.md is at project root in v3.6.0+)
diff -u ./CLAUDE.md /tmp/ai-context-system-main/templates/CLAUDE.md.template
```

No changes made. Just preview.

## Common Scenarios

### Scenario 1: First Update

**You:** Installed system months ago, now updating for first time

**Expect:**
- Many command improvements
- Several template enhancements
- Multiple approval prompts
- 5-10 minutes to review and approve

**Process:**
```
/update-context-system

📦 Update Available
  Current: 1.2.0
  Latest:  1.6.0

✅ Updated commands (9 files)

📝 Template changes detected:
1. CLAUDE.md - Debugging Guidance (NEW)
2. CODE_STYLE.md - Testing Rules (IMPROVED)
3. CLAUDE.md - Communication Style (IMPROVED)

For each:
  [Shows diff]
  Apply this change? (yes/no)
  [Your response]

✅ Update complete
```

### Scenario 2: No Changes

**You:** Just updated last week, checking again

**Expect:**
- Quick version check
- No updates available
- Immediate exit

**Process:**
```
/update-context-system

✅ Already Up to Date

Current version: 1.6.0
Latest version: 1.6.0

Your AI Context System is already running the latest version.
No updates were performed.
```

**Time:** 5 seconds

### Scenario 3: Command Fixes Only

**You:** Update released with command bug fixes, no template changes

**Expect:**
- Commands updated
- No approval needed
- Fast completion

**Process:**
```
/update-context-system

📦 Update Available
  Current: 1.6.0
  Latest:  1.6.1

✅ Updated commands (9 files)

No template changes detected.

✅ Update complete
```

**Time:** 30 seconds

### Scenario 4: Accept-All Mode

**You:** Trust updates, want speed

**Expect:**
- Fully automated
- No prompts
- Review changes in git after

**Process:**
```
/update-context-system --accept-all

📦 Update Available
  Current: 1.5.0
  Latest:  1.6.0

✅ Updated commands (9 files)
✅ Applied 3 template changes

Changes:
- CLAUDE.md: 1 section updated
- CODE_STYLE.md: 2 sections updated

✅ Update complete

Recommendation: Review changes with git diff
```

**Time:** 30 seconds

**After:**
```bash
git diff context/
```

## Troubleshooting

### "Already up to date" but I want to force update

**Problem:** Version numbers match but you want to reapply

**Solution:**
```bash
# Manually change version in your config
# Edit context/.context-config.json
"version": "1.5.0"  # Change to lower version

# Run update
/update-context-system

# Restores to correct version
```

**Caution:** Rare need. Usually indicates local modifications.

### Update failed mid-process

**Problem:** Error during update, partial state

**Solution:**
```bash
# Restore from backup
rm -r .claude/commands
mv .claude/commands.backup .claude/commands

# Or from git
git restore .claude/commands
git restore context/

# Try again
/update-context-system
```

### Template section not detected

**Problem:** Template improved but update didn't detect change

**Reason:** Your section header might be customized

**Example:**
```markdown
Template: ## Core Development Methodology
Your file: ## Development Methodology

Not matched (different header)
```

**Solution:**
1. Note the section title in template
2. Manually rename your header to match
3. Run update again
4. Or manually copy improved content

### Commands not loading after update

**Problem:** Claude Code still using old commands

**Reason:** Parent directory `.claude` conflict

**Solution:**
```bash
# Check for multiple .claude directories
find .. -maxdepth 2 -name ".claude"

# If found in parent, that's the issue
# Remove parent .claude (if not needed) or
# Ensure you're in correct project directory
```

### Working directory error

**Problem:** "Not in correct project directory"

**Reason:** Running from wrong folder

**Solution:**
```bash
# Check where you are
pwd

# Verify context exists
ls context/.context-config.json

# If not found, cd to project root
cd /path/to/your/project
/update-context-system
```

## Manual Update Process

**If command fails, manual alternative:**

### 1. Backup

```bash
cp -r .claude/commands .claude/commands.backup
```

### 2. Download Latest

```bash
git clone https://github.com/rexkirshner/ai-context-system.git /tmp/acs-update
```

### 3. Update Commands

```bash
cp /tmp/acs-update/.claude/commands/* .claude/commands/
```

### 4. Review Template Changes

```bash
# Compare each template (CLAUDE.md is at project root in v3.6.0+)
diff -u ./CLAUDE.md /tmp/acs-update/templates/CLAUDE.md.template
diff -u context/CODE_STYLE.md /tmp/acs-update/templates/CODE_STYLE.template.md

# Manually apply changes you want
```

### 5. Update Version

```bash
# Edit context/.context-config.json
"version": "1.6.0"  # Update to latest
```

### 6. Cleanup

```bash
rm -rf /tmp/acs-update
rm -rf .claude/commands.backup
```

## Best Practices

### Before Updating

1. **Clean state:**
   ```
   /save-context
   git status  # Should be clean
   ```

2. **Commit current state:**
   ```bash
   git add -A
   git commit -m "Before update"
   ```

3. **Choose mode:**
   - First time: Interactive
   - Trust updates: --accept-all
   - Want control: Interactive

### During Update

1. **Read diffs carefully** (interactive mode)
2. **Approve valuable changes** (improved guidance)
3. **Decline breaking changes** (conflicts with your customizations)
4. **Note what changed** (for git commit message)

### After Updating

1. **Review changes:**
   ```bash
   git diff
   ```

2. **Test commands:**
   ```
   /validate-context
   /review-context
   ```

3. **Commit:**
   ```bash
   git add -A
   git commit -m "Updated AI Context System to v1.6.0

   Command improvements:
   - Better error handling in save-context
   - Improved template detection

   Template updates:
   - Added debugging guidance to CLAUDE.md
   - Enhanced testing rules in CODE_STYLE.md"
   ```

4. **Update documentation:**
   ```
   /save-context
   ```
   (Captures update event in SESSIONS.md)

## Advanced: Custom Template Management

### Preserving Custom Sections

**If you've heavily customized templates:**

1. **Rename custom sections:**
   ```markdown
   ## Core Development Methodology - Custom
   [Your heavily customized workflow]
   ```
   Won't match template, won't be updated.

2. **Add custom sections:**
   ```markdown
   ## Our Team Workflow
   [Your team-specific content]
   ```
   New sections never touched by updates.

3. **Blacklist approach:**
   Keep standard headers, decline updates selectively.

### Hybrid Approach

```markdown
## Core Development Methodology
[Keep updated from template - general best practices]

## Our Project Workflow
[Your custom workflow - never updated]
```

Best of both worlds.

## Version History Impact

**What changes at each version:**

**Minor version (1.5 → 1.6):**
- Command improvements
- Template enhancements
- New features
- Safe to update

**Patch version (1.6.0 → 1.6.1):**
- Bug fixes
- Small tweaks
- Very safe to update

**Major version (1.x → 2.x):**
- Breaking changes
- Requires migration
- Read release notes first
- May need manual steps

## Summary

**Update system key points:**

✅ Commands update automatically (execution logic)
⚠️ Templates update with approval (content changes)
🔄 System updates itself (self-improving)
💾 Backups created automatically (safety)
🎯 Version checking prevents unnecessary updates
📝 Section-based updates preserve your content
🚀 Accept-all mode for speed
🔍 Interactive mode for control

**When to update:**
- Monthly during low-activity periods
- After major releases
- Before init on new projects

**How to update:**
- Interactive: `/update-context-system`
- Fast: `/update-context-system --accept-all`
- Always: Commit before and after

**The goal:** Get latest improvements without losing your content.
