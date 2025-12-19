---
name: init-context-full
description: Initialize Claude Context System with ALL documentation files (comprehensive mode)
---

# /init-context-full Command

Initialize the COMPLETE context management system with all 8 documentation files. Use this for complex projects that need comprehensive documentation from day one. For most projects, use `/init-context` instead (starts minimal, grows as needed).

**See also:** `.claude/docs/command-philosophy.md` for core principles

## What This Command Does

1. Creates `context/` folder structure
2. Analyzes current project state
3. Generates all meta-documentation from templates
4. Creates configuration file
5. Sets up task tracking system

## Execution Steps

### Step 0: Verify Working Directory and .claude Location

**CRITICAL:** Check for multiple .claude directories in the path. This causes conflicts.

```bash
# Get absolute path to current directory
CURRENT_DIR=$(pwd)
echo "Working directory: $CURRENT_DIR"

# Check for .claude directories in parent path
CLAUDE_DIRS=$(find "$CURRENT_DIR" -maxdepth 0 -name ".claude" -o -path "*/.claude" | grep -c ".claude" || echo "0")

# Also check parent directories up to 3 levels
PARENT_CLAUDE=$(find "$CURRENT_DIR/.." -maxdepth 2 -name ".claude" 2>/dev/null | grep -v "$CURRENT_DIR/.claude" || echo "")

if [ -n "$PARENT_CLAUDE" ]; then
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
  echo "  2. If parent folder IS a project: Move this project out of it"
  echo ""
  read -p "Continue anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. Please resolve .claude directory conflicts first."
    exit 1
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

**Detect Project Type:**
Based on analysis, classify as one of:
1. **Web App** (Next.js, React, Vue, Angular)
2. **API** (Express, FastAPI, Rails API)
3. **CLI Tool** (Node CLI, Rust binary, Go CLI)
4. **Library/Package** (npm package, Rust crate, Python package)
5. **Full Stack** (Monorepo with frontend + backend)
6. **Mobile App** (React Native, Flutter)
7. **Desktop App** (Electron, Tauri)

**Project Structure:**
- Identify src/ or app/ or lib/ directories
- Look for test/ or tests/ directories
- Check for build/dist/out directories
- Find documentation directories

### Step 3: Create Folder Structure

Create the complete context directory structure:

```bash
mkdir -p context/tasks
mkdir -p artifacts/code-reviews
mkdir -p artifacts/lighthouse
mkdir -p artifacts/performance
mkdir -p artifacts/security
mkdir -p artifacts/bundle-analysis
mkdir -p artifacts/coverage
```

### Step 4: Generate Documentation Files

Create all documentation files from templates. Fill in as much as possible from project analysis:

**context/CLAUDE.md** - Developer guide
- Project overview (from README or git description)
- Tech stack (from package analysis)
- Commands (from package.json scripts or Makefile)
- Architecture (inferred from folder structure)
- Include communication preferences and workflow rules
- Include "Core Development Methodology" section

**context/PRD.md** - Product requirements
- Executive summary (from README or create placeholder)
- Current status (Phase 1 - Initial Setup)
- Tech stack (from analysis)
- Implementation plan (create initial phases)
- Progress log (first entry: "Project initialized")

**context/ARCHITECTURE.md** - Technical design
- High-level overview (inferred from structure)
- Key directories and purposes
- Technology choices (from analysis)
- Design patterns (identify from code if possible)

**context/DECISIONS.md** - Technical decisions
- Framework choice (why this framework)
- Initial architectural decisions
- Dependencies chosen (from package files)

**context/CODE_STYLE.md** - Coding standards
- Core development principles (simplicity, root causes, no lazy coding)
- Language-specific conventions (from project type)
- Testing requirements
- Git workflow rules

**context/KNOWN_ISSUES.md** - Current issues
- Start empty or with placeholders
- Categories: Blocking, Non-Critical, Limitations, Future Work

**context/SESSIONS.md** - Session history
- First entry documenting initialization
- Template for future entries

**context/tasks/next-steps.md** - Action items
- Initial next steps based on project state
- If new project: setup tasks
- If existing: current state analysis

**context/tasks/todo.md** - Current session
- Empty template ready for use

### Step 4.5: Apply Project Type Presets

Based on detected project type, apply relevant presets to documentation:

#### Web App Preset
**ARCHITECTURE.md additions:**
- Frontend architecture (components, pages, routing)
- State management approach
- API integration patterns
- Build and deployment pipeline

**CODE_STYLE.md additions:**
- Component structure conventions
- CSS/styling approach
- Asset optimization
- Accessibility standards

**Next steps:**
- SEO optimization
- Performance monitoring setup
- Browser compatibility testing

#### API Preset
**ARCHITECTURE.md additions:**
- API design (REST/GraphQL/gRPC)
- Authentication/authorization flow
- Database schema
- Middleware stack

**CODE_STYLE.md additions:**
- Endpoint naming conventions
- Error handling patterns
- Request/response formats
- API versioning strategy

**Next steps:**
- API documentation (OpenAPI/Swagger)
- Rate limiting implementation
- Monitoring and logging

#### CLI Tool Preset
**ARCHITECTURE.md additions:**
- Command structure
- Argument parsing
- Configuration management
- Output formatting

**CODE_STYLE.md additions:**
- Command naming conventions
- Help text standards
- Exit code conventions
- Error message formatting

**Next steps:**
- Man page/help documentation
- Installation scripts
- Cross-platform testing

#### Library/Package Preset
**ARCHITECTURE.md additions:**
- Public API surface
- Internal vs external modules
- Dependency management
- Build targets

**CODE_STYLE.md additions:**
- API design principles
- Backward compatibility rules
- Deprecation policy
- Documentation standards

**Next steps:**
- API documentation generation
- Example/demo projects
- Versioning strategy

#### Full Stack Preset
**ARCHITECTURE.md additions:**
- Monorepo structure
- Frontend + backend integration
- Shared code/types
- Development workflow

**CODE_STYLE.md additions:**
- Cross-stack conventions
- API contract management
- Database migrations
- End-to-end testing

**Next steps:**
- CI/CD pipeline
- Environment management
- Full stack testing strategy

### Step 5: Create Configuration

**ACTION:** Use the Bash tool to copy the template config and update placeholders:

```bash
# Download the latest config template from GitHub
curl -sL https://raw.githubusercontent.com/rexkirshner/claude-context-system/main/config/.context-config.template.json -o context/.context-config.json

