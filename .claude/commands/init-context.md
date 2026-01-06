---
name: init-context
description: Initialize AI Context System for this project
---

# /init-context Command

Initialize a **minimal overhead** context system for this project. Creates 5 core files (CONTEXT.md, STATUS.md, DECISIONS.md, SESSIONS.md, context-feedback.md) plus CLAUDE.md at project root (auto-loaded by Claude Code), with optional files (CODE_MAP.md, other AI headers) suggested when complexity demands.

**Philosophy:** Minimal overhead during work. Good-enough recovery when needed. Single source of truth. Platform-neutral core with tool-specific entry points.

**See also:**
- `.claude/docs/command-philosophy.md` for core principles

## What This Command Does

Creates **5 core files + 1 AI header** that serve dual purpose (developer productivity + AI agent review/takeover):
1. **CLAUDE.md** - AI entry point (auto-loaded by Claude Code, contains critical rules and project context)
2. **CONTEXT.md** - Orientation (rarely changes: who/what/how/why, platform-neutral)
3. **STATUS.md** - Current state with auto-generated Quick Reference at top
4. **DECISIONS.md** - Decision log (WHY choices made - critical for AI agents)
5. **SESSIONS.md** - History (structured, comprehensive, append-only with mandatory TL;DR)
6. **context-feedback.md** - Feedback log (bugs, improvements, questions)

Optional files (CODE_MAP.md, cursor.md, aider.md, PRD.md, ARCHITECTURE.md) suggested when complexity demands.

## Why These 6 Files?

**The Dual Purpose:**
1. **Session continuity** - Resume work seamlessly
2. **AI agent review/takeover** - Enable AI to understand WHY, review code, take over development

**Real-world feedback revealed:**
- System isn't just for you - it's for AI agents reviewing and improving your work
- AI agents need to understand WHY decisions were made, not just WHAT code exists
- TodoWrite for productivity during work, rich docs for AI at save points
- DECISIONS.md is critical - AI needs rationale, constraints, tradeoffs

**v2.1.0 approach:**
- CLAUDE.md at project root (auto-loaded by Claude Code)
- CONTEXT.md for orientation (platform-neutral, ~300 lines)
- STATUS.md for current state (with auto-generated Quick Reference section)
- **DECISIONS.md for rationale (AI agents understand WHY)**
- SESSIONS.md structured + comprehensive (mental models, mandatory TL;DR, git operations auto-logged)
- Optional: CODE_MAP.md (only if project complexity demands)
- Optional: Other AI headers (cursor.md, aider.md) for multi-tool teams
- Optional: PRD/ARCHITECTURE when complexity demands

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

**Why this matters:** Provides access to input validation (`validate_input()`), progress indicators, and error handling.

---

### Step 0.1: Detect Project Maturity (Auto-Route to Correct Command)

**ACTION:** Check if project has existing documentation. If yes, suggest /migrate-context instead.

