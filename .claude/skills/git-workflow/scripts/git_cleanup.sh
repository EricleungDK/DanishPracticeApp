#!/bin/bash
# Git Cleanup Script
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
print_error() { echo -e "${RED}❌ Error: $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

BRANCH_TO_DELETE="$1"
if [ -z "$BRANCH_TO_DELETE" ]; then
    BRANCH_TO_DELETE=$(git rev-parse --abbrev-ref HEAD)
fi

if [ "$BRANCH_TO_DELETE" = "main" ] || [ "$BRANCH_TO_DELETE" = "master" ]; then
    print_error "Cannot delete $BRANCH_TO_DELETE branch"
    exit 1
fi

BASE_BRANCH="main"
if ! git show-ref --verify --quiet refs/heads/main; then
    BASE_BRANCH="master"
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "$BRANCH_TO_DELETE" ]; then
    git checkout "$BASE_BRANCH"
fi

git pull origin "$BASE_BRANCH"
git branch -D "$BRANCH_TO_DELETE"

print_success "Branch '$BRANCH_TO_DELETE' deleted"