# Update placeholders (project name, owner, dates)
# Use Read tool to get current config, then Edit tool to replace placeholders with actual values
```

**IMPORTANT:** You MUST:
1. Use Read tool to read `context/.context-config.json`
2. Use Edit tool to replace ALL placeholders:
   - `[Your Name]` → actual owner name
   - `[Project Name]` → actual project name
   - `[web-app|cli|library|api]` → actual project type
   - `[YYYY-MM-DD]` → today's date (2025-10-04)

This ensures the config includes ALL current keys (commands, git policy, notifications, metadata) from the template.

### Step 6: Report Completion

Provide clear summary:

```
✅ Context System Initialized

Created:
- context/ folder structure
- 8 documentation files
- Configuration file

Files created:
- context/CLAUDE.md - Developer guide
- context/PRD.md - Product requirements
- context/ARCHITECTURE.md - Technical design
- context/DECISIONS.md - Decision log
- context/CODE_STYLE.md - Coding standards
- context/KNOWN_ISSUES.md - Issue tracking
- context/SESSIONS.md - Session history
- context/tasks/next-steps.md - Action items
- context/tasks/todo.md - Current tasks
- context/.context-config.json - Configuration

Project Type: [Detected type]
Tech Stack: [Detected stack]

Next Steps:
1. Review context/CLAUDE.md for accuracy
2. Update context/PRD.md with project goals
3. Run /save-context after making changes
4. Start coding!
```

## Template Content Guidelines

When filling templates, use this priority:

1. **From project files**: Use actual data from package.json, README, git
2. **Inferred from structure**: Make educated guesses from folder layout
3. **Generic placeholders**: Use `[TODO: Add ...]` for unknown info
4. **Smart defaults**: Always include standard preferences and workflow rules

## Important Notes

- Always include workflow preferences in CLAUDE.md
- CODE_STYLE.md must include his "no lazy coding" and "simplicity first" rules
- Configuration must enforce "no push without approval"
- Documentation should be scannable in 5 minutes per file
- Use bullet points and clear headings
- Link between related documents

## Error Handling

If errors occur:
- Report what failed clearly
- Show what was successfully created
- Provide manual recovery steps
- Never leave partial initialization

### Step 6: Cleanup Installation Files

**IMPORTANT:** Remove the installation files that were downloaded from GitHub to keep the project clean.

**ACTION:** Use the Bash tool to remove installation directory:

```bash
# Check if we're in a nested installation (common pattern)
if [ -d "../claude-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ../claude-context-system
  echo "✅ Installation files removed"
elif [ -d "./claude-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ./claude-context-system
  echo "✅ Installation files removed"
else
  echo "⏭️  No installation files found (already clean)"
fi

# Also check for downloaded zip
if [ -f "../claude-context-system.zip" ]; then
  rm -f ../claude-context-system.zip
  echo "✅ Removed installation zip"
fi
```

**What gets removed:**
- `claude-context-system/` directory (GitHub repo contents)
- `claude-context-system.zip` (if exists)

**What gets kept:**
- `.claude/` directory (slash commands)
- `context/` directory (all your documentation)
- All project files

**Result:** Clean project without installation artifacts.

## Success Criteria

Command succeeds when:
- All 9 files created
- Configuration valid
- Templates filled with available data
- Installation files cleaned up
- User can immediately run /save-context
- Clear next steps provided
