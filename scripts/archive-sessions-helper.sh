#!/bin/bash
# Archive old sessions from SESSIONS.md
# Version: 4.0.1
#
# Usage:
#   ./archive-sessions-helper.sh [--keep N] [--context DIR]
#
# Options:
#   --keep N        Keep N most recent sessions (default: 10)
#   --context DIR   Context directory (default: context)
#   --no-backup     Skip backup creation (not recommended)
#   --dry-run       Show what would be done without making changes
#   --force         Skip confirmation prompts (for automation)

set -e

# Source common functions for colors and exit codes (if available)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/common-functions.sh" ]; then
  source "$SCRIPT_DIR/common-functions.sh"
fi

# Cleanup function to remove temp files on exit
cleanup() {
  rm -f "$TEMP_FILE" "$ARCHIVE_TEMP" 2>/dev/null
}
trap cleanup EXIT ERR

# Default values
KEEP_RECENT=10
CONTEXT_DIR="context"
CREATE_BACKUP=true
DRY_RUN=false
FORCE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --keep)
      KEEP_RECENT="$2"
      shift 2
      ;;
    --context)
      CONTEXT_DIR="$2"
      if [ ! -d "$CONTEXT_DIR" ]; then
        echo "❌ Error: Context directory does not exist: $CONTEXT_DIR"
        exit 1
      fi
      shift 2
      ;;
    --no-backup)
      CREATE_BACKUP=false
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--keep N] [--context DIR] [--no-backup] [--dry-run] [--force]"
      exit 1
      ;;
  esac
done

# File paths
SESSIONS_FILE="$CONTEXT_DIR/SESSIONS.md"
BACKUP_FILE="$SESSIONS_FILE.backup"
YEAR=$(date +%Y)
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
ARCHIVE_FILE="$CONTEXT_DIR/SESSIONS-archive-$TIMESTAMP.md"
TEMP_FILE="$SESSIONS_FILE.tmp"

# Validate inputs
if [ ! -f "$SESSIONS_FILE" ]; then
  echo "❌ Error: $SESSIONS_FILE not found"
  exit 1
fi

if ! [[ "$KEEP_RECENT" =~ ^[0-9]+$ ]]; then
  echo "❌ Error: --keep must be a number"
  exit 1
fi

echo "📦 AI Context System - Session Archiving"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Sessions file: $SESSIONS_FILE"
echo "   Keep recent: $KEEP_RECENT sessions"
echo "   Archive file: $ARCHIVE_FILE"
echo ""

# Count total sessions (exclude Session Index header)
# Match one or more digits to handle sessions 1-9, 10-99, etc.
TOTAL_SESSIONS=$(grep -cE "^## Session [0-9]+" "$SESSIONS_FILE" 2>/dev/null || echo "0")

if [ "$TOTAL_SESSIONS" -eq 0 ]; then
  echo "ℹ️  No sessions found in $SESSIONS_FILE"
  exit 0
fi

echo "📊 Found $TOTAL_SESSIONS total sessions"

# Check if archiving is needed
if [ "$TOTAL_SESSIONS" -le "$KEEP_RECENT" ]; then
  echo "✅ No archiving needed ($TOTAL_SESSIONS sessions ≤ $KEEP_RECENT keep)"
  exit 0
fi

SESSIONS_TO_ARCHIVE=$((TOTAL_SESSIONS - KEEP_RECENT))
echo "📁 Will archive $SESSIONS_TO_ARCHIVE old sessions"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo "🔍 DRY RUN - No changes will be made"
  echo "   Would keep last $KEEP_RECENT sessions"
  echo "   Would archive first $SESSIONS_TO_ARCHIVE sessions to $ARCHIVE_FILE"
  exit 0
fi

# Create backup
if [ "$CREATE_BACKUP" = true ]; then
  echo "💾 Creating backup..."
  cp "$SESSIONS_FILE" "$BACKUP_FILE"
  echo "   ✅ Backup saved: $BACKUP_FILE"
fi

# Extract header and Session Index
echo "📝 Processing SESSIONS.md..."

# Find where sessions start (after "---" following Session Index)
HEADER_END=$(grep -n "^---$" "$SESSIONS_FILE" | head -1 | cut -d: -f1)

if [ -z "$HEADER_END" ]; then
  echo "❌ Error: Could not find session separator (---)"
  exit 1
fi

# Extract header (includes "# Sessions", "## Session Index", and "---")
head -n "$HEADER_END" "$SESSIONS_FILE" > "$TEMP_FILE"

# Find session boundaries - get line numbers where "## Session N" appears
# Use -E for extended regex to match one or more digits
# Use portable while loop instead of mapfile (bash 3.2 compatible)
SESSION_LINES=()
while IFS= read -r line; do
  SESSION_LINES+=("$line")
done < <(grep -nE "^## Session [0-9]+" "$SESSIONS_FILE" | cut -d: -f1)

if [ "${#SESSION_LINES[@]}" -ne "$TOTAL_SESSIONS" ]; then
  echo "❌ Error: Session count mismatch (found ${#SESSION_LINES[@]}, expected $TOTAL_SESSIONS)"
  rm -f "$TEMP_FILE"
  exit 1
