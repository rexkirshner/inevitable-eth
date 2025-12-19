---
name: update-context-system
description: Update AI Context System to latest version from GitHub
---

# /update-context-system Command

Update your project's AI Context System to the latest version from GitHub using the automated installer script.

## When to Use This Command

- Periodically (monthly) to get latest improvements
- When new features or bug fixes are released
- Before initializing new projects (get latest templates)

**Run periodically** to stay up to date with improvements.

## What This Command Does

1. Downloads latest installer from GitHub
2. Checks if update is needed (compares versions)
3. Backs up existing installation
4. Updates all slash commands (`.claude/commands/*.md`)
5. Updates scripts (validation, helpers)
6. Updates templates for reference
7. Updates configuration schemas
8. Reports everything that changed

## Important: How to Execute This Command

**CRITICAL:** You MUST use the Bash tool to execute all commands in this file. Do NOT describe the commands to the user - EXECUTE them.

Each bash code block in this file should be run using the Bash tool. This is an automated update process.

**CRITICAL WORKING DIRECTORY RULE:**
- User will run this command FROM the project directory
- Do NOT try to cd into the project directory yourself
- All paths in commands are relative to project root
- If Step 0 fails, tell user to cd to correct directory
- Do NOT attempt complex path escaping with spaces
- Trust that user's current directory is correct when they run the command

## Important: Version Check First

**CRITICAL:** This command compares version numbers. If local version matches GitHub version, the command MUST exit immediately without making ANY changes. Only proceed with updates if GitHub version is newer.

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

**Why this matters:** Provides access to `download_with_retry()` for robust network operations and `get_system_version()` for version checking.

---

### Step 0.5: Verify Working Directory

**CRITICAL:** Ensure we're in the correct project directory before proceeding.

```bash
# Check if context/.context-config.json exists
if [ ! -f "context/.context-config.json" ]; then
  echo ""
  echo "❌ ERROR: Not in correct project directory"
  echo ""
  echo "Current directory: $(pwd)"
  echo ""
  echo "This command must be run from the project root directory that contains:"
  echo "  - context/.context-config.json"
  echo "  - .claude/commands/"
  echo ""
  echo "Common issues:"
  echo "  1. Running from parent folder instead of project folder"
  echo "  2. Running from nested subdirectory"
  echo ""

  # Try to detect if we're in a parent folder
  if [ -d "inevitable-eth/context" ] || [ -d "*/context" ]; then
    echo "💡 Detected project in subdirectory!"
    echo ""
    echo "Try:"
    echo "  cd inevitable-eth  (or whatever your project folder is)"
    echo "  /update-context-system"
  fi

  echo ""
  echo "Cancelled. Please cd to the project directory and try again."
  exit 1
fi

echo "✅ Working directory verified"
echo "Project: $(pwd)"
echo ""
```

### Step 1: Check Current Version

**ACTION:** Use the Bash tool to check the current version using shared function:

```bash
CURRENT_VERSION=$(get_system_version)
log_info "📦 Current version: $CURRENT_VERSION"
log_info "🔍 Checking for updates from GitHub..."
```

### Step 2: Run Installer Script

**ACTION:** Use the Bash tool to download and run the installer:

```bash
# Download the latest installer with retry logic
log_info "Downloading latest installer from GitHub..."
if download_with_retry \
  "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/install.sh" \
  "/tmp/claude-context-install.sh" \
  3 \
  10; then
  log_success "✅ Installer downloaded"

  # Make it executable
  chmod +x /tmp/claude-context-install.sh

  # Run the installer with --yes flag for non-interactive mode
  /tmp/claude-context-install.sh --yes

  # Clean up
  rm -f /tmp/claude-context-install.sh
else
  show_error $EXIT_NETWORK "Failed to download installer" \
    "Check your internet connection" \
    "Verify GitHub is accessible" \
    "Try again later if GitHub is experiencing issues"
  exit 1
fi
```

