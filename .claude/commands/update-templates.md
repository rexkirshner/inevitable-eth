---
name: update-templates
description: Compare and update context files with latest templates
---

# /update-templates Command

**Purpose:** Compare your context documentation with latest templates and selectively update

**Use this when:**
- New template improvements available
- Want to adopt latest best practices
- Template structure changed in system update
- Migrating between versions

## What This Command Does

1. Locates templates directory (robust path resolution)
2. Compares each context file with corresponding template
3. Shows visual diff of changes
4. Prompts for approval per file
5. Safely updates files preserving custom content
6. Reports what was updated

## Execution Steps

### Step 1: Locate Templates Directory

**ACTION:** Find templates using robust path resolution

```bash
# Try multiple strategies to find templates
TEMPLATES_DIR=""

# Strategy 1: Check .claude/templates/ (if installed in project)
if [ -d ".claude/templates" ]; then
  TEMPLATES_DIR=".claude/templates"
  echo "✅ Found templates in .claude/templates/"

# Strategy 2: Check if we're in the ai-context-system repo
elif [ -d "templates" ] && [ -f "README.md" ] && grep -q "AI Context System" README.md 2>/dev/null; then
  TEMPLATES_DIR="templates"
  echo "✅ Found templates in current repo"

# Strategy 3: Check for templates relative to commands directory
elif [ -d "../../templates" ]; then
  TEMPLATES_DIR="../../templates"
  echo "✅ Found templates relative to .claude/commands/"

# Strategy 4: Download from GitHub (fallback)
else
  echo "📥 Templates not found locally, downloading from GitHub..."
  TEMPLATES_DIR="/tmp/claude-context-templates-$$"
  mkdir -p "$TEMPLATES_DIR"

  # Download each template individually
  TEMPLATES=(
    "CONTEXT.template.md"
    "STATUS.template.md"
    "DECISIONS.template.md"
    "SESSIONS.template.md"
    "CODE_MAP.template.md"
    "CLAUDE.md.template"
    "cursor.md.template"
    "aider.md.template"
    "codex.md.template"
    "generic-ai-header.template.md"
  )

  for template in "${TEMPLATES[@]}"; do
    curl -sL "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/templates/$template" \
      -o "$TEMPLATES_DIR/$template" 2>/dev/null

    if [ -f "$TEMPLATES_DIR/$template" ]; then
      echo "  ✅ Downloaded $template"
    else
      echo "  ⚠️  Failed to download $template"
    fi
  done

  echo "✅ Templates downloaded to $TEMPLATES_DIR"
fi

if [ -z "$TEMPLATES_DIR" ] || [ ! -d "$TEMPLATES_DIR" ]; then
  echo "❌ Could not locate templates directory"
  echo "Please ensure AI Context System is properly installed"
  exit 1
fi
```

### Step 2: Compare Files and Show Diffs

**ACTION:** For each context file, compare with template

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Template Comparison"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Files to compare (template name -> context file name)
declare -A FILE_MAPPINGS=(
  ["CONTEXT.template.md"]="context/CONTEXT.md"
  ["STATUS.template.md"]="context/STATUS.md"
  ["DECISIONS.template.md"]="context/DECISIONS.md"
  ["SESSIONS.template.md"]="context/SESSIONS.md"
  ["CODE_MAP.template.md"]="context/CODE_MAP.md"
  ["CLAUDE.md.template"]="CLAUDE.md"
)

UPDATES_AVAILABLE=0
FILES_TO_UPDATE=()

# Special check for CLAUDE.md migration (v3.6.0+)
if [ -f "context/claude.md" ] && [ ! -f "CLAUDE.md" ]; then
  echo ""
  echo "⚠️  MIGRATION NEEDED: Found old location context/claude.md"
  echo "   CLAUDE.md should be at project root for auto-loading by Claude Code."
  echo ""
  echo "   Options:"
  echo "     1. Move existing file: mv context/claude.md ./CLAUDE.md"
  echo "     2. Create fresh from template: cp templates/CLAUDE.md.template ./CLAUDE.md"
  echo ""
  read -p "   Move existing file now? [y/N]: " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    mv "context/claude.md" "CLAUDE.md"
    echo "   ✅ Moved to ./CLAUDE.md"
    echo ""
  fi
fi

for template_file in "${!FILE_MAPPINGS[@]}"; do
  context_file="${FILE_MAPPINGS[$template_file]}"
  template_path="$TEMPLATES_DIR/$template_file"

  # Skip if context file doesn't exist
  if [ ! -f "$context_file" ]; then
    echo "⚪ $(basename $context_file) - Not present, skipping"
    continue
  fi

  # Skip if template doesn't exist
  if [ ! -f "$template_path" ]; then
    echo "⚠️  $(basename $context_file) - No template available"
    continue
  fi

  # Compare files (ignoring placeholders and timestamps)
  # Create temp files with normalized content
  TEMP_CONTEXT=$(mktemp)
  TEMP_TEMPLATE=$(mktemp)

  # Normalize: remove timestamps, "Last Updated" lines, user-specific content
  grep -v "Last Updated:" "$context_file" | \
    grep -v "Auto-updated" > "$TEMP_CONTEXT" 2>/dev/null || cat "$context_file" > "$TEMP_CONTEXT"

  grep -v "Last Updated:" "$template_path" | \
    grep -v "Auto-updated" | \
    grep -v "\[TODO" | \
    grep -v "\[YYYY-MM-DD\]" > "$TEMP_TEMPLATE" 2>/dev/null || cat "$template_path" > "$TEMP_TEMPLATE"

  # Check if files are structurally different
  if ! diff -q "$TEMP_CONTEXT" "$TEMP_TEMPLATE" > /dev/null 2>&1; then
    echo "🔄 $(basename $context_file) - Updates available"
    FILES_TO_UPDATE+=("$template_file")
    UPDATES_AVAILABLE=$((UPDATES_AVAILABLE + 1))
  else
    echo "✅ $(basename $context_file) - Up to date"
  fi

  rm -f "$TEMP_CONTEXT" "$TEMP_TEMPLATE"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary: $UPDATES_AVAILABLE file(s) have template updates available"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $UPDATES_AVAILABLE -eq 0 ]; then
  echo "✅ All context files are up to date with latest templates!"
  exit 0