```bash
echo "🔍 Checking project maturity..."
echo ""

# Detect existing documentation files
EXISTING_DOCS=()

# Common documentation files
[ -f "README.md" ] && [ -s "README.md" ] && EXISTING_DOCS+=("README.md")
[ -f "ARCHITECTURE.md" ] && EXISTING_DOCS+=("ARCHITECTURE.md")
[ -f "CONTRIBUTING.md" ] && EXISTING_DOCS+=("CONTRIBUTING.md")
[ -f "docs/architecture.md" ] && EXISTING_DOCS+=("docs/architecture.md")
[ -f "docs/README.md" ] && EXISTING_DOCS+=("docs/README.md")

# Check for docs directory with content
if [ -d "docs/" ] && [ "$(find docs/ -type f -name '*.md' 2>/dev/null | head -1)" ]; then
  EXISTING_DOCS+=("docs/ directory (with markdown files)")
fi

# Check for existing architecture/design docs
[ -f "DESIGN.md" ] && EXISTING_DOCS+=("DESIGN.md")
[ -f "PRD.md" ] && EXISTING_DOCS+=("PRD.md")
[ -f "ROADMAP.md" ] && EXISTING_DOCS+=("ROADMAP.md")

# If project has 2+ significant docs, suggest migration
if [ ${#EXISTING_DOCS[@]} -ge 2 ]; then
  echo "⚠️  Detected existing documentation:"
  for doc in "${EXISTING_DOCS[@]}"; do
    echo "   📄 $doc"
  done
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔀 WRONG COMMAND DETECTED"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "This project has existing documentation."
  echo "You should use /migrate-context instead of /init-context"
  echo ""
  echo "📌 Difference:"
  echo "   /init-context    - Creates fresh templates (for NEW projects)"
  echo "   /migrate-context - Preserves existing docs (for MATURE projects)"
  echo ""
  echo "Options:"
  echo "  [Y] Switch to /migrate-context (recommended)"
  echo "  [n] Continue with /init-context (will ignore existing docs)"
  echo ""
  read -p "Switch to /migrate-context? [Y/n] " -r
  echo ""

  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "✅ Switching to /migrate-context..."
    echo ""
    # Note: In actual execution, use: claude /migrate-context
    exit 0
  else
    echo "⚠️  Continuing with /init-context (existing docs will be ignored)"
    echo ""
  fi
elif [ ${#EXISTING_DOCS[@]} -eq 1 ]; then
  echo "ℹ️  Found 1 documentation file: ${EXISTING_DOCS[0]}"
  echo "   Proceeding with /init-context (you can manually migrate later)"
  echo ""
else
  echo "✅ No existing documentation detected"
  echo "   /init-context is the correct command"
  echo ""
fi
```

**Why this matters:** Prevents users from accidentally choosing the wrong command. /init-context creates fresh templates and ignores existing docs, while /migrate-context preserves and organizes them.

**Threshold:** 2+ significant documentation files triggers the warning (not just a basic README).

---

### Step 0.5: Verify Working Directory and .claude Location

**CRITICAL:** Check for multiple .claude directories in the path. This causes conflicts (except for meta-projects).

```bash
# Get absolute path to current directory
CURRENT_DIR=$(pwd)
echo "Working directory: $CURRENT_DIR"

# Check parent directories up to 3 levels for .claude
PARENT_CLAUDE=$(find "$CURRENT_DIR/.." -maxdepth 2 -name ".claude" 2>/dev/null | grep -v "$CURRENT_DIR/.claude" || echo "")

if [ -n "$PARENT_CLAUDE" ]; then
  # Check if parent is a meta-project
  PARENT_DIR=$(dirname "$PARENT_CLAUDE")
  IS_META_PROJECT=false

  if [ -f "$PARENT_DIR/context/.context-config.json" ]; then
    # Check if project type is "meta-project"
    if command -v jq &> /dev/null; then
      PROJECT_TYPE=$(jq -r '.project.type // ""' "$PARENT_DIR/context/.context-config.json" 2>/dev/null)
      if [ "$PROJECT_TYPE" = "meta-project" ]; then
        IS_META_PROJECT=true
      fi
    else
      # Fallback: Check if "meta-project" string exists in config
      if grep -q '"type".*"meta-project"' "$PARENT_DIR/context/.context-config.json" 2>/dev/null; then
        IS_META_PROJECT=true
      fi
    fi
  fi

  if [ "$IS_META_PROJECT" = "true" ]; then
    echo ""
    echo "ℹ️  Note: Parent directory is a meta-project"
    echo ""
    echo "Parent: $PARENT_DIR (meta-project managing multiple repos)"
    echo "Current: $CURRENT_DIR (sub-repository)"
    echo ""
    echo "✅ This is a valid configuration."
    echo "Meta-projects intentionally have .claude at parent level to manage sub-repos."
    echo ""
  else
    # Original warning for non-meta-projects
    echo ""
    echo "⚠️  WARNING: Multiple .claude directories detected!"
    echo ""
    echo "Current project: $CURRENT_DIR/.claude"
    echo "Parent folder(s): $PARENT_CLAUDE"
    echo ""
    echo "❌ PROBLEM: Claude Code may use the wrong .claude directory"
    echo "This causes commands to be loaded from the parent instead of this project."
    echo ""
    echo "✅ SOLUTION: Only keep .claude in the actual project root"
    echo "Remove .claude from parent folders that aren't projects themselves."
    echo ""
    echo "Recommended action:"
    echo "  1. If parent folder is NOT a project: rm -rf <parent>/.claude"
    echo "  2. If parent folder IS a meta-project: Configure as type=\"meta-project\""
    echo "  3. If parent folder IS a project: Move this project out of it"
    echo ""
    read -p "Continue anyway? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Cancelled. Please resolve .claude directory conflicts first."
      exit 1
    fi
  fi
fi
```

