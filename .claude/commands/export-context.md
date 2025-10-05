---
name: export-context
description: Export all context documentation to single markdown file
---

# /export-context Command

Generate a single comprehensive markdown file combining all context documentation. Perfect for sharing, backup, or offline reference.

## When to Use This Command

- Sharing project context with team members
- Creating project handoff documentation
- Backup before major changes
- Generating offline reference
- Creating project summary for stakeholders
- Onboarding new developers

## What This Command Does

1. Combines all context/*.md files into one document
2. Maintains proper structure and headings
3. Adds table of contents
4. Includes metadata (version, date, file count)
5. Outputs to `context-export-[DATE].md`
6. Reports file size and sections included

## Execution Steps

### Step 1: Verify Context Exists

```bash
if [ ! -d "context" ]; then
  echo "❌ No context/ directory found"
  echo "Run /init-context or /migrate-context first"
  exit 1
fi
```

### Step 2: Collect Documentation Files

Gather all markdown files in order:

```bash
# Core documentation files (in logical order)
FILES=(
  "context/CLAUDE.md"
  "context/PRD.md"
  "context/ARCHITECTURE.md"
  "context/CODE_STYLE.md"
  "context/DECISIONS.md"
  "context/KNOWN_ISSUES.md"
  "context/SESSIONS.md"
  "context/tasks/next-steps.md"
  "context/tasks/todo.md"
)

# Additional files if they exist
for file in context/*.md; do
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
**System Version:** [Claude Context System version]

**Included Sections:**
- Developer Guide (CLAUDE.md)
- Product Requirements (PRD.md)
- Architecture (ARCHITECTURE.md)
- Code Style (CODE_STYLE.md)
- Technical Decisions (DECISIONS.md)
- Known Issues (KNOWN_ISSUES.md)
- Session History (SESSIONS.md)
- Next Steps (tasks/next-steps.md)
- Current Todos (tasks/todo.md)
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

1. [Developer Guide](#developer-guide)
   - [Project Overview](#project-overview)
   - [Working with You](#working-with-you)
   - [Core Development Methodology](#core-development-methodology)

2. [Product Requirements](#product-requirements)
   - [Executive Summary](#executive-summary)
   - [Technical Stack](#technical-stack)

3. [Architecture](#architecture)
   - [High-Level Overview](#high-level-overview)
   - [System Components](#system-components)

4. [Code Style](#code-style)
   - [Core Principles](#core-principles)
   - [Language Conventions](#language-conventions)

5. [Technical Decisions](#technical-decisions)

6. [Known Issues](#known-issues)
   - [Blocking Issues](#blocking-issues)
   - [Non-Critical Issues](#non-critical-issues)

7. [Session History](#session-history)

8. [Next Steps](#next-steps)

9. [Current Todos](#current-todos)

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

**Exported by:** Claude Context System v[VERSION]
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

### Step 7: Write Export File

```bash
# Generate filename with timestamp
EXPORT_FILE="context-export-$(date +%Y%m%d-%H%M%S).md"

# Write combined content
cat export.md > "$EXPORT_FILE"

# Get file size
SIZE=$(du -h "$EXPORT_FILE" | cut -f1)

echo "✅ Export complete: $EXPORT_FILE ($SIZE)"
```

### Step 8: Generate Report

```markdown
✅ Context Export Complete

**Output File:**
`context-export-20251004-143022.md`

**Statistics:**
- File size: 156 KB
- Sections: 9 core + 2 additional
- Session count: 23
- Last session: 2025-10-04

**Included:**
- ✅ CLAUDE.md (Developer Guide)
- ✅ PRD.md (Product Requirements)
- ✅ ARCHITECTURE.md (Technical Design)
- ✅ CODE_STYLE.md (Coding Standards)
- ✅ DECISIONS.md (Decision Log)
- ✅ KNOWN_ISSUES.md (Issue Tracking)
- ✅ SESSIONS.md (Session History)
- ✅ tasks/next-steps.md (Action Items)
- ✅ tasks/todo.md (Current Todos)
- ✅ DEPLOYMENT.md (Additional)
- ✅ CLOUDFLARE_DEPLOYMENT.md (Additional)

**Table of Contents:**
- Auto-generated with 47 sections
- All headings linked

**Format:**
- GitHub-flavored Markdown
- Source markers for each section
- Complete self-contained reference

**Use Cases:**
- Share with team: Email or Slack the file
- Backup: Store in safe location
- Offline reference: Read without context/ folder
- Onboarding: Send to new team members
- Documentation: Include in project wiki

**Next Steps:**
- Review export for completeness
- Share with stakeholders if needed
- Store for backup/archival
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
Only CLAUDE.md, PRD.md, ARCHITECTURE.md (core reference)

### Recent Only (future enhancement)
```
/export-context --recent
```
Excludes old session history, keeps last 10 sessions

## Important Notes

### What's Included
- All .md files in context/
- All .md files in context/tasks/
- Proper formatting and structure
- Source file markers
- Table of contents
- Export metadata

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