fi
```

### Step 3: Interactive Update for Each File

**ACTION:** Show diff and prompt for each file with updates

```bash
for template_file in "${FILES_TO_UPDATE[@]}"; do
  context_file="${FILE_MAPPINGS[$template_file]}"
  template_path="$TEMPLATES_DIR/$template_file"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📄 $(basename $context_file)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Comparing with template: $template_file"
  echo ""

  # Show diff using git diff format (or regular diff if git not available)
  if command -v git &> /dev/null; then
    git diff --no-index --color=always "$context_file" "$template_path" 2>/dev/null || \
      diff -u "$context_file" "$template_path" || true
  else
    diff -u "$context_file" "$template_path" || true
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Prompt for update
  read -p "Update $(basename $context_file) with template changes? [y/N]: " -n 1 -r
  echo ""

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Backup current file
    cp "$context_file" "${context_file}.backup"
    echo "  💾 Backed up to ${context_file}.backup"

    # Copy template (user will need to fill in placeholders)
    cp "$template_path" "$context_file"
    echo "  ✅ Updated $(basename $context_file)"
    echo ""
    echo "  ⚠️  NOTE: You'll need to fill in placeholders marked with [brackets]"
    echo "  ⚠️  Review the file and update project-specific content"
    echo ""
  else
    echo "  ⏭️  Skipped $(basename $context_file)"
  fi
done
```

### Step 4: Cleanup and Report

**ACTION:** Clean up temp files and provide summary

```bash
# Clean up downloaded templates if we used the GitHub fallback
if [[ "$TEMPLATES_DIR" == /tmp/* ]]; then
  rm -rf "$TEMPLATES_DIR"
  echo "🧹 Cleaned up temporary templates"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Template Update Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo "1. Review updated files for placeholders ([brackets])"
echo "2. Fill in project-specific content"
echo "3. Run /validate-context to check completeness"
echo "4. Backup files saved as *.backup (delete when satisfied)"
echo ""
echo "💡 Tip: Use git diff to see exactly what changed"
```

## Important Notes

### What Gets Updated

**Structure updates:**
- Section ordering
- New sections added to templates
- Formatting improvements
- Documentation guidelines

**NOT updated (preserved):**
- Your project-specific content
- Custom sections you added
- Filled-in placeholders
- Session history

### Safety Features

1. **Backup created:** `.backup` file before any changes
2. **Interactive approval:** You choose which files to update
3. **Visual diff:** See exactly what will change
4. **Placeholder warning:** Reminds you to fill in project info

### When to Use

**Good times to update:**
- ✅ After system upgrade (/update-context-system)
- ✅ New template features you want to adopt
- ✅ Template structure improved
- ✅ Periodic maintenance (quarterly)

**Not recommended when:**
- ❌ In middle of active development
- ❌ Haven't committed recent work
- ❌ Customizations you want to preserve
- ❌ Templates working fine for your needs

### Handling Conflicts

If template changes conflict with your custom content:

1. **Review the diff carefully**
2. **Keep your backup:** `.backup` files contain original
3. **Merge manually:** Copy custom sections back after update
4. **Use git diff:** See exactly what changed
5. **Incremental approach:** Update one file at a time

### Template Path Resolution

Command tries these strategies in order:

1. `.claude/templates/` (project-local)
2. `templates/` (if in repo root)
3. `../../templates/` (relative to commands dir)
4. Download from GitHub (fallback)

**Robust:** Works regardless of installation method.

## Success Criteria

Command succeeds when:
- Templates located successfully
- Diffs shown clearly for each file
- User approves/rejects each update
- Backups created before changes
- Updated files valid and complete
- User knows next steps

**Perfect execution:**
- All templates found locally (fast)
- Clear visual diffs shown
- User makes informed decisions
- No data loss (backups work)
- Ready to continue work

## Examples

### Check for Updates (No Changes Needed)

```bash
/update-templates

> ✅ Found templates in .claude/templates/
>
> 📊 Template Comparison
> ✅ CONTEXT.md - Up to date
> ✅ STATUS.md - Up to date
> ✅ DECISIONS.md - Up to date
> ✅ SESSIONS.md - Up to date
>
> ✅ All context files are up to date with latest templates!
```

### Update Available (Single File)

```bash
/update-templates

> 🔄 STATUS.md - Updates available
>
> [Shows diff]
>
> Update STATUS.md with template changes? [y/N]: y
> ✅ Updated STATUS.md
> ⚠️  NOTE: Review and fill in placeholders
```

### Selective Updates (Multiple Files)

```bash
/update-templates

> 🔄 STATUS.md - Updates available
> 🔄 SESSIONS.md - Updates available
>
> Update STATUS.md? [y/N]: y
> ✅ Updated STATUS.md
>
> Update SESSIONS.md? [y/N]: n
> ⏭️  Skipped SESSIONS.md
```