### Step 1: Check Existing Context

```
Check if context/ folder already exists:
- If exists: Warn user and ask if they want to reinitialize
- If not: Proceed to Step 2
```

### Step 2: Analyze Project

Gather information about the project:

**File System Analysis:**
- Run `ls -la` to see root structure
- Check for package.json, Cargo.toml, go.mod, requirements.txt, etc.
- Identify project type (web app, CLI, library, API, etc.)
- Find README.md if exists

**Git Analysis (if git repo):**
- Run `git log --oneline -10` for recent history
- Run `git remote -v` to find repo URL
- Check current branch with `git branch --show-current`

**Technology Stack:**
- Read package.json for Node.js projects
- Read Cargo.toml for Rust projects
- Read go.mod for Go projects
- Read requirements.txt for Python projects
- Identify framework (Next.js, React, Express, etc.)

### Step 3: Create Minimal Folder Structure

Create only what we need right now:

```bash
mkdir -p context
mkdir -p docs/audits/archive  # v4.0.0 audit system
mkdir -p artifacts/lighthouse
mkdir -p artifacts/performance
mkdir -p artifacts/security
mkdir -p artifacts/bundle-analysis
mkdir -p artifacts/coverage
```

### Step 4: Generate Core Documentation Files

Create the **4 core files + 1 AI header** from templates:

**ACTION:** Create all 5 core files + 1 AI header in `context/` directory:

```bash
log_info "Creating core documentation files in context/ directory..."

# 1. CLAUDE.md at project root (auto-loaded by Claude Code)
# v3.6.1: Auto-migrate from old location (non-interactive)
if [ -f "context/claude.md" ] && [ ! -f "CLAUDE.md" ]; then
  # Auto-migrate - no prompt needed
  log_info "📦 Migrating CLAUDE.md to project root..."
  mv "context/claude.md" "CLAUDE.md"
  log_success "✅ Moved context/claude.md → ./CLAUDE.md"
  log_info "   💡 CLAUDE.md is now auto-loaded by Claude Code at conversation start"
  log_info "   Review ./CLAUDE.md - v3.6.1 template has updated sections"
elif [ ! -f "CLAUDE.md" ]; then
  cp templates/CLAUDE.md.template CLAUDE.md
  log_success "✅ Created CLAUDE.md (project root - auto-loaded by Claude Code)"
else
  log_verbose "CLAUDE.md already exists, skipping"
  # Warn if old location also exists (user must resolve manually)
  if [ -f "context/claude.md" ]; then
    log_info "⚠️  Both ./CLAUDE.md and context/claude.md exist"
    log_info "   Review context/claude.md for unique content, then: rm context/claude.md"
  fi
fi

# 2. CONTEXT.md - Orientation (analyze project and customize from template)
if [ ! -f "context/CONTEXT.md" ]; then
  cp templates/CONTEXT.template.md context/CONTEXT.md
  log_success "✅ Created context/CONTEXT.md"
  log_info "   📝 Customize with project details (analyze package.json, README, git history)"
else
  log_verbose "CONTEXT.md already exists, skipping"
fi

# 3. STATUS.md - Current state
if [ ! -f "context/STATUS.md" ]; then
  cp templates/STATUS.template.md context/STATUS.md
  log_success "✅ Created context/STATUS.md"
  log_info "   📝 Quick Reference section will be auto-generated from .context-config.json"
else
  log_verbose "STATUS.md already exists, skipping"
fi

# 4. DECISIONS.md - Decision log
if [ ! -f "context/DECISIONS.md" ]; then
  cp templates/DECISIONS.template.md context/DECISIONS.md
  log_success "✅ Created context/DECISIONS.md"
  log_info "   📝 Critical for AI agents - documents WHY choices were made"
else
  log_verbose "DECISIONS.md already exists, skipping"
fi

# 5. SESSIONS.md - History
if [ ! -f "context/SESSIONS.md" ]; then
  cp templates/SESSIONS.template.md context/SESSIONS.md
  log_success "✅ Created context/SESSIONS.md"
  log_info "   📝 Document this initialization session with mandatory TL;DR"
else
  log_verbose "SESSIONS.md already exists, skipping"
fi

# 6. Feedback log (v2.3.1+)
if [ ! -f "context/context-feedback.md" ]; then
  cp templates/context-feedback.template.md context/context-feedback.md
  log_success "✅ Created context/context-feedback.md"
else
  log_verbose "Feedback file already exists, skipping"
fi
```