The installer will:
- Check if you already have the latest version (and exit if you do)
- Back up your existing installation
- Download all latest files
- Update commands, templates, scripts, and configuration
- Verify the installation
- Report what was updated

**After the installer completes:**
- Review the output to see what was updated
- Installer will show version change (if any)
- Installer will list all updated files

---

### Step 2.3: Update Configuration Version

**ACTION:** Update the version fields in `.context-config.json` to match the new system version:

```bash
echo "🔄 Updating configuration version..."

# Detect new system version
SYSTEM_VERSION=$(cat VERSION 2>/dev/null || echo "unknown")

if [ "$SYSTEM_VERSION" != "unknown" ] && [ -f "context/.context-config.json" ]; then
  # Update both version and configVersion fields
  # macOS uses different sed syntax than Linux
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
    sed -i '' "s/\"configVersion\": \"[^\"]*\"/\"configVersion\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
  else
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
    sed -i "s/\"configVersion\": \"[^\"]*\"/\"configVersion\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
  fi

  echo "✅ Updated config version to $SYSTEM_VERSION"
else
  echo "⚠️  Could not update config version (VERSION file or config missing)"
fi
```

**Why this matters:** Ensures the configuration file accurately reflects the upgraded system version, preventing version mismatch warnings in `/review-context`.

---

### Step 2.5: Archive Feedback and Create Fresh File

**v2.3.1: Feedback System**

**ACTION:** Archive existing feedback (if has content) and create fresh feedback file:

```bash
log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "  Feedback System (v2.3.1+)"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""

# v3.0.0 Migration: Rename old feedback file if it exists
if [ -f "context/claude-context-feedback.md" ] && [ ! -f "context/context-feedback.md" ]; then
  log_info "🔄 Migrating feedback file (v2.x → v3.0)..."

  # Check if old file has actual content
  CONTENT_LINES=$(wc -l < "context/claude-context-feedback.md" | tr -d ' ')

  if [ "$CONTENT_LINES" -gt 10 ]; then
    # Has content - archive it
    CURRENT_VERSION=$(get_system_version)
    ARCHIVE_DATE=$(date +%Y-%m-%d)
    mkdir -p artifacts/feedback

    ARCHIVE_FILE="artifacts/feedback/feedback-v${CURRENT_VERSION}-${ARCHIVE_DATE}.md"
    mv "context/claude-context-feedback.md" "$ARCHIVE_FILE"

    log_success "✅ Archived v2.x feedback to $ARCHIVE_FILE"
    log_info "   (Your old feedback preserved)"
  else
    # Just template - remove it (with deletion protection)
    if confirm_deletion "context/claude-context-feedback.md"; then
      rm -f "context/claude-context-feedback.md"
      log_verbose "Removed empty v2.x feedback file"
    else
      log_warn "⚠️  Kept context/claude-context-feedback.md (deletion cancelled)"
    fi
  fi
fi

# Check if feedback file exists and has actual content (not just template)
if [ -f "context/context-feedback.md" ]; then
  # Count lines in Feedback Entries section (between "## Feedback Entries" and "## Examples")
  # Fresh template has ~7 lines, template with entries has 15+
  CONTENT_LINES=$(awk '/^## Feedback Entries$/,/^## Examples/' \
    context/context-feedback.md | wc -l | tr -d ' ')

  if [ "$CONTENT_LINES" -gt 10 ]; then  # Has actual entries beyond template
    # Get current version for archive filename
    CURRENT_VERSION=$(get_system_version)
    ARCHIVE_DATE=$(date +%Y-%m-%d)

    # Create archive directory if needed
    mkdir -p artifacts/feedback

    # Archive with version and date
    ARCHIVE_FILE="artifacts/feedback/feedback-v${CURRENT_VERSION}-${ARCHIVE_DATE}.md"
    mv context/context-feedback.md "$ARCHIVE_FILE"

    log_success "✅ Archived feedback to $ARCHIVE_FILE"
    log_info "   (Feedback from v${CURRENT_VERSION} preserved)"
  else
    log_verbose "Feedback file exists but appears to be just template (no entries)"
    # Deletion protection for potentially sensitive files
    if confirm_deletion "context/context-feedback.md"; then
      rm -f context/context-feedback.md
      log_verbose "Removed empty feedback file"
    else
      log_warn "⚠️  Kept context/context-feedback.md (deletion cancelled)"
    fi
  fi
fi

# Create fresh feedback file from template
if [ ! -f "context/context-feedback.md" ]; then
  if [ -f "templates/context-feedback.template.md" ]; then
    cp templates/context-feedback.template.md context/context-feedback.md
    log_success "✅ Created fresh feedback file"
    log_info ""
    log_info "📝 Please share your upgrade experience:"
    log_info "   - Any issues during update?"
    log_info "   - New features working well?"
    log_info "   - Add feedback to context/context-feedback.md"
  else
    log_warn "⚠️  Template not found - will be created on next /init-context"
  fi
fi

log_info ""
```