fi

# Calculate which sessions to keep (last N)
KEEP_START_INDEX=$((TOTAL_SESSIONS - KEEP_RECENT))

# Extract sessions to archive (first SESSIONS_TO_ARCHIVE)
echo "📦 Creating archive file..."

# Extract actual session numbers from headers (not line numbers)
FIRST_SESSION_LINE=$(sed -n "${SESSION_LINES[0]}p" "$SESSIONS_FILE")
FIRST_SESSION_NUM=$(echo "$FIRST_SESSION_LINE" | grep -oE 'Session [0-9]+' | grep -oE '[0-9]+')

LAST_SESSION_LINE=$(sed -n "${SESSION_LINES[$((KEEP_START_INDEX - 1))]}p" "$SESSIONS_FILE")
LAST_SESSION_NUM=$(echo "$LAST_SESSION_LINE" | grep -oE 'Session [0-9]+' | grep -oE '[0-9]+')

# Create new archive file (timestamp ensures uniqueness, no need to check for existing file)
ARCHIVE_TEMP="$ARCHIVE_FILE.tmp"
cat > "$ARCHIVE_TEMP" << EOF
# Archived Sessions ($DATE)

This file contains archived sessions from SESSIONS.md.

**Archived:** $TIMESTAMP
**Sessions:** Session $FIRST_SESSION_NUM through Session $LAST_SESSION_NUM

---

EOF

# Extract old sessions for archive
for i in $(seq 0 $((KEEP_START_INDEX - 1))); do
  SESSION_START="${SESSION_LINES[$i]}"

  # Find end of this session (start of next session, or end of file)
  if [ $((i + 1)) -lt "$TOTAL_SESSIONS" ]; then
    SESSION_END=$((${SESSION_LINES[$((i + 1))]} - 1))
  else
    SESSION_END=$(wc -l < "$SESSIONS_FILE" | tr -d ' ')
  fi

  # Validate session header before extraction
  FIRST_LINE=$(sed -n "${SESSION_START}p" "$SESSIONS_FILE")
  if ! echo "$FIRST_LINE" | grep -qE "^## Session [0-9]+"; then
    echo "❌ Error: Invalid session header at line $SESSION_START"
    echo "   Expected: ## Session N"
    echo "   Found: $FIRST_LINE"
    exit 1
  fi

  # Extract session
  sed -n "${SESSION_START},${SESSION_END}p" "$SESSIONS_FILE" >> "$ARCHIVE_TEMP"

  # Only add separator if not last session
  if [ $i -lt $((KEEP_START_INDEX - 1)) ]; then
    echo "" >> "$ARCHIVE_TEMP"
  fi
done

mv "$ARCHIVE_TEMP" "$ARCHIVE_FILE"
echo "   ✅ Archived $SESSIONS_TO_ARCHIVE sessions to $ARCHIVE_FILE"

# Build new SESSIONS.md with last N sessions
echo "✂️  Keeping last $KEEP_RECENT sessions..."

for i in $(seq "$KEEP_START_INDEX" $((TOTAL_SESSIONS - 1))); do
  SESSION_START="${SESSION_LINES[$i]}"

  # Find end of this session
  if [ $((i + 1)) -lt "$TOTAL_SESSIONS" ]; then
    SESSION_END=$((${SESSION_LINES[$((i + 1))]} - 1))
  else
    SESSION_END=$(wc -l < "$SESSIONS_FILE" | tr -d ' ')
  fi

  # Validate session header before extraction
  FIRST_LINE=$(sed -n "${SESSION_START}p" "$SESSIONS_FILE")
  if ! echo "$FIRST_LINE" | grep -qE "^## Session [0-9]+"; then
    echo "❌ Error: Invalid session header at line $SESSION_START"
    echo "   Expected: ## Session N"
    echo "   Found: $FIRST_LINE"
    exit 1
  fi

  # Extract session
  sed -n "${SESSION_START},${SESSION_END}p" "$SESSIONS_FILE" >> "$TEMP_FILE"

  # Only add separator if not last session
  if [ $i -lt $((TOTAL_SESSIONS - 1)) ]; then
    echo "" >> "$TEMP_FILE"
  fi
done

# Replace original file (with validation to prevent data loss)
if [ -f "$TEMP_FILE" ] && [ -s "$TEMP_FILE" ]; then
  mv "$TEMP_FILE" "$SESSIONS_FILE"
else
  echo "❌ Error: Generated SESSIONS.md is empty or missing"
  echo "   This should not happen. Backup is at: $BACKUP_FILE"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Archiving complete!"
echo ""
echo "📊 Summary:"
echo "   Main file: $KEEP_RECENT sessions (kept)"
echo "   Archive file: $SESSIONS_TO_ARCHIVE sessions (archived)"
echo "   Total: $TOTAL_SESSIONS sessions (no data loss)"
echo ""
echo "💾 Backup: $BACKUP_FILE"
echo "📦 Archive: $ARCHIVE_FILE"
echo ""
echo "ℹ️  To restore from backup: cp $BACKUP_FILE $SESSIONS_FILE"
