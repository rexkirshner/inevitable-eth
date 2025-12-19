---
name: add-ai-header
description: Add header file for a new AI coding tool
---

# /add-ai-header Command

**Purpose:** Add a platform-specific header file for an AI coding tool

**Multi-AI Pattern:**
This system uses platform-neutral documentation (CONTEXT.md, STATUS.md, etc.) with lightweight tool-specific header files that redirect AI tools to the shared docs.

**Common tools:** claude, cursor, aider, codex (GitHub Copilot)

## Usage

```bash
/add-ai-header [tool-name]
```

**Examples:**
```bash
/add-ai-header cursor     # Creates cursor.md
/add-ai-header aider      # Creates aider.md
/add-ai-header codex      # Creates codex.md
/add-ai-header windsurf   # Creates windsurf.md (using generic template)
```

## When to Use This Command

**Create header files for:**
- AI coding tools you actively use in this project
- New team members using different AI tools
- Multi-agent workflows with different AI systems

**Do NOT create for:**
- Tools you don't use (avoid bloat)
- Every possible AI tool "just in case"

**Philosophy:** Only create what you actually need.

## Execution Steps

### Step 0: Load Shared Functions

**ACTION:** Source the common functions library:

```bash
# Load shared utilities (v3.0.0+)
if [ -f "scripts/common-functions.sh" ]; then
  source scripts/common-functions.sh
else
  echo "⚠️  Warning: common-functions.sh not found (using legacy mode)"
fi
```

**Why this matters:** Provides access to input validation (`validate_input()`) to prevent command injection and other security issues.

---

### Step 1: Verify Context Exists

```bash
if [ ! -d "context" ]; then
  echo "❌ No context/ directory found"
  echo "Run /init-context first"
  exit 1
fi
```

### Step 2: Check if Tool Argument Provided

**ACTION:** Check command arguments

```bash
if [ -z "$1" ]; then
  echo "❌ No tool name provided"
  echo ""
  echo "Usage: /add-ai-header [tool-name]"
  echo ""
  echo "Examples:"
  echo "  /add-ai-header cursor"
  echo "  /add-ai-header aider"
  echo "  /add-ai-header codex"
  echo ""
  echo "Common tools:"
  echo "  - claude (usually created by /init-context)"
  echo "  - cursor"
  echo "  - aider"
  echo "  - codex (GitHub Copilot)"
  echo "  - windsurf"
  echo "  - [custom tool name]"
  exit 1
fi

TOOL_NAME="$1"

# Validate tool name (alphanumeric, dashes, underscores only, max 50 chars)
# This prevents command injection and path traversal attacks
if ! validate_input "$TOOL_NAME" '^[a-zA-Z0-9_-]+$' 50; then
  echo "❌ Invalid tool name"
  echo ""
  echo "Tool names must:"
  echo "  - Use only letters, numbers, dashes, and underscores"
  echo "  - Be 50 characters or less"
  echo "  - Not contain spaces or special characters"
  echo ""
  echo "Examples of valid names:"
  echo "  - cursor"
  echo "  - github-copilot"
  echo "  - my_custom_ai"
  exit 1
fi

# Normalize tool name to lowercase for comparisons
TOOL_NAME_LOWER=$(echo "$TOOL_NAME" | tr '[:upper:]' '[:lower:]')

# CLAUDE.md is special - goes at project root (auto-loaded by Claude Code)
# Other AI headers go in context/
if [ "$TOOL_NAME_LOWER" = "claude" ]; then
  TOOL_FILE="CLAUDE.md"
else
  TOOL_FILE="context/${TOOL_NAME}.md"
fi
```

### Step 3: Check if Header Already Exists

```bash
if [ -f "$TOOL_FILE" ]; then
  echo "⚠️  $TOOL_FILE already exists"
  echo ""
  read -p "Overwrite? [y/N]: " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 0
  fi
fi
```

### Step 4: Determine Template to Use

**ACTION:** Check if we have a specific template for this tool

**Known tools with templates:**
- claude → CLAUDE.md.template (placed at project root, auto-loaded)
- cursor → cursor.md.template
- aider → aider.md.template
- codex → codex.md.template

**Unknown tools:** Use generic-ai-header.template.md and substitute tool name

```bash
TEMPLATE_FILE=""
TOOL_NAME_LOWER=$(echo "$TOOL_NAME" | tr '[:upper:]' '[:lower:]')

case "$TOOL_NAME_LOWER" in
  claude)
    TEMPLATE_FILE="templates/CLAUDE.md.template"
    ;;
  cursor)
    TEMPLATE_FILE="templates/cursor.md.template"
    ;;
  aider)
    TEMPLATE_FILE="templates/aider.md.template"
    ;;
  codex)
    TEMPLATE_FILE="templates/codex.md.template"
    ;;
  *)
    TEMPLATE_FILE="templates/generic-ai-header.template.md"
    echo "ℹ️  No specific template for '$TOOL_NAME', using generic template"
    ;;
esac
```

