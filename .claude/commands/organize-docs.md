---
name: organize-docs
description: "Organize project documentation into proper structure"
---

# /organize-docs Command

**Interactive documentation cleanup** - Helps file documents in appropriate locations.

**Philosophy:** "A place for everything, everything in its place"

---

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

### Step 1: Scan for Disorganized Files

**Scan project for files that need organization:**

```bash
echo "Step 1/6: Scanning for files to organize..."
echo ""

# Find loose .md files in root (exclude allowed ones and common directories)
echo "Checking project root..."
LOOSE_ROOT=$(find . -maxdepth 1 -name "*.md" \
  ! -name "README.md" \
  ! -name "SECURITY.md" \
  ! -name "CONTRIBUTING.md" \
  ! -name "LICENSE.md" \
  ! -name "CHANGELOG.md" \
  ! -name "ORGANIZATION.md" \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  ! -path "*/.next/*" \
  2>/dev/null)

# Find .md files in source directories (exclude common directories)
echo "Checking source directories..."
LOOSE_SRC=$(find src backend frontend lib -name "*.md" -maxdepth 3 \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/dist/*" \
  ! -path "*/build/*" \
  2>/dev/null || true)

# Count results
ROOT_COUNT=$(echo "$LOOSE_ROOT" | grep -c "\.md$" || echo "0")
SRC_COUNT=$(echo "$LOOSE_SRC" | grep -c "\.md$" || echo "0")
TOTAL=$((ROOT_COUNT + SRC_COUNT))

log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "  SCAN RESULTS"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "Loose files in root: $ROOT_COUNT"
log_info "Docs in source dirs: $SRC_COUNT"
log_info "Total to organize: $TOTAL"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""

if [ "$TOTAL" -eq 0 ]; then
  log_success "Project is well-organized! No loose files found."
  log_info ""
  log_info "Current structure follows best practices:"
  log_info "  📄 Root - Only essential files"
  log_info "  📁 context/ - Active context system"
  log_info "  📁 docs/ - Organized documentation"
  log_info "  📁 artifacts/ - Historical work"
  exit 0
fi

# List all files that need attention
if [ "$ROOT_COUNT" -gt 0 ]; then
  log_info "Files in root:"
  log_info "$LOOSE_ROOT"
  log_info ""
fi

if [ "$SRC_COUNT" -gt 0 ]; then
  log_info "Files in source directories:"
  log_info "$LOOSE_SRC"
  log_info ""
fi
```

**If files found, proceed to Step 2. If no files found, exit with success message.**

---

### Step 2: Analyze Each File

**For each file found, analyze its content and purpose:**

```bash
echo "Step 2/6: Analyzing file contents..."
echo ""
```

**Analysis criteria:**
1. **Read the file** - Use Read tool to examine contents
2. **Determine type** - Based on content keywords and structure:
   - **Milestone** - Keywords: milestone, completed, done, finished, shipped
   - **Planning** - Keywords: proposal, plan, roadmap, spec, requirements, PRD
   - **Review** - Keywords: review, audit, analysis, feedback, retrospective
   - **Research** - Keywords: research, comparison, evaluation, investigation
   - **Setup** - Keywords: setup, installation, configuration, getting started
   - **Architecture** - Keywords: architecture, design, structure, system, patterns
   - **API** - Keywords: api, endpoint, route, REST, GraphQL
   - **General Notes** - Doesn't fit other categories
3. **Assess status** - Is this active documentation or historical artifact?
4. **Check for dates** - Does filename or content suggest when it was created?

**Create a summary table:**

```markdown
| File | Type | Status | Suggested Location | Reason |
|------|------|--------|---------------------|--------|
| NOTES.md | planning | historical | artifacts/planning/ | Old planning notes from Oct 2024 |
| API_DESIGN.md | architecture | permanent | docs/architecture/ | Current API design reference |
| ... | ... | ... | ... | ... |
```

**Present this table to the user before proceeding.**

---

### Step 3: Create Folder Structure

**If `artifacts/` or `docs/` folders don't exist, create them:**

```bash
echo "Step 3/6: Setting up organized folder structure..."
echo ""

# Create artifacts/ for historical work
if [ ! -d "artifacts" ]; then
  log_verbose "Creating artifacts/ directories..."
  mkdir -p artifacts/milestones
  mkdir -p artifacts/planning
  mkdir -p artifacts/reviews
  mkdir -p artifacts/research
  mkdir -p artifacts/notes
  log_success "  artifacts/ created"
fi

# Create docs/ for permanent documentation
if [ ! -d "docs" ]; then
  log_verbose "Creating docs/ directories..."
  mkdir -p docs/setup
  mkdir -p docs/development
  mkdir -p docs/architecture
  mkdir -p docs/api
  log_success "  docs/ created"
fi

log_info ""
log_success "📁 Folder structure ready"
log_info ""
```

---

### Step 4: File Organization Plan

**Present organization plan to user:**

```bash
echo "Step 4/6: Creating organization plan..."
echo ""
```

```markdown
## Organization Plan

I've analyzed all loose files and created this organization plan:

### Files to Move

**To artifacts/planning/:**
- NOTES.md → artifacts/planning/2024-10-old-notes.md
- PROPOSAL.md → artifacts/planning/2024-09-initial-proposal.md

**To docs/architecture/:**
- API_DESIGN.md → docs/architecture/api-design.md

**To artifacts/milestones/:**
- MILESTONE_1.md → artifacts/milestones/2024-11-milestone-1.md

### Naming Conventions Applied

Historical files (artifacts/) use date prefix: `YYYY-MM-DD-description.md`
Permanent files (docs/) use descriptive names: `topic-description.md`

### Actions

Say "proceed" to execute these moves
Say "modify" to adjust the plan
Say "cancel" to abort organization
```

