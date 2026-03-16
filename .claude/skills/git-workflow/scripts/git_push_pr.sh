#!/bin/bash
# Git Push and Create PR Script
set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
print_error() { echo -e "${RED}❌ Error: $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    print_error "Cannot create PR from $CURRENT_BRANCH branch"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes"
    exit 1
fi

PR_TITLE="$1"
if [ -z "$PR_TITLE" ]; then
    PR_TITLE=$(git log -1 --pretty=%B)
fi

print_info "Pushing branch '$CURRENT_BRANCH'..."
git push -u origin "$CURRENT_BRANCH"
print_success "Branch pushed successfully"

if command -v gh &> /dev/null; then
    gh pr create --title "$PR_TITLE" --body "${2:-}" --web
else
    print_info "GitHub CLI not found. Create PR manually on GitHub"
fi