**What each file contains:**

**./CLAUDE.md** - AI entry point (auto-loaded by Claude Code)
- Contains critical rules, project identity, working style, session management
- **Auto-loaded at every conversation start - prime real estate for essential context**

**context/CONTEXT.md** - Orientation (platform-neutral, ~300 lines)
- Project overview (from README or git description)
- **"Getting Started Path"** with 5-min and 30-min orientations
- Tech stack (from package analysis)
- High-level architecture with links to DECISIONS.md for details
- Development workflow and principles
- Environment setup
- **Communication preferences and workflow rules**
- **References other files for current work** (no duplication)

**context/STATUS.md** - Current state with auto-generated Quick Reference
- **Quick Reference section (auto-generated, DO NOT edit manually)**
  - Project info, URLs, tech stack from .context-config.json
  - Current phase, active tasks, status indicator
  - Documentation health from validation
- Current phase/focus
- Active tasks (checkboxes)
- Work in progress
- Recent accomplishments
- Next session priorities
- **Single source of truth for "what's happening now"**

**context/DECISIONS.md** - Decision log (critical for AI agents)
- Initialize with template and "Guidelines for AI Agents" section
- Empty active decisions table ready for use
- Example decision showing proper format
- **Critical for AI agents to understand WHY choices were made**

**context/SESSIONS.md** - History (structured, comprehensive)
- First entry documenting initialization (with mandatory TL;DR)
- Session index table
- Template for future entries (TL;DR, accomplishments, git operations, tests)
- **Mandatory TL;DR ensures perfect continuity**

**context/context-feedback.md** - Feedback log (v2.3.1+)
- Structured feedback collection for system improvements
- Template for bugs, improvements, questions, feature requests
- Archived on `/update-context-system` (if has content)
- **Helps make AI Context System better for everyone**

### Step 4.5: Detect System Version

**ACTION:** Detect the current system version from the VERSION file for accurate config initialization:

```bash
echo "🔍 Detecting system version..."
SYSTEM_VERSION=$(cat VERSION 2>/dev/null || echo "unknown")
echo "   System version: $SYSTEM_VERSION"
```

**Why this matters:** Ensures the configuration file reflects the actual installed version, preventing version mismatch confusion.

---

### Step 5: Create Configuration

**ACTION:** Use the Bash tool to copy the template config and update placeholders:

```bash
# Download the latest config template from GitHub
curl -sL https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/config/.context-config.template.json -o context/.context-config.json

# Update version fields to match system version
if [ "$SYSTEM_VERSION" != "unknown" ]; then
  # macOS uses different sed syntax than Linux
  # Use regex to match any semver pattern (handles template version changes)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
    sed -i '' "s/\"configVersion\": \"[^\"]*\"/\"configVersion\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
  else
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
    sed -i "s/\"configVersion\": \"[^\"]*\"/\"configVersion\": \"$SYSTEM_VERSION\"/g" context/.context-config.json
  fi
  echo "✅ Configuration created with version $SYSTEM_VERSION"
else
  echo "⚠️  VERSION file not found - using template version"
fi

# Update placeholders (project name, owner, dates)
# Use Read tool to get current config, then Edit tool to replace placeholders with actual values
```