### Step 5: Create Header File

**ACTION:** Copy template and customize if needed

```bash
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ Template not found: $TEMPLATE_FILE"
  echo "Please ensure AI Context System is properly installed"
  exit 1
fi

# Copy template
cp "$TEMPLATE_FILE" "$TOOL_FILE"

# If using generic template, substitute tool name
if [ "$TEMPLATE_FILE" = "templates/generic-ai-header.template.md" ]; then
  # Capitalize first letter of tool name
  TOOL_NAME_DISPLAY="$(tr '[:lower:]' '[:upper:]' <<< ${TOOL_NAME:0:1})${TOOL_NAME:1}"

  # Replace placeholder with actual tool name
  sed -i '' "s/\[AI Tool Name\]/$TOOL_NAME_DISPLAY/g" "$TOOL_FILE"
fi
```

### Step 6: Update .context-config.json

**ACTION:** Add new header file to aiHeaders array in config

```bash
if [ -f "context/.context-config.json" ]; then
  # Check if aiHeaders array exists, if not create it
  if ! jq -e '.documentation.aiHeaders' context/.context-config.json > /dev/null 2>&1; then
    # Add aiHeaders array
    jq '.documentation.aiHeaders = []' context/.context-config.json > context/.context-config.json.tmp
    mv context/.context-config.json.tmp context/.context-config.json
  fi

  # Add this header file if not already present
  if ! jq -e --arg file "${TOOL_NAME}.md" '.documentation.aiHeaders | index($file)' context/.context-config.json > /dev/null 2>&1; then
    jq --arg file "${TOOL_NAME}.md" '.documentation.aiHeaders += [$file]' context/.context-config.json > context/.context-config.json.tmp
    mv context/.context-config.json.tmp context/.context-config.json
    echo "✅ Added ${TOOL_NAME}.md to .context-config.json"
  fi
fi
```

### Step 7: Report Success

**ACTION:** Output summary to user

```
✅ AI Header File Created

**File:** context/[TOOL_NAME].md
**Size:** 7 lines (lightweight entry point)
**Points to:** CONTEXT.md (platform-neutral documentation)

**Pattern:**
All AI tools use the same platform-neutral documentation:
- CONTEXT.md - Project orientation
- STATUS.md - Current state
- DECISIONS.md - Decision log
- SESSIONS.md - History

**Header files (tool-specific entry points):**
[List all *.md files in context/ that are header files]

**Next steps:**
- The header file is ready to use
- When [TOOL_NAME] reads context/[TOOL_NAME].md, it will be directed to CONTEXT.md
- No further action needed

---

💡 Tip: Only create header files for AI tools you actually use
```

## Important Notes

### Multi-AI Pattern

**Architecture:**
```
project-root/
├── CLAUDE.md        # Claude Code entry point (auto-loaded at project root)
└── context/
    ├── cursor.md    # Cursor entry point (if created)
    ├── aider.md     # Aider entry point (if created)
    ├── codex.md     # GitHub Copilot entry point (if created)
    └── CONTEXT.md   # Platform-neutral documentation (actual content)
```

All header files are 7 lines and point to the same documentation.

### When to Create Header Files

**Create for:**
- ✅ AI tools you actively use
- ✅ Team members using different tools
- ✅ Multi-agent workflows

**Don't create for:**
- ❌ Every possible tool "just in case"
- ❌ Tools you tried once and don't use
- ❌ Future tools you might use someday

**Rule:** Create when needed, not preemptively.

### Supported Tools

**With dedicated templates:**
- claude (Claude/Claude Code)
- cursor (Cursor IDE)
- aider (Aider CLI)
- codex (GitHub Copilot)

**Any other tool:**
- Uses generic template
- Tool name substituted automatically
- Same 7-line format

### File Format

All AI header files follow the same pattern:

```markdown
# [Tool Name] Context

**📍 Start here:** [CONTEXT.md](./CONTEXT.md)

This project uses the AI Context System v3.0. All documentation is in platform-neutral markdown files.

**Quick start:** [STATUS.md](./STATUS.md) → Active Tasks → Begin working
```

**That's it.** 7 lines total. Lightweight entry point that redirects to shared docs.

## Success Criteria

Command succeeds when:
- Header file created in context/
- Points to CONTEXT.md
- Follows 7-line format
- Added to .context-config.json aiHeaders array
- User knows the file is ready to use

**Perfect execution:**
- Quick and painless
- File is ready immediately
- Clear output showing what was created
- Multi-AI pattern is preserved

---

**Version:** 3.6.0
**Updated:** v3.0.0 - Multi-AI support and real-world feedback improvements (git push protection, smart loading, context detection)
