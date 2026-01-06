#!/bin/bash
# Common functions used across AI Context System commands
# Version: 4.0.1
#
# This file extracts duplicate code from multiple commands into shared utilities.
# Source this file at the beginning of any command that needs these functions.
#
# Usage:
#   source scripts/common-functions.sh

# Exit codes (standardized across all commands)
export EXIT_SUCCESS=0
export EXIT_ERROR=1
export EXIT_MISUSE=2
export EXIT_NOT_FOUND=3
export EXIT_NETWORK=4
export EXIT_PERMISSION=5
export EXIT_VALIDATION=6

# Cache configuration
export CACHE_DIR=".claude/.cache"
export CACHE_TTL=60  # seconds

# Color codes for output
export RED='\033[0;31m'
export YELLOW='\033[1;33m'
export GREEN='\033[0;32m'
export BLUE='\033[0;34m'
export NC='\033[0m' # No Color

# =============================================================================
# Context Directory Management
# =============================================================================

# Find context directory by searching up to 2 parent directories
# Used in: save.md, save-full.md, review-context.md, validate-context.md,
#          organize-docs.md, export-context.md, session-summary.md, update-templates.md
find_context_dir() {
  for dir in "context" "../context" "../../context"; do
    if [ -d "$dir" ]; then
      echo "$dir"
      return 0
    fi
  done
  return 1
}

# =============================================================================
# Network Operations with Retry and Validation
# =============================================================================

# Robust download with retry, timeout, and validation
# Fixes Issue #2 (network error handling) and Issue #8 (download validation)
#
# Args:
#   $1 - URL to download
#   $2 - Output file path
#   $3 - Max attempts (optional, default 3)
#   $4 - Timeout in seconds (optional, default 10)
#
# Returns:
#   0 on success, 1 on failure
download_with_retry() {
  local url=$1
  local output=$2
  local attempts=${3:-3}
  local timeout=${4:-10}
  local max_time=30

  for i in $(seq 1 $attempts); do
    if curl --connect-timeout $timeout --max-time $max_time -sL "$url" -o "$output" 2>/dev/null; then
      # Validate downloaded file
      if [ -f "$output" ]; then
        # Check it's not an HTML error page
        if head -1 "$output" 2>/dev/null | grep -qi "<!DOCTYPE\|<html"; then
          log_error "Downloaded file appears to be HTML (likely an error page)"
          rm -f "$output"
        else
          # Check file size is reasonable (> 0 bytes, < 10MB)
          local size=$(wc -c < "$output" 2>/dev/null || echo "0")
          if [ "$size" -lt 1 ]; then
            log_error "Downloaded file is empty"
            rm -f "$output"
          elif [ "$size" -gt 10485760 ]; then
            log_warn "Downloaded file is large ($size bytes)"
            return 0
          else
            return 0
          fi
        fi
      fi
    fi

    if [ $i -lt $attempts ]; then
      log_warn "Download attempt $i/$attempts failed, retrying in $((i * 2))s..."
      sleep $((i * 2))
    fi
  done

  show_error $EXIT_NETWORK "Failed to download after $attempts attempts" \
    "Check your internet connection" \
    "Verify the URL is correct: $url" \
    "Try again later if GitHub is experiencing issues"
  return 1
}

# =============================================================================
# Input Validation and Sanitization
# =============================================================================

