#!/bin/bash

# Find context folder by checking current directory and up to 2 parent directories
# Returns the relative path to context folder or exits with error
#
# Usage:
#   source "$(dirname "${BASH_SOURCE[0]}")/../scripts/find-context-folder.sh" || exit 1
#   CONTEXT_DIR=$(find_context_folder) || exit 1
#
# Version: 4.0.1

find_context_folder() {
  local current_dir="$PWD"

  # Check current directory
  if [ -d "context" ] && [ -f "context/.context-config.json" ]; then
    echo "context"
    return 0
  fi

  # Check parent directory
  if [ -d "../context" ] && [ -f "../context/.context-config.json" ]; then
    echo "../context"
    return 0
  fi

  # Check grandparent directory
  if [ -d "../../context" ] && [ -f "../../context/.context-config.json" ]; then
    echo "../../context"
    return 0
  fi

  # Not found - provide helpful error
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
  echo "❌ Context folder not found" >&2
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
  echo "" >&2
  echo "Searched:" >&2
  echo "  - $PWD/context/" >&2
  echo "  - $PWD/../context/" >&2
  echo "  - $PWD/../../context/" >&2
  echo "" >&2
  echo "Current directory: $PWD" >&2
  echo "" >&2
  echo "To initialize context system:" >&2
  echo "  1. Navigate to your project root" >&2
  echo "  2. Run: /init-context" >&2
  echo "" >&2
  echo "If context folder exists elsewhere:" >&2
  echo "  - Commands work from project root" >&2
  echo "  - Commands work from subdirectories (up to 2 levels deep)" >&2
  echo "  - Example: backend/, frontend/, src/, etc." >&2
  echo "" >&2
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >&2
  return 1
}

# If sourced, define the function
# If executed directly, run the function
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  find_context_folder
fi
