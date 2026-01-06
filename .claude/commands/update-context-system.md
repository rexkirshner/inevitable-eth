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

### Step 3: Show What's New

**ACTION:** Display what's new in the upgraded version:

```bash
log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "  🎉 What's New in v4.0.0"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""

CURRENT_VERSION=$(get_system_version)

echo "✨ Modular Code Review System"
echo ""
echo "The /code-review command is now a master orchestrator with"
echo "8 specialized audit commands:"
echo ""
echo "   /code-review-security      OWASP Top 10 audit"
echo "   /code-review-performance   Core Web Vitals audit"
echo "   /code-review-accessibility WCAG 2.1 AA compliance"
echo "   /code-review-seo           Technical SEO audit"
echo "   /code-review-database      N+1, indexes, query optimization"
echo "   /code-review-infrastructure Serverless costs, caching"
echo "   /code-review-typescript    Type safety audit"
echo "   /code-review-testing       Coverage and quality audit"
echo "   /build-check               Pre-push quality gate"
echo ""
echo "📂 New Structure:"
echo "   • Reports saved to docs/audits/{type}-audit-NN.md"
echo "   • INDEX.md tracks all audits with grades"
echo "   • Old reports migrated to docs/audits/archive/"
echo ""
echo "🎯 Quick Start:"
echo "   /code-review               Interactive selection menu"
echo "   /code-review --prelaunch   Security + Perf + A11y + SEO"
echo "   /code-review --all         Run all 8 audits"
echo "   /code-review-security      Run single audit directly"
echo ""
echo "⚠️  IMPORTANT: Restart Claude Code to use new commands"
echo "   Claude Code caches slash commands at session start."
echo "   Close and reopen Claude Code for changes to take effect."
echo ""

log_info "📦 Current version: $CURRENT_VERSION"
log_info ""
```

### Step 4: Check Version and Migration Notes

**ACTION:** Show migration notes based on previous version:

```bash
# Extract major version number for comparison
PREV_MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)

if [[ "$PREV_MAJOR" == "3" ]]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 v3.x → v4.0.0 Migration Notes"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Breaking Changes:"
  echo "  • /code-review is now an orchestrator (not monolithic)"
  echo "  • Reports save to docs/audits/ (was artifacts/code-reviews/)"
  echo "  • Report naming: {type}-audit-NN.md (was session-N-review.md)"
  echo "  • .claude/checklists/ deleted (integrated into commands)"
  echo ""
  echo "Your existing code review files will be migrated automatically"
  echo "to docs/audits/archive/pre-v4.0.0-migration/"
  echo ""
  echo "No action required - migration is automatic!"
  echo ""
elif [[ "$PREV_MAJOR" -lt "3" ]]; then
  echo ""
  echo "⚠️  Upgrading from v$CURRENT_VERSION (very old version)"
  echo ""
  echo "Your version is quite old. The upgrade will work, but you may"
  echo "want to review the CHANGELOG for all changes since your version:"
  echo "  https://github.com/rexkirshner/ai-context-system/blob/main/CHANGELOG.md"
  echo ""
else
  echo "✅ Already on v4.x - no migration needed"
fi
```

**v4.0.0 Breaking Changes Summary:**

| Before (v3.x) | After (v4.0.0) |
|---------------|----------------|
| `/code-review` runs full monolithic review | `/code-review` shows interactive menu |
| Single long report | Multiple focused reports + summary |
| `artifacts/code-reviews/` | `docs/audits/` |
| `session-N-review.md` | `{type}-audit-NN.md` |
| `.claude/checklists/*.md` | Integrated into audit commands |

All existing files are preserved in `docs/audits/archive/`.

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

### Step 5.5: CLAUDE.md Migration (v3.6.1+)

**CRITICAL:** Automatically migrate CLAUDE.md from old location to project root. This is non-interactive to ensure it actually happens.

**ACTION:** Auto-migrate CLAUDE.md to project root:

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 CLAUDE.md Location Check (v3.6.1)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

OLD_CLAUDE="context/claude.md"
NEW_CLAUDE="CLAUDE.md"

# Case 1: Old location exists, new doesn't - AUTO-MIGRATE (no prompt)
if [ -f "$OLD_CLAUDE" ] && [ ! -f "$NEW_CLAUDE" ]; then
  echo "📦 Migrating CLAUDE.md to project root..."
  mv "$OLD_CLAUDE" "$NEW_CLAUDE"
  echo "✅ Moved context/claude.md → ./CLAUDE.md"
  echo ""
  echo "💡 CLAUDE.md is now auto-loaded by Claude Code at conversation start."
  echo "   Review ./CLAUDE.md - the v3.6.1 template has updated sections."
  echo "   See: templates/CLAUDE.md.template for latest structure"