**IMPORTANT:** You MUST:
1. Use Read tool to read `context/.context-config.json`
2. Use Edit tool to replace ALL placeholders:
   - `[Your Name]` → actual owner name
   - `[Project Name]` → actual project name
   - `[web-app|cli|library|api]` → actual project type
   - `[YYYY-MM-DD]` → today's date

### Step 6: Optional Enhancements

**ACTION:** Prompt user for optional files based on project complexity

#### 6.1: CODE_MAP.md (Optional)

**Evaluate adoption criteria:**

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Optional: CODE_MAP.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "CODE_MAP.md helps navigate code in complex projects."
echo ""
echo "Answer these questions:"
echo ""
echo "1. Project has >20 files across multiple directories? [y/N]"
read -n 1 HAS_SIZE
echo ""

echo "2. Multiple developers or frequent AI agent handoffs? [y/N]"
read -n 1 HAS_TEAM
echo ""

echo "3. Clear separation (services, functions, components)? [y/N]"
read -n 1 HAS_STRUCTURE
echo ""

echo "4. Finding code takes >5 minutes? [y/N]"
read -n 1 HAS_PAIN
echo ""

# Count yes answers
SCORE=0
[[ $HAS_SIZE =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_TEAM =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_STRUCTURE =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_PAIN =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))

echo ""
if [ $SCORE -eq 0 ] || [ $SCORE -eq 1 ]; then
  echo "📊 Score: $SCORE/4 - CODE_MAP not recommended for this project size"
  echo "You can add it later with /add-code-map if needed"
elif [ $SCORE -eq 2 ] || [ $SCORE -eq 3 ]; then
  echo "📊 Score: $SCORE/4 - CODE_MAP optional (marginal value)"
  read -p "Create CODE_MAP.md? [y/N]: " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp templates/CODE_MAP.template.md context/CODE_MAP.md
    echo "✅ Created CODE_MAP.md - customize it with your project structure"
  else
    echo "⏭️  Skipped CODE_MAP.md"
  fi
else
  echo "📊 Score: $SCORE/4 - CODE_MAP recommended for complex projects"
  read -p "Create CODE_MAP.md? [Y/n]: " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    cp templates/CODE_MAP.template.md context/CODE_MAP.md
    echo "✅ Created CODE_MAP.md - customize it with your project structure"
  else
    echo "⏭️  Skipped CODE_MAP.md"
  fi
fi
```

#### 6.2: Additional AI Headers (Optional)

**If team uses multiple AI tools:**

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 Optional: Additional AI Tool Headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Do you use other AI coding tools besides Claude? [y/N]"
read -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "Select AI tools (space-separated numbers, enter when done):"
  echo "  1. Cursor"
  echo "  2. Aider"
  echo "  3. GitHub Copilot"
  echo "  4. Other (will prompt for name)"
  echo ""
  read -p "Selection: " TOOLS

  # Create selected headers
  for tool in $TOOLS; do
    case $tool in
      1) cp templates/cursor.md.template context/cursor.md
         echo "✅ Created cursor.md" ;;
      2) cp templates/aider.md.template context/aider.md
         echo "✅ Created aider.md" ;;
      3) cp templates/codex.md.template context/codex.md
         echo "✅ Created codex.md" ;;
      4) read -p "Enter AI tool name: " CUSTOM_TOOL
         # Validate input (alphanumeric, dashes, underscores only, max 50 chars)
         if validate_input "$CUSTOM_TOOL" '^[a-zA-Z0-9_-]+$' 50; then
           /add-ai-header "$CUSTOM_TOOL"
         else
           log_error "Invalid tool name. Use letters, numbers, dashes, and underscores only."
         fi ;;
    esac
  done
else
  echo "⏭️  Skipped additional AI headers"
  echo "💡 Tip: Use /add-ai-header [tool] to add later"
fi
```

#### 6.3: ORGANIZATION.md Guidelines (Recommended)