**Why this matters:**
- Preserves your previous feedback (archived with version number)
- Gives you fresh file for new feedback
- Tracks what version you were using when you had issues
- Helps identify version-specific problems

---

### Step 3: Show What's New (v3.3.0+)

**ACTION:** Display what's new in the upgraded version:

```bash
log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "  🎉 What's New in v3.3.0"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""

CURRENT_VERSION=$(get_system_version)

# Show what's new for v3.3.0 upgrades
if [[ "$CURRENT_VERSION" == "3.3.0" ]]; then
  echo "✨ You now have these new features:"
  echo ""
  echo "1️⃣  Template Markers (Template Protection)"
  echo "   • HTML comment markers protect critical sections"
  echo "   • <!-- TEMPLATE SECTION: KEEP ALL --> preserves structure"
  echo "   • <!-- TEMPLATE: READ-ONLY --> prevents modifications"
  echo "   • Prevents 80-90% of template deletion errors"
  echo ""
  echo "2️⃣  Documentation Staleness Detection"
  echo "   • /save-full warns when CONTEXT.md is >7 days old"
  echo "   • /save-full warns when README.md is >14 days old"
  echo "   • /review-context shows color-coded staleness 🟢🟡🔴"
  echo "   • Proactive reminders prevent documentation drift"
  echo ""
  echo "3️⃣  Decision Documentation Guidance"
  echo "   • CLAUDE.md now has decision capture prompts"
  echo "   • 5 categories of decisions with examples"
  echo "   • DECISIONS.md format guidance with metrics"
  echo "   • Better architectural decision preservation"
  echo ""
  echo "4️⃣  Deletion Protection"
  echo "   • Interactive confirmation before file deletion"
  echo "   • Shows file details and requires explicit 'yes'"
  echo "   • Default: keep file (safe by default)"
  echo "   • Zero data loss from accidental deletions"
  echo ""
  echo "📖 Detailed documentation: .claude/docs/update-guide.md"
  echo ""
  echo "🎯 To adopt template markers (recommended):"
  echo "   Run /update-templates to add markers to your context files"
  echo ""
  echo "🎯 To use staleness detection:"
  echo "   Already active! Next /save-full will check documentation currency"
  echo ""
fi

log_info "📦 Current version: $CURRENT_VERSION"
log_info ""
```

### Step 4: Check Version and Migration Path

**ACTION:** Check current version to determine if migration is needed:

```bash
if [[ "$CURRENT_VERSION" == "2.1.0" ]]; then
  echo "🔄 Migration to v2.2.1 available!"
  echo ""
  echo "✨ v2.2.1 includes organization features + bug fixes:"
  echo "   - Bug fixes: Git push protection, large file handling, subdirectory support"
  echo "   - ORGANIZATION.md guidelines (in reference/ folder)"
  echo "   - /organize-docs command (interactive cleanup wizard)"
  echo "   - Organization validation (0-100 scoring)"
  echo "   - Cleanup reminders (gentle, skippable)"
  echo ""
  echo "Migration time: 5 minutes (automatic) + 10-15 minutes (optional cleanup)"
  echo "Difficulty: Easy (non-breaking, opt-in features)"
  echo ""
  echo "📖 Full migration guide:"
  echo "   reference/MIGRATION_GUIDE_v2.1_to_v2.2.md"
  echo "   https://github.com/rexkirshner/ai-context-system/blob/main/MIGRATION_GUIDE_v2.1_to_v2.2.md"
  echo ""
  echo "🎯 Quick adoption (optional):"
  echo "   1. cp reference/ORGANIZATION.md ./ORGANIZATION.md"
  echo "   2. Add /organize-docs to context/.context-config.json enabled commands"
  echo "   3. Run /validate-context to check organization score"
  echo "   4. Run /organize-docs if score < 90"
  echo ""
elif [[ "$CURRENT_VERSION" == "2.0.0" ]]; then
  echo "🔄 Migration to v2.1.0 available!"
  echo ""
  echo "⚠️  v2.1.0 includes file consolidation:"
  echo "   - QUICK_REF.md merged into STATUS.md (auto-generated section)"
  echo "   - Creates CLAUDE.md at project root (auto-loaded)"
  echo "   - Reduces file count: 6 → 5 files"
  echo "   - Adds automated staleness detection"
  echo ""
  echo "Migration time: 10-15 minutes"
  echo "Difficulty: Easy (mostly automatic)"
  echo ""
  echo "📖 Full migration guide:"
  echo "  https://github.com/rexkirshner/ai-context-system/blob/main/MIGRATION_GUIDE_v2.0_to_v2.1.md"
  echo ""
  echo "Quick migration (copy-paste to terminal):"
  echo "  curl -sL https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/MIGRATION_GUIDE_v2.0_to_v2.1.md | grep -A 100 'Run in terminal:' | bash"
  echo ""
elif [[ "$CURRENT_VERSION" == "1.9.0" ]]; then
  echo "🔄 Migration to v2.0.0 available!"
  echo ""
  echo "⚠️  v2.0.0 includes major file structure changes:"
  echo "   - CLAUDE.md → CONTEXT.md"
  echo "   - Creates STATUS.md (single source of truth)"
  echo "   - Creates DECISIONS.md, SESSIONS.md (structured)"
  echo "   - Auto-generates Quick Reference"
  echo ""
  echo "Migration options:"
  echo "  1. MANUAL: Follow MIGRATION_GUIDE.md (recommended)"
  echo "  2. AUTOMATED: Use migration script (backup first)"
  echo ""
  echo "For manual migration, see:"
  echo "  https://github.com/rexkirshner/ai-context-system/blob/main/MIGRATION_GUIDE.md"
  echo ""
elif [[ "$CURRENT_VERSION" < "1.9.0" ]]; then
  echo "🔄 Multi-step migration required..."
  echo ""
  echo "Your version: $CURRENT_VERSION"
  echo "Latest version: 2.2.1"
  echo ""
  echo "Migration path:"
  echo "  1. Upgrade to v1.9.0 first"
  echo "  2. Then upgrade to v2.0.0"
  echo "  3. Then upgrade to v2.1.0"
  echo "  4. Finally upgrade to v2.2.1"
  echo ""
  echo "Start with:"
  echo "  https://github.com/rexkirshner/ai-context-system/releases"
  echo ""
else
  echo "✅ Already on latest version structure"
fi
```

**About v2.0.0 Migration:**

Automated migration with dry-run, backup, and rollback is planned for v2.1. For now, v2.0.0 migration is manual:

1. Read [MIGRATION_GUIDE.md](https://github.com/rexkirshner/ai-context-system/blob/main/MIGRATION_GUIDE.md)
2. Backup your `context/` folder
3. Follow the step-by-step migration process
4. Verify with `/validate-context`

**Why manual for now?**
- v2.0.0 focuses on getting the new structure right
- Automated migration requires extensive testing (10+ real projects)
- Manual migration ensures you understand changes
- v2.1 will add full automation with safety features

### Step 5: Review Template Updates (Optional)

After the installer completes, you may want to review if any template files have significant updates that should be applied to your context files.

**ACTION:** Check for template changes:

```bash
echo ""
echo "📋 Reviewing template updates..."
echo ""

# Compare templates with your context files (if they exist)
if [ -f "context/CONTEXT.md" ] && [ -f "templates/CONTEXT.template.md" ]; then
  echo "ℹ️  CONTEXT.md template available in templates/"
  echo "   Review templates/CONTEXT.template.md for new sections you might want to add"
fi

if [ -f "context/STATUS.md" ] && [ -f "templates/STATUS.template.md" ]; then
  echo "ℹ️  STATUS.md template available in templates/"
  echo "   Review templates/STATUS.template.md for structural improvements"
fi

if [ -f "context/DECISIONS.md" ] && [ -f "templates/DECISIONS.template.md" ]; then
  echo "ℹ️  DECISIONS.md template available in templates/"
  echo "   Review templates/DECISIONS.template.md for new guidelines"
fi

echo ""
echo "💡 Tip: Compare templates with your context files manually to identify"
echo "   useful additions. Your project-specific content remains untouched."
```

Templates are reference files - you choose what to adopt.

### Step 5.5: CLAUDE.md Migration Check (v3.6.0+)

**CRITICAL:** Check if user needs to migrate CLAUDE.md from old location to project root.

**ACTION:** Detect old location and offer migration:

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 CLAUDE.md Location Check (v3.6.0)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

OLD_CLAUDE="context/claude.md"
NEW_CLAUDE="CLAUDE.md"
MIGRATION_NEEDED=false

# Case 1: Old location exists, new doesn't - offer migration
if [ -f "$OLD_CLAUDE" ] && [ ! -f "$NEW_CLAUDE" ]; then
  MIGRATION_NEEDED=true
  echo "⚠️  Found CLAUDE.md at old location: context/claude.md"
  echo ""
  echo "Starting v3.6.0, CLAUDE.md should be at project root for auto-loading by Claude Code."
  echo ""
  echo "Options:"
  echo "  1. MOVE existing file (preserves your customizations)"
  echo "  2. CREATE fresh file (uses new v3.6.0 template)"
  echo "  3. SKIP (I'll handle it manually)"
  echo ""
  read -p "Choose option [1/2/3]: " -n 1 -r MIGRATE_CHOICE
  echo ""

  case "$MIGRATE_CHOICE" in
    1)
      echo ""
      echo "Moving context/claude.md → ./CLAUDE.md..."
      mv "$OLD_CLAUDE" "$NEW_CLAUDE"
      echo "✅ Moved successfully!"
      echo ""
      echo "💡 Tip: Review ./CLAUDE.md - the v3.6.0 template has new sections"
      echo "   you may want to add (Project Identity, Critical Rules, etc.)"
      echo "   See: templates/CLAUDE.md.template"
      ;;
    2)
      echo ""
      echo "Creating fresh CLAUDE.md from v3.6.0 template..."
      if [ -f "templates/CLAUDE.md.template" ]; then
        cp "templates/CLAUDE.md.template" "$NEW_CLAUDE"
        echo "✅ Created ./CLAUDE.md from template"
        echo ""
        echo "⚠️  Your old file remains at context/claude.md"
        echo "   Review it for any customizations to merge, then delete it:"
        echo "   rm context/claude.md"
      else
        echo "❌ Template not found. Run /update-context-system again."
      fi
      ;;
    3|*)
      echo ""
      echo "Skipped. To migrate manually:"
      echo "  mv context/claude.md ./CLAUDE.md"
      echo ""
      echo "Or create fresh from template:"
      echo "  cp templates/CLAUDE.md.template ./CLAUDE.md"
      ;;
  esac

