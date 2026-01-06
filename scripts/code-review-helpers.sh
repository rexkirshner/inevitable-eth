#!/bin/bash
# Code Review Helper Functions
# Version: 4.0.1
#
# Modular helper functions for /code-review command enhancements:
# - Smart issue grouping
# - TodoWrite generation
# - Context system integration (KNOWN_ISSUES.md, STATUS.md)
# - Review history tracking
# - Review comparison logic
#
# Usage:
#   source scripts/code-review-helpers.sh
#   source scripts/common-functions.sh  # Required dependency
#
# Functions provided:
#   - group_similar_issues()      Smart grouping of related issues
#   - generate_todowrite_tasks()  Convert issues to TodoWrite format
#   - add_to_known_issues()       Integrate critical issues into KNOWN_ISSUES.md
#   - update_status_summary()     Add review summary to STATUS.md
#   - create_review_history()     Track review in INDEX.md
#   - compare_with_previous()     Compare current review with previous

# =============================================================================
# Constants and Configuration
# =============================================================================

# Issue severity levels
export SEVERITY_CRITICAL="CRITICAL"
export SEVERITY_HIGH="HIGH"
export SEVERITY_MEDIUM="MEDIUM"
export SEVERITY_LOW="LOW"

# Smart grouping thresholds
export MIN_GROUP_SIZE=3          # Minimum issues to create a group
export MAX_INDIVIDUAL_TASKS=50   # Max individual tasks before suggesting group review

# TodoWrite task states
export TASK_STATUS_PENDING="pending"
export TASK_STATUS_IN_PROGRESS="in_progress"
export TASK_STATUS_COMPLETED="completed"

# =============================================================================
# Smart Issue Grouping
# =============================================================================

# Group similar issues together to create more actionable TodoWrite tasks
#
# Input: JSON array of issues from code review
#   [
#     {
#       "id": "M1",
#       "severity": "MEDIUM",
#       "message": "Missing type definition for @testing-library/jest-dom",
#       "file": "tests/auth.test.ts",
#       "line": 15,
#       "category": "TypeScript"
#     },
#     ...
#   ]
#
# Output: JSON array of grouped issues
#   [
#     {
#       "type": "grouped",
#       "title": "Fix missing type definitions for @testing-library/jest-dom (25 files affected)",
#       "severity": "MEDIUM",
#       "count": 25,
#       "files": ["tests/auth.test.ts", ...],
#       "issues": ["M1", "M2", ...]
#     },
#     {
#       "type": "individual",
#       "title": "Fix SQL injection in search API",
#       "severity": "CRITICAL",
#       "file": "api/search.ts",
#       "line": 123,
#       "issue_id": "C1"
#     }
#   ]
#
# Grouping strategies:
#   1. Exact message match (e.g., "Missing type definition for X")
#   2. File pattern match (e.g., api/auth/*.ts)
#   3. Fix strategy match (e.g., same remediation approach)
#
# Args:
#   $1 - Path to JSON file containing issues
#   $2 - Output path for grouped issues JSON
#
# Returns:
#   0 on success, 1 on failure
group_similar_issues() {
  local input_json=$1
  local output_json=$2

  if [ ! -f "$input_json" ]; then
    log_error "Input JSON file not found: $input_json"
    return 1
  fi

  log_info "Analyzing issues for smart grouping..."

  # Use jq for JSON processing (check if available)
  if ! command -v jq &> /dev/null; then
    log_warn "jq not found - grouping disabled, will create individual tasks"
    cp "$input_json" "$output_json"
    return 0
  fi

  # Group issues by normalized message
  jq '
    # First, create a map to preserve full issue data
    . as $all_issues |
    # Group by message similarity
    group_by(.message) |
    map({
      message: .[0].message,
      severity: .[0].severity,
      category: .[0].category,
      impact: .[0].impact,
      issues: .,
      count: length
    }) |
    # Transform into grouped or individual tasks
    map(
      if .count >= 3 then
        {
          type: "grouped",
          title: "\(.message) (\(.count) files affected)",
          severity: .severity,
          category: .category,
          impact: .impact,
          count: .count,
          files: [.issues[].file],
          issue_ids: [.issues[].id]
        }
      else
        .issues | map({
          type: "individual",
          title: .message,
          severity: .severity,
          category: .category,
          impact: .impact,
          file: .file,
          line: .line,
          issue_id: .id
        })
      end
    ) |
    flatten
  ' "$input_json" > "$output_json"

  local group_count=$(jq '[.[] | select(.type == "grouped")] | length' "$output_json")
  local individual_count=$(jq '[.[] | select(.type == "individual")] | length' "$output_json")

  log_success "Grouped issues: $group_count groups, $individual_count individual tasks"
  return 0
}