**Create project organization guidelines:**

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Recommended: ORGANIZATION.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "ORGANIZATION.md provides project organization guidelines:"
echo "  - Folder structure philosophy (docs/, artifacts/, context/)"
echo "  - Naming conventions for historical files"
echo "  - Maintenance schedule for keeping projects clean"
echo "  - Anti-patterns to avoid (documentation sprawl)"
echo ""
echo "This helps maintain professional structure and reduces clutter."
echo ""
read -p "Create ORGANIZATION.md in project root? [Y/n]: " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Nn]$ ]]; then
  # Try to copy from reference/ first (if available from install.sh)
  if [ -f "reference/ORGANIZATION.md" ]; then
    cp reference/ORGANIZATION.md ./ORGANIZATION.md
    echo "✅ Created ORGANIZATION.md from reference"
  else
    # Download from GitHub if not in reference/
    log_info "   Downloading ORGANIZATION.md from GitHub..."
    if download_with_retry \
      "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/ORGANIZATION.md" \
      "./ORGANIZATION.md"; then
      log_success "✅ Created ORGANIZATION.md"
    else
      echo "⚠️  Could not download ORGANIZATION.md (network issue)"
      echo "   You can add it later from reference/ folder"
    fi
  fi
  echo ""
  echo "📖 Review ORGANIZATION.md for folder structure guidelines"
  echo "💡 Tip: Run /organize-docs monthly to maintain organization"
else
  echo "⏭️  Skipped ORGANIZATION.md"
  echo "💡 Tip: Copy from reference/ORGANIZATION.md later if needed"
fi
```

### Step 7: Explain Dual-Purpose Philosophy

After initialization, explain to the user:

```
✅ Context System Initialized

Created CLAUDE.md + 5 core files:
- CLAUDE.md - AI entry point (auto-loaded by Claude Code)
- context/CONTEXT.md - Orientation (platform-neutral, ~300 lines)
- context/STATUS.md - Current state (with auto-generated Quick Reference)
- context/DECISIONS.md - Decision log (WHY choices made)
- context/SESSIONS.md - History (mandatory TL;DR, auto-logged git ops)
- context/.context-config.json - Configuration

Optional files created (if selected):
- context/CODE_MAP.md - Code location guide (if complex project)
- context/[tool].md - Additional AI headers (if multi-tool team)
- ORGANIZATION.md - Project organization guidelines (recommended)

⚡ Two-Tier Workflow:

**Tier 1: Quick Updates (Most Sessions)**
Run /save at session end - 2-3 minutes
- Updates STATUS.md (current tasks, blockers, next steps)
- Auto-generates Quick Reference section in STATUS.md
- Minimal overhead, continuous work

**Tier 2: Comprehensive Documentation (Occasional)**
Run /save-full before breaks/handoffs - 10-15 minutes
- Everything /save does
- PLUS: Creates detailed SESSIONS.md entry
- PLUS: Documents mental models and decision rationale
- Use ~3-5 times per 20 sessions

**Time Investment for 20 Sessions:**
- 17× /save: ~40-50 min
- 3× /save-full: ~30-45 min
- Total: ~70-95 min (50% reduction from v1.8.0)

🎯 Philosophy:

**Within sessions:** TodoWrite for productivity (minimal overhead)
**At save points:** /save for quick state capture (2-3 min)
**Before breaks:** /save-full for comprehensive docs (10-15 min)

This system enables AI agents to:
- Review your code with full context
- Understand WHY you made decisions
- Take over development seamlessly
- Learn from your problem-solving approaches

📊 Single Source of Truth:

Each piece of information lives in ONE place:
- Current tasks → STATUS.md
- Quick reference info → STATUS.md (auto-generated section at top)
- Project overview → CONTEXT.md (platform-neutral)
- Decision rationale → DECISIONS.md
- History + mental models → SESSIONS.md (created by /save-full with mandatory TL;DR)

🤖 For AI Agents:

**DECISIONS.md is critical** - Captures WHY choices were made:
- Rationale and constraints
- Alternatives considered
- Tradeoffs accepted

**SESSIONS.md captures thinking** - AI agents learn from:
- Your mental models
- Problem-solving approaches
- Evolution of your understanding

📈 Growing Your Documentation:

When complexity demands it, I'll suggest:
- **CODE_MAP.md** → Code location guide (for complex projects)
- **PRD.md** → Product vision documentation
- **ARCHITECTURE.md** → System design documentation
- **[tool].md** → Additional AI headers (for multi-tool teams)

Next Steps:
1. Review context/CONTEXT.md for accuracy
2. Use TodoWrite during active work
3. Run /save at session end (2-3 min quick update)
4. Run /save-full before breaks/handoffs (10-15 min comprehensive)
5. Use /code-review for AI agent review when ready
6. Start coding!
```

### Step 7: Cleanup Installation Files

**IMPORTANT:** Remove the installation files that were downloaded from GitHub to keep the project clean.

**ACTION:** Use the Bash tool to remove installation directory:

```bash
# Check if we're in a nested installation (common pattern)
if [ -d "../ai-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ../ai-context-system
  echo "✅ Installation files removed"
elif [ -d "./ai-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ./ai-context-system
  echo "✅ Installation files removed"
else
  echo "⏭️  No installation files found (already clean)"
fi

# Also check for downloaded zip
if [ -f "../ai-context-system.zip" ]; then
  rm -f ../ai-context-system.zip
  echo "✅ Removed installation zip"
fi
```

## Template Content Guidelines

When filling templates, use this priority:

1. **From project files**: Use actual data from package.json, README, git
2. **Inferred from structure**: Make educated guesses from folder layout
3. **Generic placeholders**: Use `[TODO: Add ...]` for unknown info
4. **Smart defaults**: Always include standard preferences and workflow rules

## On-Demand File Creation

When `/save-context` runs, it should check if additional documentation is needed:

**Check for ARCHITECTURE.md need:**
- Project has >20 files in src/
- Multiple directories with different purposes
- Complex dependency relationships
- Ask: "Your architecture is getting complex. Should I create ARCHITECTURE.md for AI agents to understand system design?"

**Check for PRD.md need:**
- Product vision discussed multiple times
- Feature roadmap getting complex
- Ask: "Product scope is expanding. Should I create PRD.md to document vision and roadmap for AI agent context?"

**v2.0 Note:** We always create DECISIONS.md because it's critical for AI agents to understand WHY choices were made. Only ARCHITECTURE.md and PRD.md are suggested on-demand when complexity demands it.

## Important Notes

- Always include workflow preferences in CONTEXT.md
- CONTEXT.md must include "no lazy coding" and "simplicity first" rules
- Configuration must enforce "no push without approval"
- STATUS.md is single source of truth for current state
- **DECISIONS.md is critical for AI agents** - always create it
- CONTEXT.md references other files, doesn't duplicate
- SESSIONS.md uses structured format (40-60 lines with mental models)
- **Structured ≠ minimal** - AI agents need comprehensive depth
- Quick Reference section in STATUS.md is auto-generated, never edited manually
- Use bullet points and clear headings
- **Dual purpose:** developer productivity + AI agent review/takeover

## Error Handling

If errors occur:
- Report what failed clearly
- Show what was successfully created
- Provide manual recovery steps
- Never leave partial initialization

## Success Criteria

Command succeeds when:
- CLAUDE.md at project root + 5 core files in context/ (CONTEXT.md, STATUS.md, DECISIONS.md, SESSIONS.md, context-feedback.md) created with available data
- All files use v2.1 structure and format
- STATUS.md includes auto-generated Quick Reference section
- Configuration valid
- Installation files cleaned up
- User understands dual-purpose philosophy (developer + AI agent)
- User knows DECISIONS.md is for AI agent understanding
- User can immediately run /save or /save-full
- Clear next steps provided

---

## Session Start: Git Workflow Reminder

**After completing initialization**, present this copy-paste prompt to the user:

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

**💬 Feedback**: Any feedback on this command? (Add to `context/context-feedback.md`)

- First impressions of the initialization process?
- Was anything confusing or unclear?
- Did all files get created correctly?
- Suggestions for improvement?

---

**Version:** 4.0.1
**Updated:** v3.6.1 - Fixed CLAUDE.md migration (now automatic, non-interactive)
