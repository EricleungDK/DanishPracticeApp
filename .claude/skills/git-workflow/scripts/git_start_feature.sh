#!/bin/bash
# Git Start Feature Script
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
print_error() { echo -e "${RED}❌ Error: $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

if [ -z "$1" ]; then
    print_error "Branch name is required"
    echo "Usage: $0 <branch-name> [base-branch]"
    exit 1
fi

BRANCH_NAME="$1"
BASE_BRANCH="${2:-main}"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes"
    git status --short
    exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
    print_error "Base branch '$BASE_BRANCH' does not exist"
    exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    print_error "Branch '$BRANCH_NAME' already exists"
    exit 1
fi

print_info "Updating $BASE_BRANCH..."
git checkout "$BASE_BRANCH"
git pull origin "$BASE_BRANCH"

print_info "Creating branch '$BRANCH_NAME'..."
git checkout -b "$BRANCH_NAME"

print_success "Successfully created and switched to branch '$BRANCH_NAME'"