# Case 2: Both exist - warn about duplicate (user must resolve manually)
elif [ -f "$OLD_CLAUDE" ] && [ -f "$NEW_CLAUDE" ]; then
  echo "⚠️  Both locations exist:"
  echo "   - ./CLAUDE.md (correct - auto-loaded by Claude Code)"
  echo "   - context/claude.md (old - NOT auto-loaded)"
  echo ""
  echo "Action required:"
  echo "  1. Review context/claude.md for any unique customizations"
  echo "  2. Merge any customizations into ./CLAUDE.md"
  echo "  3. Delete the old file: rm context/claude.md"

# Case 3: Only new location exists - good!
elif [ -f "$NEW_CLAUDE" ]; then
  echo "✅ CLAUDE.md is at correct location (project root)"

# Case 4: Neither exists - AUTO-CREATE from template
else
  echo "📦 Creating CLAUDE.md at project root..."
  if [ -f "templates/CLAUDE.md.template" ]; then
    cp "templates/CLAUDE.md.template" "$NEW_CLAUDE"
    echo "✅ Created ./CLAUDE.md from template"
    echo "   📝 Customize with your project details"
  else
    echo "⚠️  Template not found. Run /init-context to create CLAUDE.md"
  fi
fi

echo ""
```

**Why this matters:** CLAUDE.md at project root is auto-loaded by Claude Code at every conversation start. The old location `context/claude.md` is NOT auto-loaded, meaning critical project context wasn't available by default.

**v3.6.1 change:** Migration is now automatic (non-interactive) to ensure it actually happens. The v3.6.0 interactive prompts didn't work in Claude Code's execution environment.

### Step 5.6: Audit System Migration (v4.0.0+)

**v4.0.0:** Migrate existing code review artifacts to new docs/audits/ structure.

**ACTION:** Migrate old code review files to new location:

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Audit System Migration (v4.0.0)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create new audit directory structure
mkdir -p docs/audits/archive/pre-v4.0.0-migration

# Check for old code review artifacts
if [ -d "artifacts/code-reviews" ]; then
  # Check if directory has files
  FILE_COUNT=$(find artifacts/code-reviews -type f 2>/dev/null | wc -l | tr -d ' ')

  if [ "$FILE_COUNT" -gt 0 ]; then
    echo "📦 Found $FILE_COUNT existing code review file(s)"
    echo "   Migrating to docs/audits/archive/pre-v4.0.0-migration/..."

    # Move all files to archive
    mv artifacts/code-reviews/* docs/audits/archive/pre-v4.0.0-migration/ 2>/dev/null || true

    # Remove empty directory
    rmdir artifacts/code-reviews 2>/dev/null || true

    echo "✅ Migrated to docs/audits/archive/pre-v4.0.0-migration/"
    echo ""
    echo "💡 Old code reviews preserved in archive."
    echo "   New audits will be created in docs/audits/"
  else
    echo "ℹ️  artifacts/code-reviews/ exists but is empty"
    rmdir artifacts/code-reviews 2>/dev/null || true
  fi
else
  echo "ℹ️  No existing code reviews to migrate"
fi

# Create INDEX.md from template if it doesn't exist
if [ ! -f "docs/audits/INDEX.md" ]; then
  if [ -f "templates/audits-index.template.md" ]; then
    cp templates/audits-index.template.md docs/audits/INDEX.md
    echo "✅ Created docs/audits/INDEX.md"
  fi
fi

echo ""
echo "📊 New audit system structure:"
echo "   docs/audits/                    - New audit reports"
echo "   docs/audits/INDEX.md            - Audit history index"
echo "   docs/audits/archive/            - Archived audits"
echo ""
```

**What this does:**
- Creates new `docs/audits/` directory structure
- Migrates existing `artifacts/code-reviews/*` to `docs/audits/archive/pre-v4.0.0-migration/`
- Creates `INDEX.md` for tracking audit history
- Preserves all existing code review files

**New audit commands (v4.0.0):**
- `/code-review` - Interactive selection of audit types
- `/code-review-security` - OWASP-style security audit
- `/code-review-performance` - Core Web Vitals, bundle analysis
- `/code-review-database` - Query optimization, N+1 detection
- `/code-review-infrastructure` - Serverless costs, caching
- `/code-review-seo` - Technical SEO audit
- Plus: accessibility, typescript, testing audits

---

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

**Version:** 4.0.1