# Validate user input against pattern and length constraints
# Fixes Issue #4 (command injection vulnerability)
#
# Args:
#   $1 - Input to validate
#   $2 - Regex pattern (optional, default alphanumeric + dash/underscore)
#   $3 - Max length (optional, default 50)
#
# Returns:
#   0 if valid, 1 if invalid
validate_input() {
  local input=$1
  local pattern=${2:-'^[a-zA-Z0-9_-]+$'}
  local max_length=${3:-50}

  # Check length
  if [ ${#input} -gt $max_length ]; then
    show_error $EXIT_VALIDATION "Input too long (max $max_length characters)" \
      "Provided input has ${#input} characters" \
      "Shorten the input and try again"
    return 1
  fi

  # Check pattern
  if [[ ! "$input" =~ $pattern ]]; then
    show_error $EXIT_VALIDATION "Invalid input format" \
      "Input must match pattern: $pattern" \
      "Typically: letters, numbers, dashes, and underscores only"
    return 1
  fi

  return 0
}

# Sanitize filename to prevent path traversal
sanitize_filename() {
  local filename=$1
  # Remove path components, special chars except dash/underscore/dot
  echo "$filename" | sed 's/[^a-zA-Z0-9._-]/_/g' | sed 's/^\.*//' | cut -c1-255
}

# =============================================================================
# File System Operations (Performance Optimized)
# =============================================================================

# Efficiently find markdown files with depth limit and exclusions
# Fixes Issue #1 (performance bottlenecks)
#
# Args:
#   $1 - Max depth (optional, default 3)
#   $2 - Starting directory (optional, default current)
#
# Returns:
#   List of .md files
find_md_files() {
  local max_depth=${1:-3}
  local start_dir=${2:-.}

  find "$start_dir" -maxdepth $max_depth -name "*.md" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/.next/*" \
    -not -path "*/out/*" \
    -not -path "*/target/*" \
    -not -path "*/vendor/*" \
    2>/dev/null
}

# Efficiently find directories with exclusions
find_directories() {
  local max_depth=${1:-3}
  local start_dir=${2:-.}

  find "$start_dir" -maxdepth $max_depth -type d \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" \
    -not -path "*/.next/*" \
    -not -path "*/out/*" \
    2>/dev/null
}

# =============================================================================
# Cache Operations
# =============================================================================

# Get cached value if fresh enough
# Improvement #4 (caching for performance)
#
# Args:
#   $1 - Cache key
#
# Returns:
#   Cached value if exists and fresh, empty otherwise
get_cached() {
  local key=$1
  local file="$CACHE_DIR/$key"

  if [ -f "$file" ]; then
    # Calculate age (portable across macOS and Linux)
    local file_time
    if stat -f %m "$file" >/dev/null 2>&1; then
      # macOS
      file_time=$(stat -f %m "$file")
    else
      # Linux
      file_time=$(stat -c %Y "$file")
    fi

    local current_time=$(date +%s)
    local age=$((current_time - file_time))

    if [ $age -lt $CACHE_TTL ]; then
      cat "$file"
      return 0
    fi
  fi
  return 1
}

# Set cached value
set_cached() {
  local key=$1
  local value=$2
  mkdir -p "$CACHE_DIR"
  echo "$value" > "$CACHE_DIR/$key"
}

# Clear all cached values
clear_cache() {
  if [ -d "$CACHE_DIR" ]; then
    rm -rf "$CACHE_DIR"
    log_success "Cache cleared"
  fi
}

# =============================================================================
# File Safety Operations
# =============================================================================

# Confirm deletion of potentially sensitive files
# Protects gitignored files from accidental deletion
#
# Args:
#   $1 - File path to check before deletion
#
# Returns:
#   0 - Safe to delete (not gitignored or user confirmed)
#   1 - Do not delete (user declined)
#
# Usage:
#   if confirm_deletion "context/file.md"; then
#     rm -f "context/file.md"
#   else
#     echo "Deletion cancelled"
#   fi
confirm_deletion() {
  local file="$1"

  # Defensive: If no file specified, don't block
  if [ -z "$file" ]; then
    return 0
  fi

  # If file doesn't exist, nothing to protect
  if [ ! -e "$file" ]; then
    return 0
  fi

  # Check if we're in a git repository
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    # Not in git repo, no gitignore to check
    return 0
  fi

  # Check if file is gitignored (potential sensitive data)
  if git check-ignore -q "$file" 2>/dev/null; then
    # File is gitignored - require explicit confirmation
    echo ""
    echo "⚠️  WARNING: Potentially sensitive file detected"
    echo "   File: $file"
    echo "   Status: Gitignored (may contain credentials, API keys, etc.)"
    echo ""
    echo "   This file is in .gitignore and may contain sensitive data."
    echo "   Deletion is NOT recommended unless you're certain."
    echo ""
    echo -n "   To delete, type exactly: yes delete $(basename "$file")"
    echo ""
    echo -n "   > "

    read -r confirmation

    if [ "$confirmation" = "yes delete $(basename "$file")" ]; then
      echo ""
      echo "✓ Deletion confirmed"
      return 0
    else
      echo ""
      echo "✗ Deletion cancelled (input did not match)"
      return 1
    fi
  fi

  # File not gitignored, safe to delete
  return 0
}

# =============================================================================
# Logging and Output
# =============================================================================

# Verbosity level (can be overridden by commands)
VERBOSITY=${VERBOSITY:-normal}

# Log info message (respects verbosity)
log_info() {
  [ "$VERBOSITY" != "quiet" ] && echo "$1"
}

# Log verbose message
log_verbose() {
  if [ "$VERBOSITY" = "verbose" ] || [ "$VERBOSITY" = "debug" ]; then
    echo "$1"
  fi
}

# Log debug message
log_debug() {
  if [ "$VERBOSITY" = "debug" ]; then
    echo "DEBUG: $1" >&2
  fi
}

# Log success message
log_success() {
  [ "$VERBOSITY" != "quiet" ] && echo "✅ $1"
}

# Log warning message
log_warn() {
  echo "⚠️  $1" >&2
}

# Log error message
log_error() {
  echo "❌ $1" >&2
}

# Show progress indicator
# Fixes Issue #10 (no progress indicators)
#
# Args:
#   $1 - Message
#   $2 - Current step (optional)
#   $3 - Total steps (optional)
show_progress() {
  local message=$1
  local step=$2
  local total=$3

  if [ "$VERBOSITY" = "quiet" ]; then
    return
  fi

  if [ -n "$step" ] && [ -n "$total" ]; then
    echo "⏳ [$step/$total] $message..."
  else
    echo "⏳ $message..."
  fi
}

# Show detailed error with suggestions
# Fixes Issue #9 (incomplete error messages)
#
# Args:
#   $1 - Error code
#   $2 - Error message
#   $@ - Suggestions (remaining args)
show_error() {
  local error_code=$1
  local message=$2
  shift 2
  local suggestions=("$@")

  echo "" >&2
  echo "❌ Error ($error_code): $message" >&2
  echo "" >&2

  if [ ${#suggestions[@]} -gt 0 ]; then
    echo "This usually means:" >&2
    for suggestion in "${suggestions[@]}"; do
      echo "  • $suggestion" >&2
    done
    echo "" >&2
  fi
}

# =============================================================================
# Configuration and Repository Management
# =============================================================================

# Get repository URL from config or use default
# Fixes Issue #7 (hardcoded GitHub URLs)
get_repo_url() {
  local config_file="context/.context-config.json"

  if [ -f "$config_file" ]; then
    local custom_repo=$(grep -o '"repositoryUrl"[[:space:]]*:[[:space:]]*"[^"]*"' "$config_file" 2>/dev/null | cut -d'"' -f4)
    if [ -n "$custom_repo" ]; then
      echo "$custom_repo"
      return
    fi
  fi

  # Default repository URL
  echo "https://github.com/rexkirshner/ai-context-system"
}

# Get raw content URL from repository URL
get_raw_url() {
  local repo=$(get_repo_url)
  echo "${repo/github.com/raw.githubusercontent.com}/main"
}

# Get system version from VERSION file or config
get_system_version() {
  # Try VERSION file first (single source of truth in v2.3.0+)
  if [ -f "VERSION" ]; then
    cat VERSION
    return
  fi

  # Fallback to config file (for older versions)
  if [ -f "context/.context-config.json" ]; then
    grep -m 1 '"version":' context/.context-config.json 2>/dev/null | cut -d'"' -f4
    return
  fi

  echo "unknown"
}

# =============================================================================
# Auto-Update Checking
# =============================================================================

# Check for available updates (non-blocking)
# Improvement #5 (auto-update notifications)
check_for_updates() {
  local check_file=".claude/.last-update-check"
  local check_interval=86400  # 24 hours

  # Skip if verbosity is quiet
  [ "$VERBOSITY" = "quiet" ] && return 0

  # Check once per day
  if [ -f "$check_file" ]; then
    local file_time
    if stat -f %m "$check_file" >/dev/null 2>&1; then
      file_time=$(stat -f %m "$check_file")
    else
      file_time=$(stat -c %Y "$check_file")
    fi

    local current_time=$(date +%s)
    local age=$((current_time - file_time))

    if [ $age -lt $check_interval ]; then
      return 0
    fi
  fi

  # Get latest version from GitHub VERSION file (timeout quickly, don't block)
  # Changed from /releases/latest API to VERSION file for accurate version tracking
  local latest=$(curl -s --connect-timeout 3 --max-time 5 \
    "https://raw.githubusercontent.com/rexkirshner/ai-context-system/main/VERSION" 2>/dev/null \
    | tr -d '[:space:]')

  local current=$(get_system_version)

  if [ -n "$latest" ] && [ "$latest" != "$current" ] && [ "$latest" != "unknown" ]; then
    echo "" >&2
    echo "💡 Update available: v$current → v$latest" >&2
    echo "   Run /update-context-system to upgrade" >&2
    echo "" >&2
  fi

  # Update check timestamp
  mkdir -p "$(dirname "$check_file")"
  touch "$check_file"
}

# =============================================================================
# Backup and Rollback
# =============================================================================

# Create timestamped backup of context and .claude
# Fixes Issue #6 (no migration rollback)
#
# Returns:
#   Backup directory path
create_backup() {
  local backup_dir=".context-backup-$(date +%Y%m%d-%H%M%S)"

  show_progress "Creating backup" 1 1
  mkdir -p "$backup_dir"

  if [ -d "context" ]; then
    cp -r context/ "$backup_dir/" 2>/dev/null || true
  fi

  if [ -d ".claude" ]; then
    cp -r .claude/ "$backup_dir/" 2>/dev/null || true
  fi

  log_success "Backup created: $backup_dir"
  log_info "To rollback: cp -r $backup_dir/context . && cp -r $backup_dir/.claude ."
  echo ""

  echo "$backup_dir"
}

# Rollback from backup directory
rollback_from_backup() {
  local backup_dir=$1

  if [ ! -d "$backup_dir" ]; then
    show_error $EXIT_NOT_FOUND "Backup directory not found: $backup_dir"
    return 1
  fi

  show_progress "Rolling back from backup" 1 1

  if [ -d "$backup_dir/context" ]; then
    rm -rf context
    cp -r "$backup_dir/context" .
  fi

  if [ -d "$backup_dir/.claude" ]; then
    rm -rf .claude
    cp -r "$backup_dir/.claude" .
  fi

  log_success "Rolled back to: $backup_dir"
  return 0
}

# =============================================================================
# Preflight Checks
# =============================================================================

# Run preflight checks before command execution
# Validates environment is ready for AI Context System operations
#
# Args:
#   $1 - Check level: "minimal" | "standard" | "full" (default: standard)
#
# Returns:
#   0 if all checks pass, 1 if any fail
#
# Usage:
#   preflight_check "minimal"   # Just check context dir exists
#   preflight_check "standard"  # Context dir + required files
#   preflight_check "full"      # All checks including dependencies
preflight_check() {
  local level="${1:-standard}"
  local failed=0

  log_debug "Running preflight check (level: $level)"

  # Minimal: Check we're in a project with context
  if ! find_context_dir >/dev/null 2>&1; then
    show_error $EXIT_NOT_FOUND "Context directory not found" \
      "Run from project root directory" \
      "Initialize context with /init-context if this is a new project" \
      "Check that context/ folder exists"
    return 1
  fi

  if [ "$level" = "minimal" ]; then
    return 0
  fi

  # Standard: Check required files exist
  local context_dir=$(find_context_dir)
  local required_files=(
    "$context_dir/CONTEXT.md"
    "$context_dir/STATUS.md"
  )

  for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
      log_warn "Missing required file: $file"
      failed=$((failed + 1))
    fi
  done

  if [ $failed -gt 0 ]; then
    show_error $EXIT_VALIDATION "Context system incomplete ($failed missing files)" \
      "Run /init-context to create missing files" \
      "Or run /validate-context for detailed analysis"
    return 1
  fi

  if [ "$level" = "standard" ]; then
    return 0
  fi

  # Full: Check dependencies
  if ! check_dependencies "curl" "git"; then
    return 1
  fi

  # Full: Check CLAUDE.md at root
  if [ ! -f "CLAUDE.md" ] && [ ! -f ".claude/CLAUDE.md" ]; then
    log_warn "CLAUDE.md not found at project root"
    log_info "  Run /init-context or move context/claude.md to ./CLAUDE.md"
  fi

  return 0
}

# =============================================================================
# Dependency Checks
# =============================================================================

# Check if required dependencies are available
# Provides helpful installation instructions if missing
#
# Args:
#   $@ - List of commands to check (e.g., "curl" "git" "jq")
#
# Returns:
#   0 if all dependencies present, 1 if any missing
#
# Usage:
#   check_dependencies "curl" "git"
#   check_dependencies "jq"  # Optional, warns but doesn't fail
check_dependencies() {
  local missing=()
  local optional=("jq")  # These warn but don't fail

  for cmd in "$@"; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
      missing+=("$cmd")
    fi
  done

  if [ ${#missing[@]} -eq 0 ]; then
    return 0
  fi

  # Check if all missing are optional
  local critical=0
  for cmd in "${missing[@]}"; do
    local is_optional=0
    for opt in "${optional[@]}"; do
      if [ "$cmd" = "$opt" ]; then
        is_optional=1
        break
      fi
    done

    if [ $is_optional -eq 1 ]; then
      log_warn "Optional dependency missing: $cmd"
      show_install_hint "$cmd"
    else
      log_error "Required dependency missing: $cmd"
      show_install_hint "$cmd"
      critical=$((critical + 1))
    fi
  done

  if [ $critical -gt 0 ]; then
    return 1
  fi

  return 0
}

# Show installation hints for common dependencies
show_install_hint() {
  local cmd="$1"

  case "$cmd" in
    jq)
      echo "  Install jq for JSON validation:" >&2
      echo "    macOS:  brew install jq" >&2
      echo "    Ubuntu: sudo apt-get install jq" >&2
      echo "    Fedora: sudo dnf install jq" >&2
      ;;
    curl)
      echo "  Install curl for network operations:" >&2
      echo "    macOS:  brew install curl" >&2
      echo "    Ubuntu: sudo apt-get install curl" >&2
      ;;
    git)
      echo "  Install git for version control:" >&2
      echo "    macOS:  brew install git" >&2
      echo "    Ubuntu: sudo apt-get install git" >&2
      ;;
    *)
      echo "  Install $cmd using your package manager" >&2
      ;;
  esac
  echo "" >&2
}

# =============================================================================
# Validation Helpers
# =============================================================================

# Validate that required files exist
validate_context_files() {
  local missing=0

  local required_files=(
    "context/CONTEXT.md"
    "context/STATUS.md"
    "context/SESSIONS.md"
    "context/DECISIONS.md"
    "context/.context-config.json"
  )

  for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
      log_error "Missing required file: $file"
      missing=$((missing + 1))
    fi
  done

  if [ $missing -gt 0 ]; then
    show_error $EXIT_VALIDATION "Context system incomplete ($missing missing files)" \
      "Run /init-context to create missing files" \
      "Or run /validate-context for detailed analysis"
    return 1
  fi

  return 0
}

# Check if JSON file is valid
validate_json() {
  local file=$1

  if [ ! -f "$file" ]; then
    return 1
  fi

  # Try to parse with python if available
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "import json; json.load(open('$file'))" 2>/dev/null
    return $?
  elif command -v python >/dev/null 2>&1; then
    python -c "import json; json.load(open('$file'))" 2>/dev/null
    return $?
  fi

  # Fallback: basic syntax check
  grep -q "^{" "$file" && grep -q "}$" "$file"
  return $?
}

# =============================================================================
# Git Helpers
# =============================================================================

# Check if working directory is clean
git_is_clean() {
  if ! git rev-parse --git-dir >/dev/null 2>&1; then
    return 1  # Not a git repo
  fi

  git diff --quiet && git diff --cached --quiet
  return $?
}

# Get current git branch name
git_current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
}

# =============================================================================
# Session Management Functions
# =============================================================================

# Get the next session number from SESSIONS.md
# This is the single source of truth for session numbering across all commands.
# Usage: get_next_session_number [context_dir]
# Returns: The next session number to use (e.g., if 13 sessions exist, returns 14)
get_next_session_number() {
  local context_dir="${1:-context}"
  local sessions_file="$context_dir/SESSIONS.md"

  # Check if SESSIONS.md exists
  if [ ! -f "$sessions_file" ]; then
    echo "1"
    return 0
  fi

  # Count only actual session entries (not templates or examples)
  # Strategy: Look for "## Session N" where N is a number, but exclude sections after "## Example"
  local count=$(sed -n '1,/^## Example/p' "$sessions_file" | \
                grep "^## Session [0-9]" | \
                grep -v "Template" | \
                wc -l | \
                tr -d ' ' || echo "0")

  # Handle edge case where count is empty
  if [ -z "$count" ] || [ "$count" = "" ]; then
    count=0
  fi

  # Return next session number
  echo $((count + 1))
}

# Get the current session count from SESSIONS.md
# Usage: get_current_session_count [context_dir]
# Returns: The number of existing sessions (e.g., if 13 sessions exist, returns 13)
get_current_session_count() {
  local context_dir="${1:-context}"
  local next=$(get_next_session_number "$context_dir")
  echo $((next - 1))
}

# =============================================================================
# Auto-Timestamp Functions (v3.7.0)
# =============================================================================

# Update "Last Updated" date in a markdown file
# Supports the pattern: **Last Updated:** [anything]
# Cross-platform compatible (macOS + Linux)
#
# Args:
#   $1 - File path to update
#
# Returns:
#   0 on success (even if no timestamp found - that's OK)
#   1 if file doesn't exist
#
# Usage:
#   update_last_modified "context/STATUS.md"
update_last_modified() {
  local file="$1"
  local today=$(date +%Y-%m-%d)

  # Check if file exists
  if [ ! -f "$file" ]; then
    log_debug "update_last_modified: File not found: $file"
    return 1
  fi

  # Check if file has "Last Updated" pattern
  if grep -q '\*\*Last Updated:\*\*' "$file"; then
    # Platform-independent sed
    if sed --version 2>&1 | grep -q GNU; then
      # GNU sed (Linux)
      sed -i "s/\*\*Last Updated:\*\* .*/\*\*Last Updated:\*\* $today/" "$file"
    else
      # BSD sed (macOS)
      sed -i '' "s/\*\*Last Updated:\*\* .*/\*\*Last Updated:\*\* $today/" "$file"
    fi
    log_debug "update_last_modified: Updated timestamp in $file to $today"
    return 0
  fi

  # No timestamp pattern found - that's OK, don't add one
  log_debug "update_last_modified: No timestamp pattern found in $file (skipping)"
  return 0
}

# =============================================================================
# Audit System Functions (v4.0.0)
# =============================================================================

# Get the next audit number for a given audit type
# Scans existing audit files and returns the next number (01, 02, etc.)
#
# Args:
#   $1 - Audit type (e.g., "security", "performance", "database")
#   $2 - Directory to scan (optional, default: "docs/audits")
#
# Returns:
#   Two-digit number string (e.g., "01", "02", "15")
#
# Usage:
#   num=$(get_next_audit_number "security")
#   # Creates: security-audit-01.md, security-audit-02.md, etc.
get_next_audit_number() {
  local audit_type="$1"
  local directory="${2:-docs/audits}"
  local max=0

  # Ensure directory exists
  if [ ! -d "$directory" ]; then
    printf "%02d" 1
    return 0
  fi

  # Find highest existing number for this audit type
  # Use find to avoid glob expansion issues when no files match
  while IFS= read -r file; do
    if [ -n "$file" ] && [ -f "$file" ]; then
      # Extract number from filename (e.g., security-audit-03.md -> 03 -> 3)
      local num=$(echo "$file" | grep -oE '[0-9]+\.md$' | grep -oE '[0-9]+')
      if [ -n "$num" ]; then
        # Remove leading zeros for comparison
        num=$((10#$num))
        [ "$num" -gt "$max" ] && max="$num"
      fi
    fi
  done < <(find "$directory" -maxdepth 1 -name "${audit_type}-audit-*.md" -type f 2>/dev/null)

  # Return next number with zero-padding
  printf "%02d" $((max + 1))
}

# Update the audit INDEX.md with a new entry
# Adds a row to the "Recent Audits" table
#
# Args:
#   $1 - Directory containing INDEX.md (e.g., "docs/audits")
#   $2 - Audit type (e.g., "Security", "Performance")
#   $3 - Audit filename (e.g., "security-audit-01.md")
#   $4 - Grade (e.g., "B+", "A-")
#   $5 - Key findings summary (e.g., "2 high, 5 medium issues")
#
# Returns:
#   0 on success, 1 on failure
#
# Usage:
#   update_audit_index "docs/audits" "Security" "security-audit-01.md" "B+" "2 high, 5 medium"
update_audit_index() {
  local directory="$1"
  local audit_type="$2"
  local filename="$3"
  local grade="$4"
  local findings="$5"
  local index_file="$directory/INDEX.md"
  local today=$(date +%Y-%m-%d)

  # Create INDEX.md from template if it doesn't exist
  if [ ! -f "$index_file" ]; then
    if [ -f "templates/audits-index.template.md" ]; then
      mkdir -p "$directory"
      cp "templates/audits-index.template.md" "$index_file"
      log_info "Created INDEX.md from template"
    else
      log_error "INDEX.md not found and template not available"
      return 1
    fi
  fi

  # Create the new row
  local new_row="| $today | $audit_type | [$filename](./$filename) | $grade | $findings |"

  # Insert new row before the comment marker using awk (more portable than sed for this)
  local marker="<!-- New audit entries will be added above this line -->"
  if grep -q "$marker" "$index_file"; then
    # Use awk for reliable cross-platform insertion
    awk -v row="$new_row" -v marker="$marker" '
      $0 ~ marker { print row }
      { print }
    ' "$index_file" > "$index_file.tmp" && mv "$index_file.tmp" "$index_file"
    log_success "Added audit entry to INDEX.md"
    return 0
  else
    log_warn "Could not find insertion point in INDEX.md"
    return 1
  fi
}

# =============================================================================
# Platform Detection Functions (v4.0.0)
# =============================================================================

# Detect the database platform/ORM in use
# Checks for common database tools in the project
#
# Returns:
#   String: "prisma" | "drizzle" | "typeorm" | "sequelize" | "knex" | "raw" | "unknown"
#
# Usage:
#   platform=$(detect_database_platform)
detect_database_platform() {
  # Check for Prisma
  if [ -f "prisma/schema.prisma" ]; then
    echo "prisma"
    return 0
  fi

  # Check package.json for various ORMs
  if [ -f "package.json" ]; then
    if grep -q '"drizzle-orm"' package.json 2>/dev/null; then
      echo "drizzle"
      return 0
    fi
    if grep -q '"typeorm"' package.json 2>/dev/null; then
      echo "typeorm"
      return 0
    fi
    if grep -q '"sequelize"' package.json 2>/dev/null; then
      echo "sequelize"
      return 0
    fi
    if grep -q '"knex"' package.json 2>/dev/null; then
      echo "knex"
      return 0
    fi
    # Check for raw database drivers
    if grep -qE '"pg"|"mysql2"|"sqlite3"|"better-sqlite3"' package.json 2>/dev/null; then
      echo "raw"
      return 0
    fi
  fi

  echo "unknown"
}

# Detect the hosting/deployment platform
# Checks for platform-specific configuration files and dependencies
#
# Returns:
#   String: "vercel" | "aws" | "cloudflare" | "netlify" | "railway" | "fly" | "unknown"
#
# Usage:
#   platform=$(detect_hosting_platform)
detect_hosting_platform() {
  # Check for Vercel
  if [ -f "vercel.json" ] || [ -d ".vercel" ]; then
    echo "vercel"
    return 0
  fi
  if [ -f "package.json" ] && grep -q '"@vercel/' package.json 2>/dev/null; then
    echo "vercel"
    return 0
  fi

  # Check for AWS
  if [ -f "serverless.yml" ] || [ -f "serverless.yaml" ] || [ -f "sam.yaml" ] || [ -f "template.yaml" ]; then
    echo "aws"
    return 0
  fi
  if [ -d ".aws" ] || [ -f "cdk.json" ]; then
    echo "aws"
    return 0
  fi

  # Check for Cloudflare
  if [ -f "wrangler.toml" ] || [ -f "wrangler.json" ]; then
    echo "cloudflare"
    return 0
  fi

  # Check for Netlify
  if [ -f "netlify.toml" ] || [ -d ".netlify" ]; then
    echo "netlify"
    return 0
  fi

  # Check for Railway
  if [ -f "railway.json" ] || [ -f "railway.toml" ]; then
    echo "railway"
    return 0
  fi

  # Check for Fly.io
  if [ -f "fly.toml" ]; then
    echo "fly"
    return 0
  fi

  echo "unknown"
}

# Detect the web framework in use
# Checks for common JavaScript/TypeScript frameworks
#
# Returns:
#   String: "nextjs" | "remix" | "astro" | "nuxt" | "sveltekit" | "vite" | "express" | "unknown"
#
# Usage:
#   framework=$(detect_framework)
detect_framework() {
  if [ ! -f "package.json" ]; then
    echo "unknown"
    return 0
  fi

  # Check for Next.js
  if grep -q '"next"' package.json 2>/dev/null; then
    echo "nextjs"
    return 0
  fi

  # Check for Remix
  if grep -q '"@remix-run/' package.json 2>/dev/null; then
    echo "remix"
    return 0
  fi

  # Check for Astro
  if grep -q '"astro"' package.json 2>/dev/null; then
    echo "astro"
    return 0
  fi

  # Check for Nuxt
  if grep -q '"nuxt"' package.json 2>/dev/null; then
    echo "nuxt"
    return 0
  fi

  # Check for SvelteKit
  if grep -q '"@sveltejs/kit"' package.json 2>/dev/null; then
    echo "sveltekit"
    return 0
  fi

  # Check for Vite (standalone, not as part of another framework)
  if grep -q '"vite"' package.json 2>/dev/null && \
     ! grep -qE '"astro"|"nuxt"|"@sveltejs/kit"' package.json 2>/dev/null; then
    echo "vite"
    return 0
  fi

  # Check for Express
  if grep -q '"express"' package.json 2>/dev/null; then
    echo "express"
    return 0
  fi

  echo "unknown"
}

# =============================================================================
# Initialization
# =============================================================================

# =============================================================================
# Documentation Currency Functions (v3.4.0)
# =============================================================================

# Calculate days since a given date
# Usage: days_since_date "2025-11-10"
# Returns: Number of days since the date (or -1 if invalid date)
days_since_date() {
  local date_string="$1"

  # Handle empty input
  if [ -z "$date_string" ]; then
    echo "-1"
    return 1
  fi

  # Convert date string to epoch seconds (platform-independent approach)
  local date_epoch
  if date -j -f "%Y-%m-%d" "$date_string" "+%s" >/dev/null 2>&1; then
    # BSD/macOS date command
    date_epoch=$(date -j -f "%Y-%m-%d" "$date_string" "+%s" 2>/dev/null)
  elif date -d "$date_string" "+%s" >/dev/null 2>&1; then
    # GNU date command (Linux)
    date_epoch=$(date -d "$date_string" "+%s" 2>/dev/null)
  else
    # Date parsing failed
    echo "-1"
    return 1
  fi

  # Get current time in epoch seconds
  local now_epoch=$(date "+%s")

  # Calculate difference in days
  local diff_seconds=$((now_epoch - date_epoch))
  local days=$((diff_seconds / 86400))

  echo "$days"
  return 0
}

# Calculate days since a file was last modified
# Usage: days_since_file_modified "/path/to/file.md"
# Returns: Number of days since last modification (or -1 if file doesn't exist)
days_since_file_modified() {
  local file_path="$1"

  # Check if file exists
  if [ ! -f "$file_path" ]; then
    echo "-1"
    return 1
  fi

  # Get file modification time in epoch seconds (platform-independent)
  local file_epoch
  if stat -f%m "$file_path" >/dev/null 2>&1; then
    # BSD/macOS stat command
    file_epoch=$(stat -f%m "$file_path" 2>/dev/null)
  elif stat -c%Y "$file_path" >/dev/null 2>&1; then
    # GNU stat command (Linux)
    file_epoch=$(stat -c%Y "$file_path" 2>/dev/null)
  else
    # stat failed
    echo "-1"
    return 1
  fi

  # Get current time in epoch seconds
  local now_epoch=$(date "+%s")

  # Calculate difference in days
  local diff_seconds=$((now_epoch - file_epoch))
  local days=$((diff_seconds / 86400))

  echo "$days"
  return 0
}

# =============================================================================

# Run auto-update check in background (non-blocking)
# Only if not already running and not in quiet mode
if [ "$VERBOSITY" != "quiet" ] && [ -z "$UPDATE_CHECK_RUNNING" ]; then
  export UPDATE_CHECK_RUNNING=1
  check_for_updates &
fi

# Log that common functions were loaded (debug only)
log_debug "Loaded common-functions.sh v4.0.1"