**Wait for user approval before proceeding.**

---

### Step 5: Execute Organization

**Once user approves, execute the moves:**

```bash
# Example move operations (customize based on analysis)

echo "Step 5/6: Organizing files..."
echo ""

# Move files to proper locations
# Use 'git mv' if in git repo, otherwise 'mv'
if git rev-parse --git-dir > /dev/null 2>&1; then
  MV_CMD="git mv"
  echo "Using git mv (changes will be staged)"
else
  MV_CMD="mv"
  echo "Using mv (not a git repository)"
fi

# Helper function to safely move files
safe_move() {
  local source="$1"
  local dest="$2"

  # Create destination directory if it doesn't exist
  local dest_dir=$(dirname "$dest")
  if [ ! -d "$dest_dir" ]; then
    echo "Creating directory: $dest_dir"
    mkdir -p "$dest_dir"
  fi

  # Execute the move
  $MV_CMD "$source" "$dest"
  echo "✓ Moved: $source → $dest"
}

# Execute each move (examples - customize based on approved plan)
# safe_move "NOTES.md" "artifacts/planning/2024-10-old-notes.md"
# safe_move "API_DESIGN.md" "docs/architecture/api-design.md"
# ... (based on approved plan)

echo ""
echo "✅ Files moved to organized locations"
```

**IMPORTANT:** Only execute moves that were explicitly approved by the user.

---

### Step 6: Summary and Validation

**Provide summary of organization:**

```bash
show_progress "Finalizing organization" 6 6
log_info ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "  ORGANIZATION COMPLETE"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info ""
log_info "Summary:"
log_info "  📁 Files organized: $ORGANIZED_COUNT"
log_info "  📁 Folders created: $FOLDERS_CREATED"
log_info "  📄 Root directory: Clean"
log_info ""
log_info "Current structure:"
log_info "  📁 artifacts/ - Historical work (dated)"
log_info "  📁 docs/ - Permanent documentation (organized)"
log_info "  📁 context/ - Active context system"
log_info "  📄 Root - Only essential files"
log_info ""
log_success "✅ Project structure is now clean and organized!"
log_info ""
```

**Suggest validation and next steps:**

```bash
log_info "Next steps:"
log_info "  1. Run /validate-context to check organization score"

# Check if ORGANIZATION.md exists
if [ -f "ORGANIZATION.md" ]; then
  log_info "  2. Review ORGANIZATION.md for guidelines"
else
  log_info "  2. Create ORGANIZATION.md for guidelines (optional):"
  log_info "     cp reference/ORGANIZATION.md ./ORGANIZATION.md"
fi

log_info "  3. Commit organized structure to git"
log_info ""
```

---

## Guidelines

### Categorization Rules

**artifacts/** (Historical - Dated files):
- `artifacts/milestones/` - Completed milestones, feature completions
- `artifacts/planning/` - Old proposals, specs, roadmaps
- `artifacts/reviews/` - Code reviews, audits, retrospectives
- `artifacts/research/` - Research, comparisons, evaluations
- `artifacts/notes/` - Meeting notes, brainstorms, general notes

**docs/** (Permanent - Topic-organized):
- `docs/setup/` - Installation, configuration guides
- `docs/development/` - Development workflows, testing
- `docs/architecture/` - System design, patterns, decisions
- `docs/api/` - API documentation, endpoints

### Naming Conventions

**Historical files (artifacts/):**
- Format: `YYYY-MM-DD-description.md`
- Example: `2024-10-15-auth-milestone-complete.md`
- Always include date prefix

**Permanent files (docs/):**
- Format: `descriptive-topic-name.md`
- Example: `database-architecture.md`
- No dates (living documentation)

### Decision Guidelines

**When to use artifacts/ vs docs/:**

Use **artifacts/** when:
- Work is completed (milestone, project phase)
- Proposal was superseded by new approach
- Document is historical reference
- Rarely or never updated

Use **docs/** when:
- Documentation is long-term reference
- Will be updated as system evolves
- Describes current state
- Organized by topic, not time

---

## When to Run /organize-docs

**Monthly Maintenance:**
- Regular cleanup prevents accumulation
- Takes 5-10 minutes
- Keeps organization score high

**Before Major Releases:**
- Ensure professional appearance
- Clean structure for handoffs
- Archive completed work

**When Validation Flags Issues:**
- Organization score < 90
- Loose files > 5 in root
- Documentation sprawl detected

**When Project Feels Cluttered:**
- Hard to find documentation
- Unclear what's current vs old
- New files accumulating in wrong places

---

## Expected Outcome

**Before:**
```
project-root/
├── README.md
├── NOTES.md
├── OLD_PLAN.md
├── IDEAS.md
├── MILESTONE_1.md
├── API_THOUGHTS.md
└── backend/
    └── BACKEND_NOTES.md
```

**After:**
```
project-root/
├── README.md
├── LICENSE.md
├── context/
│   ├── CONTEXT.md
│   └── STATUS.md
├── docs/
│   ├── architecture/
│   │   └── api-design.md
│   └── setup/
│       └── configuration.md
└── artifacts/
    ├── planning/
    │   ├── 2024-09-initial-ideas.md
    │   └── 2024-10-old-plan.md
    └── milestones/
        └── 2024-11-milestone-1.md
```

**Result:** Clean, organized, professional structure.

---

**💬 Feedback**: Any feedback on organization? (Add to `context/context-feedback.md`)

- Did the interactive wizard work well?
- Were file categorizations accurate?
- Any files placed incorrectly?
- Suggestions for improvement?

---

**Version:** 3.6.0
**Added:** Organization features for structural neatness (v2.2.1)
**Updated:** v2.3.1 - Added feedback system
