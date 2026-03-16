#!/bin/bash
# Git Full Pipeline Script
set -e
GREEN='\033[0;32m'; NC='\033[0m'
print_step() { echo -e "\n${GREEN}━━━ $1 ━━━${NC}\n"; }

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Usage: $0 <branch-name> <commit-type> <commit-message> [pr-title]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_step "Creating feature branch"
"$SCRIPT_DIR/git_start_feature.sh" "$1"

print_step "Committing changes"
"$SCRIPT_DIR/git_commit.sh" "$2" "$3"

print_step "Pushing and creating PR"
"$SCRIPT_DIR/git_push_pr.sh" "${4:-$3}"

echo -e "${GREEN}✅ Full pipeline complete!${NC}"
