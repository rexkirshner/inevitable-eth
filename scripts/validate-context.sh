#!/bin/bash

# validate-context.sh
# Validates AI Context System documentation and configuration files
# Version: 4.0.1
# Exit codes: 0 = pass, 1 = warnings, 2 = errors

set -e

# Source common functions for colors, exit codes, and utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/common-functions.sh" ]; then
  source "$SCRIPT_DIR/common-functions.sh"
else
  # Fallback colors if common-functions.sh not available
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  GREEN='\033[0;32m'
  BLUE='\033[0;34m'
  NC='\033[0m'
fi

# Counters
ERRORS=0
WARNINGS=0
INFO=0

# Base directory (assume script is in scripts/ directory)
BASE_DIR="$(dirname "$SCRIPT_DIR")"
CONTEXT_DIR="${BASE_DIR}/context"
CONFIG_DIR="${BASE_DIR}/config"
TEMPLATES_DIR="${BASE_DIR}/templates"

echo "🔍 Validating AI Context System (v3.6.0)..."
echo "Base directory: $BASE_DIR"
echo ""

# =============================================================================
# Check 1: Required Core Files (v3.0.0)
# =============================================================================
echo "📄 Checking REQUIRED core files (4 core + 1 AI header)..."

REQUIRED_CORE=(
  "CLAUDE.md"
  "context/CONTEXT.md"
  "context/STATUS.md"
  "context/DECISIONS.md"
  "context/SESSIONS.md"
)

for doc in "${REQUIRED_CORE[@]}"; do
  if [ -f "$BASE_DIR/$doc" ]; then
    echo "  ✅ $doc"
  else
    echo -e "  ${RED}❌ MISSING (REQUIRED): $doc${NC}"
    ((ERRORS++))
  fi
done

# Check for old CLAUDE.md location (v3.5.0 and earlier)
if [ -f "$BASE_DIR/context/claude.md" ]; then
  echo ""
  echo -e "  ${YELLOW}⚠️  MIGRATION NEEDED: Found old location context/claude.md${NC}"
  echo "     CLAUDE.md should be at project root for auto-loading by Claude Code"
  echo ""
  echo "     To migrate:"
  if [ ! -f "$BASE_DIR/CLAUDE.md" ]; then
    echo "       mv context/claude.md ./CLAUDE.md"
  else
    echo "       # Both files exist - merge or remove old file:"
    echo "       # 1. Review both files for unique content"
    echo "       # 2. Merge customizations into ./CLAUDE.md"
    echo "       # 3. rm context/claude.md"
  fi
  echo ""
  ((WARNINGS++))
fi
echo ""

# =============================================================================
# Check 2: Strongly Recommended Files
# =============================================================================
echo "📋 Checking RECOMMENDED files..."

RECOMMENDED=(
  "context/.context-config.json"
)

for doc in "${RECOMMENDED[@]}"; do
  if [ -f "$BASE_DIR/$doc" ]; then
    echo "  ✅ $doc"
  else
    echo -e "  ${YELLOW}⚠️  MISSING (RECOMMENDED): $doc${NC}"
    echo "     (Should be created by /init-context)"
    ((WARNINGS++))
  fi
done

# Note about Quick Reference consolidation in v2.1
echo "  ℹ️  Note: Quick Reference is now a section in STATUS.md (not a separate file)"
echo ""

# =============================================================================
# Check 3: Optional Files (On-Demand)
# =============================================================================
echo "ℹ️  Checking OPTIONAL files (on-demand)..."

OPTIONAL=(
  "context/CODE_MAP.md"
  "context/PRD.md"
  "context/ARCHITECTURE.md"
)

OPTIONAL_FOUND=0
for doc in "${OPTIONAL[@]}"; do
  if [ -f "$BASE_DIR/$doc" ]; then
    echo -e "  ${BLUE}ℹ️  FOUND: $doc${NC}"
    ((OPTIONAL_FOUND++))
  fi
done

if [ $OPTIONAL_FOUND -eq 0 ]; then
  echo "  ℹ️  No optional files found (this is fine for simple projects)"
else
  echo "  ℹ️  Found $OPTIONAL_FOUND optional file(s)"
fi
echo ""

# =============================================================================
# Check 4: Unresolved Placeholders
# =============================================================================
echo "🔎 Checking for unresolved placeholders..."

PLACEHOLDER_PATTERNS=(
  "\[TODO:"
  "\[PLACEHOLDER"
  "\[FIXME"
  "\[XXX"
  "TODO: Add"
  "TODO: Fill"
  "TODO: Update"
)

PLACEHOLDER_FOUND=0