# =============================================================================
# TodoWrite Task Generation
# =============================================================================

# Generate TodoWrite tasks from review findings
#
# Creates tasks in format:
#   - [pending] Fix SQL injection in search API (api/search.ts:123)
#   - [pending] Fix missing type definitions for @testing-library/jest-dom (25 files affected)
#
# Args:
#   $1 - Path to grouped issues JSON (from group_similar_issues)
#   $2 - Severity threshold (CRITICAL, HIGH, MEDIUM, LOW)
#   $3 - Output file for TodoWrite markdown
#
# Returns:
#   0 on success, 1 on failure
generate_todowrite_tasks() {
  local grouped_json=$1
  local severity_threshold=${2:-HIGH}
  local output_file=$3

  if [ ! -f "$grouped_json" ]; then
    log_error "Grouped issues JSON not found: $grouped_json"
    return 1
  fi

  log_info "Generating TodoWrite tasks (threshold: $severity_threshold)..."

  # Initialize output
  {
    echo "# Code Review Tasks"
    echo ""
    echo "**Generated:** $(date '+%Y-%m-%d %H:%M:%S')"
    echo "**Severity Threshold:** $severity_threshold"
    echo ""
    echo "## Critical Issues"
    echo ""
  } > "$output_file"

  # Define severity levels and their numeric values for comparison
  declare -A sev_value=( ["CRITICAL"]=4 ["HIGH"]=3 ["MEDIUM"]=2 ["LOW"]=1 )
  local threshold_value=${sev_value[$severity_threshold]}

  # Generate tasks for each severity level at or above threshold
  local severities=("CRITICAL" "HIGH" "MEDIUM" "LOW")

  for sev in "${severities[@]}"; do
    local current_value=${sev_value[$sev]}

    # Include this severity if it's >= threshold
    if [ "$current_value" -ge "$threshold_value" ]; then
      # Extract tasks for this severity
      jq -r --arg sev "$sev" '
        .[] |
        select(.severity == $sev) |
        if .type == "grouped" then
          "- [pending] \(.title)\n  Context: \(.count) files affected\n  Severity: \(.severity)\n  Issue IDs: \(.issue_ids | join(", "))\n"
        else
          "- [pending] \(.title) (\(.file):\(.line))\n  Severity: \(.severity)\n  Issue ID: \(.issue_id)\n"
        end
      ' "$grouped_json" >> "$output_file"
    fi
  done

  local task_count=$(grep -c "^\- \[pending\]" "$output_file" || echo "0")
  log_success "Generated $task_count TodoWrite tasks"

  return 0
}

# =============================================================================
# Context System Integration
# =============================================================================