# Case 2: Both exist - warn about duplicate
elif [ -f "$OLD_CLAUDE" ] && [ -f "$NEW_CLAUDE" ]; then
  echo "⚠️  Both locations exist:"
  echo "   - ./CLAUDE.md (correct - auto-loaded)"
  echo "   - context/claude.md (old - not auto-loaded)"
  echo ""
  echo "Recommendation:"
  echo "  1. Review context/claude.md for any unique customizations"
  echo "  2. Merge any customizations into ./CLAUDE.md"
  echo "  3. Delete the old file: rm context/claude.md"

# Case 3: Only new location exists - good!
elif [ -f "$NEW_CLAUDE" ]; then
  echo "✅ CLAUDE.md is at correct location (project root)"

# Case 4: Neither exists - create new
else
  echo "ℹ️  No CLAUDE.md found. Creating from template..."
  if [ -f "templates/CLAUDE.md.template" ]; then
    cp "templates/CLAUDE.md.template" "$NEW_CLAUDE"
    echo "✅ Created ./CLAUDE.md from template"
    echo "   📝 Customize with your project details"
  else
    echo "⚠️  Template not found. CLAUDE.md will be created by /init-context"
  fi
fi

echo ""
```

**Why this matters:** CLAUDE.md at project root is auto-loaded by Claude Code at every conversation start. The old location `context/claude.md` is NOT auto-loaded, meaning critical project context wasn't available by default.

### Step 6: Generate Update Report

Provide a clear summary to the user:

```
✅ AI Context System Updated

## Version
[OLD_VERSION] → [NEW_VERSION]

## What Was Updated

**System Files:**
- Slash commands (.claude/commands/) - v2.0.0 command prompts
- Helper scripts (scripts/) - v1.9.0 automation (v2.0 migration in v2.1)
- Templates (templates/) - v2.0.0 file structure
- Configuration schemas (config/) - v2.0.0 schema

**Your Project Files:**
- Version number in context/.context-config.json
- No changes to your context documentation (CONTEXT.md, STATUS.md, etc.)

## Template Updates Available

Review templates/ directory for new reference content you may want to adopt:
- templates/CONTEXT.template.md
- templates/STATUS.template.md (includes Quick Reference section at top in v2.1)
- templates/DECISIONS.template.md
- templates/SESSIONS.template.md
- templates/CODE_MAP.template.md (optional)

## Next Steps

1. Review template files if desired
2. Run /save-context to document this update
3. Continue working with latest system!

---

📚 Full changelog: https://github.com/rexkirshner/ai-context-system/releases
```

## Important Notes

### What Gets Updated

- ✅ All slash commands (always)
- ✅ Scripts and templates (reference files)
- ✅ Configuration schemas
- ✅ Version number in config
- ❌ Never: Your context documentation (you choose what to update)
- ❌ Never: Project-specific content

### Safety

- Installer creates backups before updating
- Your context files (CONTEXT.md, STATUS.md, etc.) are never touched
- Templates are references - you decide what to adopt
- Can restore from backup if needed: `.claude-backup-[timestamp]/`

### Version Management

- Version stored in `context/.context-config.json`
- Format: `major.minor.patch` (e.g., "1.8.0")
- Check GitHub releases for changelog

## Error Handling

**If GitHub is unreachable:**
```
❌ Cannot reach GitHub
- Check internet connection
- Try again later
- Manual update: download from https://github.com/rexkirshner/ai-context-system
```

**If installer fails:**
```
❌ Installation failed
- Check error output above
- Your original files are backed up in .claude-backup-[timestamp]/
- Restore if needed: cp -r .claude-backup-*/.claude .
```

## Success Criteria

Update succeeds when:
- Installer completes without errors
- All files verified
- Version number updated in config
- Update report generated
- User informed of changes

**Perfect update:**
- System files auto-updated
- Project content untouched
- Clear report of what changed
- Ready to continue work immediately

---

**💬 Feedback**: Any feedback on the update process? (Add to `context/context-feedback.md`)

- Did the update go smoothly?
- Any errors or warnings?
- New features working as expected?
- Was feedback properly archived?

---

## Session Start: Git Workflow Reminder

**After completing the update**, present this copy-paste prompt to the user:

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
