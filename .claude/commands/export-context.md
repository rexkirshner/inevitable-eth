---
name: export-context
description: Export all context documentation to single markdown file
---

# /export-context Command

Generate a comprehensive export package combining all context documentation in both Markdown and JSON formats. Perfect for sharing, backup, multi-agent workflows, or offline reference.

## When to Use This Command

- Sharing project context with team members
- Creating project handoff documentation
- Backup before major changes
- Generating offline reference
- Creating project summary for stakeholders
- Onboarding new developers
- **Multi-agent workflows** (JSON format for automation)
- **External tooling integration** (structured data)

## What This Command Does

1. Combines all context/*.md files into one document
2. Exports machine-readable JSON (.sessions-data.json)
3. Bundles both formats into export package
4. Maintains proper structure and headings
5. Adds table of contents
6. Includes metadata (version, date, file count)
7. Outputs to `context-export-[DATE]/` directory
8. Reports file size and sections included

## Execution Steps

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

### Step 1: Verify Context Exists

```bash
if [ ! -d "$CONTEXT_DIR" ]; then
  echo "❌ No context/ directory found"
  echo "Run /init-context or /migrate-context first"
  exit 1
fi
```

### Step 1.5: Export JSON for Multi-Agent Workflows

**ACTION:** First, ensure we have the latest JSON export:

```bash
echo "📊 Exporting session data to JSON..."
./scripts/export-sessions-json.sh
```

This creates `context/.sessions-data.json` with structured session history.

### Step 2: Create Export Directory

**ACTION:** Create timestamped export directory:

```bash
EXPORT_DIR="context-export-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EXPORT_DIR"

echo "📁 Export directory: $EXPORT_DIR"
```

### Step 3: Collect Documentation Files

Gather all markdown files in order:

```bash
# Core documentation files (in logical order)
FILES=(
  "$CONTEXT_DIR/CONTEXT.md"          # or CLAUDE.md for pre-v2.0
  "$CONTEXT_DIR/STATUS.md"            # v2.0+ single source of truth
  "$CONTEXT_DIR/STATUS.md (includes Quick Reference)"         # v2.0+ auto-generated dashboard
  "$CONTEXT_DIR/DECISIONS.md"
  "$CONTEXT_DIR/SESSIONS.md"
  "$CONTEXT_DIR/PRD.md"               # optional
  "$CONTEXT_DIR/ARCHITECTURE.md"      # optional
  "$CONTEXT_DIR/CODE_STYLE.md"        # optional
  "$CONTEXT_DIR/KNOWN_ISSUES.md"      # optional
)

# Support both v1.x and v2.0 structures
if [ -f "$CONTEXT_DIR/CLAUDE.md" ] && [ ! -f "$CONTEXT_DIR/CONTEXT.md" ]; then
  FILES[0]="$CONTEXT_DIR/CLAUDE.md"
fi

# Additional files if they exist
for file in $CONTEXT_DIR/*.md; do
  if [ -f "$file" ] && ! echo "${FILES[@]}" | grep -q "$file"; then
    FILES+=("$file")
  fi
done
```

### Step 3: Generate Export Metadata

Create header with project information:

```markdown
# [Project Name] - Context Export

**Generated:** [YYYY-MM-DD HH:MM:SS]
**Version:** [from .context-config.json]
**System Version:** [AI Context System version]

**Included Sections:**
- Project Orientation (CONTEXT.md)
- Current Status (STATUS.md)
- Quick Reference (STATUS.md (includes Quick Reference))
- Decision Log (DECISIONS.md)
- Session History (SESSIONS.md)
- Product Requirements (PRD.md, if exists)
- Architecture (ARCHITECTURE.md, if exists)
- Code Style (CODE_STYLE.md, if exists)
[+ X additional files]

**Statistics:**
- Total Files: X
- Total Size: XX KB
- Session Count: XX
- Last Updated: [from latest session]

---
```

### Step 4: Generate Table of Contents

Create clickable TOC with all sections:

```markdown
## Table of Contents

1. [Project Orientation](#project-orientation)
   - [Project Overview](#project-overview)
   - [Working with You](#working-with-you)
   - [Core Development Methodology](#core-development-methodology)

2. [Current Status](#current-status)
   - [Current Phase](#current-phase)
   - [Recent Work](#recent-work)
   - [Next Steps](#next-steps)

3. [Quick Reference](#quick-reference)
   - [Project Dashboard](#project-dashboard)
   - [Key Metrics](#key-metrics)

4. [Decision Log](#decision-log)
   - [Recent Decisions](#recent-decisions)
   - [Decision Rationale](#decision-rationale)

5. [Session History](#session-history)
   - [Recent Sessions](#recent-sessions)
   - [Session Index](#session-index)

6. [Product Requirements](#product-requirements) (if exists)
   - [Executive Summary](#executive-summary)
   - [Technical Stack](#technical-stack)

7. [Architecture](#architecture) (if exists)
   - [High-Level Overview](#high-level-overview)
   - [System Components](#system-components)

---
```

### Step 5: Combine Documentation Files

For each file, add with proper formatting:

```bash
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "" >> export.md
    echo "---" >> export.md
    echo "" >> export.md

    # Add file marker
    echo "<!-- Source: $file -->" >> export.md
    echo "" >> export.md

    # Add content (strip first H1 if present)
    tail -n +2 "$file" >> export.md

    echo "" >> export.md
  fi
done
```

**Processing rules:**
- Remove duplicate H1 headings
- Preserve all other content exactly
- Add source file markers as HTML comments
- Maintain proper spacing between sections

### Step 6: Add Footer

```markdown
---

## Export Information

**Exported by:** AI Context System v[VERSION]
**Export Date:** [YYYY-MM-DD HH:MM:SS]
**Format:** Markdown (GitHub-flavored)
**Source:** context/ directory

### Regenerating This Export

To create a fresh export:
```bash
/export-context
```

### Importing Into New Project

To use this export to initialize a new project:
1. Copy relevant sections to new project
2. Run /init-context in new project
3. Update with project-specific information

---

*Generated with [Claude Code](https://claude.com/claude-code)*
```

### Step 7: Write Export Files

```bash
# Write markdown export
cat export.md > "$EXPORT_DIR/README.md"

# Copy JSON export
cp context/.sessions-data.json "$EXPORT_DIR/sessions-data.json" 2>/dev/null || echo "⚠️  No JSON export found (run /save-context first)"

# Copy config for reference
cp context/.context-config.json "$EXPORT_DIR/context-config.json" 2>/dev/null || true

# Get file sizes
MD_SIZE=$(du -h "$EXPORT_DIR/README.md" | cut -f1)
JSON_SIZE=$(du -h "$EXPORT_DIR/sessions-data.json" 2>/dev/null | cut -f1 || echo "N/A")
TOTAL_SIZE=$(du -sh "$EXPORT_DIR" | cut -f1)

echo "✅ Export complete: $EXPORT_DIR"
echo "   Markdown: $MD_SIZE"
echo "   JSON: $JSON_SIZE"
echo "   Total: $TOTAL_SIZE"
```

### Step 8: Generate Report

```markdown
✅ Context Export Complete

**Output Directory:**
`context-export-20251004-143022/`

**Files Included:**
- 📄 README.md - Complete documentation export (156 KB)
- 📊 sessions-data.json - Machine-readable session history (23 KB)
- ⚙️  context-config.json - Project configuration

**Statistics:**
- Total size: 182 KB
- Markdown sections: 9 core + 2 additional
- JSON session count: 23
- Last session: 2025-10-04

**Markdown Export (README.md):**
- ✅ CONTEXT.md (Developer Guide)
- ✅ STATUS.md (Current Status)
- ✅ DECISIONS.md (Decision Log)
- ✅ SESSIONS.md (Session History)
- ✅ STATUS.md (includes Quick Reference) (Quick Reference)
- ✅ PRD.md (Product Requirements, if exists)
- ✅ ARCHITECTURE.md (Technical Design, if exists)
- ✅ [Additional .md files]

**JSON Export (sessions-data.json):**
- Structured session history
- Mental models and decision rationale
- Problem-solving approaches
- File changes and TodoWrite state
- Perfect for multi-agent workflows

**Table of Contents:**
- Auto-generated with 47 sections
- All headings linked

**Formats:**
- 📄 Markdown: GitHub-flavored, human-readable
- 📊 JSON: Machine-readable, schema-validated
- Complete self-contained reference

**Use Cases:**
- **Team sharing:** Email or Slack the directory
- **Backup:** Store in safe location
- **Offline reference:** Read without context/ folder
- **Onboarding:** Send to new team members
- **Multi-agent workflows:** Other AI agents can consume JSON
- **External tooling:** Analytics, automation, QA systems
- **Documentation:** Include in project wiki

**Next Steps:**
- Review export for completeness
- Share with stakeholders if needed
- Store for backup/archival
- Use JSON for automation/analytics
```

## Export Options

### Default Export
```
/export-context
```
Includes everything, full table of contents

### Minimal Export (future enhancement)
```
/export-context --minimal
```
Only CONTEXT.md, STATUS.md, DECISIONS.md (core reference)

### Recent Only (future enhancement)
```
/export-context --recent
```
Excludes old session history, keeps last 10 sessions

## Important Notes

### What's Included
- All .md files in context/
- Proper formatting and structure
- Source file markers
- Table of contents
- Export metadata
- Both v1.x and v2.0 file structures supported

### What's Excluded
- .context-config.json (contains personal preferences)
- artifacts/ folder (code reviews, lighthouse, etc.)
- Hidden files
- Binary files

### File Size
- Typical export: 50-200 KB
- Large projects (100+ sessions): Up to 1-2 MB
- Compressed well (gzip reduces ~70%)

### Format Notes
- GitHub-flavored Markdown
- All internal links preserved
- Code blocks maintain syntax highlighting
- Tables formatted properly
- HTML comments for source tracking

## Use Cases

### Team Handoff
```
# Before leaving project
/save-context
/export-context

# Send export file to team
# They can reference entire context in one file
```

### Backup Before Refactor
```
/save-context
/export-context
# Store export with timestamp
# Proceed with refactoring
```

### Stakeholder Summary
```
/export-context
# Edit export to add executive summary
# Remove sensitive sections if needed
# Share with stakeholders
```

### Offline Development
```
/export-context
# Copy to laptop
# Work offline with full context
# Sync back when online
```

## Success Criteria

Export succeeds when:
- Single markdown file generated
- All context files included
- Table of contents complete
- Proper formatting maintained
- File size reasonable
- Report shows all sections

**Perfect export:**
- Complete documentation in one file
- Easy to read and navigate
- Shareable and portable
- Maintains all context
- Self-contained reference