# Add critical issues to KNOWN_ISSUES.md
#
# Format:
#   ## [CRITICAL] SQL Injection Vulnerability in Search API
#   **Found:** 2025-11-17 (Code Review - Session 20)
#   **Location:** `api/search.ts:123`
#   **Impact:** User input directly concatenated into SQL query
#   **Severity:** CRITICAL (Security)
#   **Review:** See [Code Review Report](../artifacts/code-reviews/review-2025-11-17.md#C1)
#   **Status:** 🔴 Open
#
# Args:
#   $1 - Path to issues JSON
#   $2 - Path to KNOWN_ISSUES.md
#   $3 - Session number
#   $4 - Review report path (relative to KNOWN_ISSUES.md)
#   $5 - Severity threshold (default: CRITICAL)
#
# Returns:
#   0 on success, 1 on failure
add_to_known_issues() {
  local issues_json=$1
  local known_issues_file=$2
  local session_num=$3
  local review_path=$4
  local severity_threshold=${5:-CRITICAL}

  if [ ! -f "$issues_json" ]; then
    log_error "Issues JSON not found: $issues_json"
    return 1
  fi

  if [ ! -f "$known_issues_file" ]; then
    log_warn "KNOWN_ISSUES.md not found, creating: $known_issues_file"
    {
      echo "# Known Issues"
      echo ""
      echo "This file tracks critical and high-priority issues discovered in code reviews."
      echo ""
    } > "$known_issues_file"
  fi

  log_info "Adding ${severity_threshold} issues to KNOWN_ISSUES.md..."

  local today=$(date '+%Y-%m-%d')
  local temp_file=$(mktemp)

  # Extract issues matching severity threshold
  jq -r --arg sev "$severity_threshold" --arg date "$today" --arg session "$session_num" --arg review "$review_path" '
    .[] |
    select(.severity == $sev) |
    select(.type == "individual") |
    "
## [\(.severity)] \(.title)
**Found:** \($date) (Code Review - Session \($session))
**Location:** `\(.file):\(.line)`
**Impact:** \(.impact // "See review for details")
**Severity:** \(.severity) (\(.category))
**Review:** See [Code Review Report](\($review)#\(.issue_id))
**Status:** 🔴 Open
"
  ' "$issues_json" > "$temp_file"

  # Append to KNOWN_ISSUES.md
  if [ -s "$temp_file" ]; then
    cat "$temp_file" >> "$known_issues_file"
    local count=$(grep -c "^## \[$severity_threshold\]" "$temp_file" || echo "0")
    log_success "Added $count ${severity_threshold} issues to KNOWN_ISSUES.md"
    rm "$temp_file"
    return 0
  else
    log_info "No ${severity_threshold} issues to add"
    rm "$temp_file"
    return 0
  fi
}

# Update STATUS.md with review summary
#
# Adds entry under "Recent Changes" section:
#   ### Code Review - Session 20 (2025-11-17)
#   **Grade:** B (needs improvement before production)
#   **Critical Issues:** 3 🔴
#   **High Priority:** 5 ⚠️
#   **Full Report:** [Code Review Details](../artifacts/code-reviews/review-2025-11-17.md)
#
# Args:
#   $1 - Path to STATUS.md
#   $2 - Session number
#   $3 - Grade (A, B, C, D, F)
#   $4 - Critical count
#   $5 - High count
#   $6 - Medium count
#   $7 - Review report path (relative to STATUS.md)
#
# Returns:
#   0 on success, 1 on failure
update_status_summary() {
  local status_file=$1
  local session_num=$2
  local grade=$3
  local critical_count=$4
  local high_count=$5
  local medium_count=$6
  local review_path=$7

  if [ ! -f "$status_file" ]; then
    log_error "STATUS.md not found: $status_file"
    return 1
  fi

  log_info "Updating STATUS.md with review summary..."

  local today=$(date '+%Y-%m-%d')
  local temp_file=$(mktemp)

  # Create summary entry
  {
    echo ""
    echo "### Code Review - Session $session_num ($today)"
    echo "**Grade:** $grade"
    if [ "$critical_count" -gt 0 ]; then
      echo "**Critical Issues:** $critical_count 🔴"
    fi
    if [ "$high_count" -gt 0 ]; then
      echo "**High Priority:** $high_count ⚠️"
    fi
    if [ "$medium_count" -gt 0 ]; then
      echo "**Medium Priority:** $medium_count"
    fi
    echo "**Full Report:** [Code Review Details]($review_path)"
    echo ""
  } > "$temp_file"

  # Find "Recent Changes" section or append at end
  if grep -q "## Recent Changes" "$status_file"; then
    # Insert after "## Recent Changes" header
    sed -i.bak '/^## Recent Changes$/r '"$temp_file" "$status_file"
    rm "${status_file}.bak"
  else
    # Append at end
    {
      echo ""
      echo "## Recent Changes"
      cat "$temp_file"
    } >> "$status_file"
  fi

  rm "$temp_file"
  log_success "Updated STATUS.md with review summary"
  return 0
}

# =============================================================================
# Review History Tracking
# =============================================================================

# Create or update review history INDEX.md
#
# Format:
#   # Code Review History
#
#   | Date       | Session | Grade | Critical | High | Medium | Low | Files | Status    |
#   |------------|---------|-------|----------|------|--------|-----|-------|-----------|
#   | 2025-11-17 | 21      | A+    | 0        | 0    | 2      | 5   | 45    | ✅ Passing |
#   | 2025-11-16 | 20      | B     | 3        | 5    | 34     | 12  | 45    | ⚠️ Issues  |
#
# Args:
#   $1 - Path to INDEX.md
#   $2 - Session number
#   $3 - Grade
#   $4 - Critical count
#   $5 - High count
#   $6 - Medium count
#   $7 - Low count
#   $8 - Files reviewed
#   $9 - Review report filename
#
# Returns:
#   0 on success, 1 on failure
create_review_history() {
  local index_file=$1
  local session_num=$2
  local grade=$3
  local critical=$4
  local high=$5
  local medium=$6
  local low=$7
  local files=$8
  local report_file=$9

  local today=$(date '+%Y-%m-%d')
  local status="✅ Passing"

  if [ "$critical" -gt 0 ]; then
    status="🔴 Critical"
  elif [ "$high" -gt 0 ]; then
    status="⚠️ Issues"
  fi

  # Create INDEX.md if it doesn't exist
  if [ ! -f "$index_file" ]; then
    {
      echo "# Code Review History"
      echo ""
      echo "## Summary"
      echo ""
      echo "| Date       | Session | Grade | Critical | High | Medium | Low | Files | Status    |"
      echo "|------------|---------|-------|----------|------|--------|-----|-------|-----------|"
    } > "$index_file"
  fi

  # Add new entry (insert after table header)
  local new_entry="| $today | $session_num | $grade | $critical | $high | $medium | $low | $files | $status |"

  # Create temp file with new entry inserted
  local temp_file=$(mktemp)
  awk -v entry="$new_entry" '
    /^\|------------\|/ {
      print
      print entry
      next
    }
    { print }
  ' "$index_file" > "$temp_file"
  mv "$temp_file" "$index_file"

  log_success "Updated review history INDEX.md"
  return 0
}

# =============================================================================
# Review Comparison Logic
# =============================================================================

# Compare current review with previous review
#
# Detects:
#   - Resolved issues (in previous, not in current)
#   - Still open issues (in both)
#   - New issues (in current, not in previous)
#   - Grade change
#   - Time elapsed
#
# Args:
#   $1 - Current review issues JSON
#   $2 - Previous review issues JSON
#   $3 - Output comparison JSON
#
# Returns:
#   0 on success, 1 on failure
compare_with_previous() {
  local current_json=$1
  local previous_json=$2
  local output_json=$3

  if [ ! -f "$current_json" ]; then
    log_error "Current review JSON not found: $current_json"
    return 1
  fi

  if [ ! -f "$previous_json" ]; then
    log_info "No previous review found - this is the first review"
    echo '{"first_review": true}' > "$output_json"
    return 0
  fi

  log_info "Comparing with previous review..."

  # Use jq to perform comparison
  # Note: jq -s creates array [current, previous]
  jq -s '
    # Extract issue IDs from both reviews
    (.[0] | map(.id)) as $current_ids |
    (.[1] | map(.id)) as $previous_ids |

    # Calculate differences
    ($previous_ids - $current_ids) as $resolved_ids |
    ($current_ids - $previous_ids) as $new_ids |
    ($current_ids | map(select(. as $id | $previous_ids | contains([$id])))) as $still_open_ids |

    {
      previous_review: {
        issues: .[1],
        count: (.[1] | length)
      },
      current_review: {
        issues: .[0],
        count: (.[0] | length)
      },
      resolved: (.[1] | map(select(.id as $id | $resolved_ids | contains([$id])))),
      still_open: (.[0] | map(select(.id as $id | $still_open_ids | contains([$id])))),
      new_issues: (.[0] | map(select(.id as $id | $new_ids | contains([$id])))),
      resolved_count: ($resolved_ids | length),
      still_open_count: ($still_open_ids | length),
      new_issues_count: ($new_ids | length)
    }
  ' "$current_json" "$previous_json" > "$output_json"

  local resolved=$(jq '.resolved_count' "$output_json")
  local still_open=$(jq '.still_open_count' "$output_json")
  local new=$(jq '.new_issues_count' "$output_json")

  log_success "Comparison complete: $resolved resolved, $still_open still open, $new new"
  return 0
}

# =============================================================================
# Utility Functions
# =============================================================================

# Find most recent review in artifacts/code-reviews/
#
# Returns:
#   Path to most recent review JSON (or empty if none found)
find_latest_review() {
  local reviews_dir="artifacts/code-reviews"

  if [ ! -d "$reviews_dir" ]; then
    echo ""
    return 0
  fi

  # Find most recent review JSON file
  find "$reviews_dir" -name "*.json" -type f -print0 |
    xargs -0 ls -t 2>/dev/null |
    head -1
}

# Extract session number from review filename
#
# Args:
#   $1 - Review filename (e.g., "session-20-review.md")
#
# Returns:
#   Session number (or "unknown")
extract_session_number() {
  local filename=$1
  # Use grep -oE for better portability (works on both macOS and Linux)
  local num=$(echo "$filename" | grep -oE 'session-[0-9]+' | grep -oE '[0-9]+' | head -1)
  if [ -n "$num" ]; then
    echo "$num"
  else
    echo "unknown"
  fi
}

# =============================================================================
# Initialization
# =============================================================================

log_debug "Loaded code-review-helpers.sh v3.4.0"
