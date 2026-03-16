#!/bin/bash
# Git Commit Script
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
print_error() { echo -e "${RED}❌ Error: $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

VALID_TYPES=("feat" "fix" "refactor" "docs" "test" "chore" "style" "perf")

if [ -z "$1" ] || [ -z "$2" ]; then
    print_error "Type and message are required"
    echo "Usage: $0 <type> <message> [files or --all]"
    echo "Valid types: ${VALID_TYPES[*]}"
    exit 1
fi

TYPE="$1"
MESSAGE="$2"
shift 2
FILES="$@"

if [[ ! " ${VALID_TYPES[@]} " =~ " ${TYPE} " ]]; then
    print_error "Invalid commit type: $TYPE"
    exit 1
fi

if [ -z "$FILES" ] || [ "$FILES" == "--all" ]; then
    git add -A
else
    git add $FILES
fi

COMMIT_MESSAGE="${TYPE}: ${MESSAGE}"
git commit -m "$COMMIT_MESSAGE"

print_success "Changes committed successfully"