if [ -d "$CONTEXT_DIR" ]; then
  for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
    # Use grep to find placeholders, suppress errors if no matches
    matches=$(grep -r "$pattern" "$CONTEXT_DIR" 2>/dev/null || true)
    if [ -n "$matches" ]; then
      if [ $PLACEHOLDER_FOUND -eq 0 ]; then
        echo -e "  ${YELLOW}⚠️  Unresolved placeholders found:${NC}"
        PLACEHOLDER_FOUND=1
      fi
      echo "$matches" | while read -r line; do
        echo -e "    ${YELLOW}$line${NC}"
      done
      ((WARNINGS++))
    fi
  done

  if [ $PLACEHOLDER_FOUND -eq 0 ]; then
    echo "  ✅ No unresolved placeholders"
  fi
else
  echo -e "  ${YELLOW}⚠️  Context directory not found${NC}"
  ((WARNINGS++))
fi
echo ""

# =============================================================================
# Check 5: Configuration File Validation
# =============================================================================
echo "⚙️  Validating configuration files..."

# Check if .context-config.json exists
if [ -f "$CONTEXT_DIR/.context-config.json" ]; then
  # Check if jq is available for JSON validation
  if command -v jq &> /dev/null; then
    if jq empty "$CONTEXT_DIR/.context-config.json" 2>/dev/null; then
      echo "  ✅ .context-config.json is valid JSON"

      # If schema exists, validate against it (requires ajv or similar - skip for basic validation)
      if [ -f "$CONFIG_DIR/context-config-schema.json" ]; then
        echo "  ℹ️  Schema found at $CONFIG_DIR/context-config-schema.json"
        echo "     (Install 'ajv-cli' for full schema validation: npm install -g ajv-cli)"
      fi
    else
      echo -e "  ${RED}❌ .context-config.json is invalid JSON${NC}"
      ((ERRORS++))
    fi
  else
    echo "  ℹ️  .context-config.json found (install 'jq' to validate JSON)"
  fi
else
  echo -e "  ${YELLOW}⚠️  .context-config.json not found${NC}"
  ((WARNINGS++))
fi

# Check .sessions-data.json if it exists (v1.8.0 machine-readable export)
if [ -f "$CONTEXT_DIR/.sessions-data.json" ]; then
  if command -v jq &> /dev/null; then
    if jq empty "$CONTEXT_DIR/.sessions-data.json" 2>/dev/null; then
      echo "  ✅ .sessions-data.json is valid JSON"
    else
      echo -e "  ${RED}❌ .sessions-data.json is invalid JSON${NC}"
      ((ERRORS++))
    fi
  else
    echo "  ℹ️  .sessions-data.json found (install 'jq' to validate)"
  fi
fi

# Check session JSON files if they exist
if [ -d "$CONTEXT_DIR/sessions" ]; then
  SESSION_FILES=$(find "$CONTEXT_DIR/sessions" -name "session-*.json" 2>/dev/null || true)
  if [ -n "$SESSION_FILES" ]; then
    SESSION_COUNT=$(echo "$SESSION_FILES" | wc -l | tr -d ' ')
    if command -v jq &> /dev/null; then
      INVALID_SESSIONS=0
      # Use process substitution to avoid subshell and preserve INVALID_SESSIONS counter
      while IFS= read -r session_file; do
        if ! jq empty "$session_file" 2>/dev/null; then
          echo -e "  ${RED}❌ Invalid JSON: $session_file${NC}"
          ((INVALID_SESSIONS++))
        fi
      done < <(echo "$SESSION_FILES")

      if [ $INVALID_SESSIONS -eq 0 ]; then
        echo "  ✅ All $SESSION_COUNT session JSON files are valid"
      else
        ((ERRORS++))
      fi
    else
      echo "  ℹ️  Found $SESSION_COUNT session JSON files (install 'jq' to validate)"
    fi
  fi
fi
echo ""

# =============================================================================
# Check 6: Template Files (v2.1.0)
# =============================================================================
echo "📋 Checking template files..."

TEMPLATE_FILES=(
  "templates/CLAUDE.md.template"
  "templates/CONTEXT.template.md"
  "templates/STATUS.template.md"
  "templates/DECISIONS.template.md"
  "templates/SESSIONS.template.md"
  "templates/CODE_MAP.template.md"
  "templates/PRD.template.md"
  "templates/ARCHITECTURE.template.md"
)

echo "  ℹ️  Note: QUICK_REF.template.md removed in v2.1 (Quick Reference now in STATUS.md)"

MISSING_TEMPLATES=0
for template in "${TEMPLATE_FILES[@]}"; do
  if [ -f "$BASE_DIR/$template" ]; then
    echo "  ✅ $(basename "$template")"
  else
    echo -e "  ${YELLOW}⚠️  Missing template: $template${NC}"
    ((MISSING_TEMPLATES++))
  fi
done

if [ $MISSING_TEMPLATES -gt 0 ]; then
  ((WARNINGS++))
fi
echo ""

# =============================================================================
# Check 7: Configuration Files
# =============================================================================
echo "🔧 Checking configuration system..."

if [ -f "$CONFIG_DIR/context-config-schema.json" ]; then
  echo "  ✅ context-config-schema.json found"
else
  echo -e "  ${YELLOW}⚠️  context-config-schema.json not found${NC}"
  ((WARNINGS++))
fi

# Check for reference catalog (optional)
if [ -f "$BASE_DIR/reference/preference-catalog.yaml" ]; then
  echo "  ℹ️  preference-catalog.yaml found (reference)"
fi
echo ""

# =============================================================================
# Check 8: Slash Commands (v1.8.0)
# =============================================================================
echo "⚡ Checking slash commands..."

COMMANDS=(
  ".claude/commands/init-context.md"
  ".claude/commands/migrate-context.md"
  ".claude/commands/save-context.md"
  ".claude/commands/review-context.md"
  ".claude/commands/code-review.md"
  ".claude/commands/validate-context.md"
  ".claude/commands/export-context.md"
  ".claude/commands/update-context-system.md"
)

MISSING_COMMANDS=0
for cmd in "${COMMANDS[@]}"; do
  if [ -f "$BASE_DIR/$cmd" ]; then
    echo "  ✅ $(basename "$cmd" .md)"
  else
    echo -e "  ${RED}❌ Missing command: $cmd${NC}"
    ((ERRORS++))
    ((MISSING_COMMANDS++))
  fi
done

# Check for obsolete commands (should NOT exist in v1.8.0)
OBSOLETE_COMMANDS=(
  ".claude/commands/init-context-full.md"
  ".claude/commands/quick-save-context.md"
)

for cmd in "${OBSOLETE_COMMANDS[@]}"; do
  if [ -f "$BASE_DIR/$cmd" ]; then
    echo -e "  ${YELLOW}⚠️  OBSOLETE command found: $cmd (should be removed in v1.8.0)${NC}"
    ((WARNINGS++))
  fi
done
echo ""

# =============================================================================
# Check 9: v1.8.0 Dual-Purpose Completeness
# =============================================================================
echo "🤖 Checking v1.8.0 dual-purpose completeness..."

# Check if DECISIONS.md has "Guidelines for AI Agents" section
if [ -f "$CONTEXT_DIR/DECISIONS.md" ]; then
  if grep -q "Guidelines for AI Agents" "$CONTEXT_DIR/DECISIONS.md"; then
    echo "  ✅ DECISIONS.md has AI agent guidelines"
  else
    echo -e "  ${YELLOW}⚠️  DECISIONS.md missing 'Guidelines for AI Agents' section${NC}"
    ((WARNINGS++))
  fi
fi

# Check if SESSIONS.md has structured format (Mental Models section)
if [ -f "$CONTEXT_DIR/SESSIONS.md" ]; then
  if grep -q "Mental Models" "$CONTEXT_DIR/SESSIONS.md"; then
    echo "  ✅ SESSIONS.md uses structured format with Mental Models"
  else
    echo -e "  ${YELLOW}⚠️  SESSIONS.md may need v1.8.0 structured format (Mental Models section)${NC}"
    ((WARNINGS++))
  fi
fi

# Check if CONTEXT.md references other files (single source of truth)
if [ -f "$CONTEXT_DIR/CONTEXT.md" ]; then
  if grep -q "STATUS.md" "$CONTEXT_DIR/CONTEXT.md"; then
    echo "  ✅ CONTEXT.md references STATUS.md (single source of truth)"
  else
    echo -e "  ${YELLOW}⚠️  CONTEXT.md should reference STATUS.md instead of duplicating${NC}"
    ((WARNINGS++))
  fi
fi
echo ""

# =============================================================================
# Summary
# =============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Validation Summary (v3.6.0)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit codes are part of script's documented API - do not change
# 0 = all checks passed, 1 = warnings only, 2 = errors found
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo "Your context system is fully aligned with v3.6.0."
  exit 0  # All passed
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  echo ""
  echo "Warnings are non-critical but should be addressed for optimal AI agent support."
  echo "Core files are present and valid."
  exit 1  # Warnings only
else
  echo -e "${RED}❌ $ERRORS error(s) found${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  fi
  echo ""
  echo "Please fix errors before proceeding."
  echo ""
  echo "Missing core files? Run /init-context to create them."
  exit 2  # Errors found
fi
