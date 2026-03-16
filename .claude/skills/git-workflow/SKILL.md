---
name: git-workflow
description: Automates Git workflows for production development. Use when user mentions branching, committing, pushing, creating PRs, or cleaning up branches. Handles feature branch creation, conventional commits, GitHub pull requests, and branch cleanup. Supports Git best practices and prevents common mistakes.
---

# Git Workflow Automation

Automates complete Git workflows from branch creation to PR and cleanup. Designed for production coding pipelines.

## When to Use This Skill

Use this skill when the user:
- Mentions starting a feature or bug fix
- Asks to commit changes
- Wants to push code or create a PR
- Needs to cleanup branches after merge
- References Git operations (branch, commit, push, merge)
- Says things like: "start feature X", "commit this", "push and make PR", "cleanup branch"

## Quick Start

The skill provides 5 main commands:

1. **Start Feature**: Create new branch
2. **Commit**: Save changes with conventional commit
3. **Push & PR**: Push branch and create pull request
4. **Cleanup**: Delete merged branch
5. **Full Pipeline**: All steps at once

## Core Commands

### 1. Start New Feature/Fix

Creates a new feature branch from base branch (default: main).

**Command Pattern**:
```bash
scripts/git_start_feature.sh <branch-name> [base-branch]
```

**Branch Naming Convention**: `<type>/<description>`
- `feature/` - New features
- `fix/` or `bugfix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `test/` - Tests
- `chore/` - Maintenance
- `hotfix/` - Emergency fixes

**Examples**:
```bash
scripts/git_start_feature.sh feature/outfit-generator
scripts/git_start_feature.sh fix/badge-bug
scripts/git_start_feature.sh refactor/api-cleanup develop
```

**What it does**:
1. Checks for uncommitted changes (fails if dirty)
2. Updates base branch
3. Creates new branch from base
4. Switches to new branch

### 2. Commit Changes

Stages and commits changes with conventional commit format.

**Command Pattern**:
```bash
scripts/git_commit.sh <type> <message> [files]
```

**Conventional Commit Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Tests
- `chore` - Maintenance
- `style` - Formatting
- `perf` - Performance

**Examples**:
```bash
scripts/git_commit.sh feat "add outfit generator endpoint"
scripts/git_commit.sh fix "resolve analyzing badge bug"
scripts/git_commit.sh refactor "optimize speed" --all
```

**What it does**:
1. Validates commit type
2. Stages files (specific or all)
3. Creates commit with format: `type: description`
4. Shows what was committed

### 3. Push and Create PR

Pushes branch to remote and creates GitHub pull request.

**Command Pattern**:
```bash
scripts/git_push_pr.sh [pr-title] [pr-description]
```

**Examples**:
```bash
scripts/git_push_pr.sh "Add outfit generator" "Implements outfit generation"
scripts/git_push_pr.sh  # Uses last commit message as title
```

**What it does**:
1. Checks for uncommitted changes
2. Pushes branch to origin
3. Creates GitHub PR (using gh CLI if available)
4. Opens PR in browser

**PR Title Format**: `type: description`
**PR Description Template**:
```markdown
## What
Brief description of changes

## Why
Context and reasoning

## How
- Key implementation details

## Testing
How it was tested

## Related
Closes #issue-number
```

### 4. Cleanup Branch

Deletes local branch after PR is merged.

**Command Pattern**:
```bash
scripts/git_cleanup.sh [branch-name]
```

**Examples**:
```bash
scripts/git_cleanup.sh feature/outfit-generator
scripts/git_cleanup.sh  # Cleans current branch
```

**What it does**:
1. Switches to main if on branch to delete
2. Updates main branch
3. Prompts for confirmation
4. Deletes local branch
5. Optionally deletes remote branch

### 5. Full Pipeline

Executes complete workflow: branch → commit → push → PR.

**Command Pattern**:
```bash
scripts/git_full_pipeline.sh <branch> <type> <message> [pr-title]
```

**Example**:
```bash
scripts/git_full_pipeline.sh feature/new-api feat "add endpoint" "New API"
```

## Workflow Steps

### Standard Development Flow

1. **Before Starting**
   - Ensure working directory is clean
   - Update main branch
   - Check for existing branches

2. **Feature Development**
   - Create branch: `git_start_feature.sh`
   - Make code changes
   - Test changes
   - Commit (can repeat): `git_commit.sh`
   - Push and create PR: `git_push_pr.sh`

3. **After PR Approval**
   - Wait for PR merge
   - Cleanup: `git_cleanup.sh`
   - Update main branch

## Safety Features

All scripts include:
- ✅ Git repository verification
- ✅ Uncommitted changes detection
- ✅ Branch protection (won't delete main/master)
- ✅ Remote verification
- ✅ Confirmation prompts for destructive operations
- ✅ Clear error messages
- ✅ Colored output for better UX

## Common Scenarios

### Scenario 1: Simple Feature
```bash
# User: "Start feature for user auth"
scripts/git_start_feature.sh feature/user-auth

# [Make code changes]

# User: "Commit these changes"
scripts/git_commit.sh feat "add user authentication"

# User: "Push and make PR"
scripts/git_push_pr.sh "User Authentication" "Implements JWT auth"

# [After PR is merged]

# User: "Cleanup branch"
scripts/git_cleanup.sh feature/user-auth
```

### Scenario 2: Bug Fix with Multiple Commits
```bash
# Start
scripts/git_start_feature.sh fix/login-error

# Commit 1: Investigation
scripts/git_commit.sh fix "identify login validation issue"

# Commit 2: Solution
scripts/git_commit.sh fix "resolve login validation error"

# Push and PR
scripts/git_push_pr.sh

# After merge
scripts/git_cleanup.sh
```

### Scenario 3: Emergency Hotfix
```bash
# Start from main
scripts/git_start_feature.sh hotfix/critical-bug main

# Fix and commit
scripts/git_commit.sh fix "resolve critical production bug" --all

# Immediate push and PR
scripts/git_push_pr.sh "HOTFIX: Critical Bug" "Urgent fix"

# Cleanup after fast-track merge
scripts/git_cleanup.sh hotfix/critical-bug
```

## Troubleshooting

### "Branch already exists"
```bash
# Delete existing branch first
git branch -D <branch-name>
# Or use different name
```

### "Uncommitted changes"
```bash
# Option 1: Commit them
scripts/git_commit.sh chore "WIP: save progress"

# Option 2: Stash them
git stash
# Later: git stash pop
```

### "PR creation failed"
```bash
# Ensure GitHub CLI is installed
gh auth login

# Or create PR manually on GitHub
```

## Best Practices

### Branch Naming
- Use lowercase
- Separate words with hyphens
- Be descriptive but concise
- Examples: `feature/outfit-generator`, `fix/auth-token-expiry`

### Commit Messages
- Start with type
- Use imperative mood ("add" not "added")
- Be specific but concise
- Examples: `feat: add outfit generation`, `fix: resolve badge bug`

### Pull Requests
- One feature/fix per PR
- Clear title and description
- Link related issues
- Request reviews
- Update documentation

## Advanced Usage

### Custom Base Branch
```bash
# Start from develop instead of main
scripts/git_start_feature.sh feature/new-api develop
```

### Amend Last Commit
```bash
git add <files>
git commit --amend --no-edit
git push origin <branch> --force-with-lease
```

### Interactive Rebase
```bash
# Clean up commit history
git rebase -i main
```

## Integration Notes

### For Styled App
- Always branch from `main`
- Use conventional commits
- Keep PRs focused
- Update docs when needed
- Follow `.cursorrules` standards
- Update `project_context.md` for major features

### Requirements
- Git installed
- GitHub CLI (optional, for PR creation)
- Bash shell
- Write access to repository

## Script Locations

All scripts should be in project's `scripts/` directory:
```
project-root/
├── scripts/
│   ├── git_start_feature.sh
│   ├── git_commit.sh
│   ├── git_push_pr.sh
│   ├── git_cleanup.sh
│   └── git_full_pipeline.sh
```

Make scripts executable:
```bash
chmod +x scripts/git_*.sh
```

## Reference Documentation

For more detailed information, see:
- **references/conventional-commits.md** - Commit message standards
- **references/branch-naming.md** - Branch naming conventions
- **references/pr-templates.md** - Pull request templates
- **references/troubleshooting.md** - Common issues and fixes

## Quick Reference

| User Says | Execute | Purpose |
|-----------|---------|---------|
| "Start feature X" | `git_start_feature.sh feature/x` | Create branch |
| "Commit this" | `git_commit.sh type "msg"` | Save changes |
| "Push and make PR" | `git_push_pr.sh` | Create PR |
| "Cleanup branch" | `git_cleanup.sh` | Delete branch |
| "Do full workflow" | `git_full_pipeline.sh` | All steps |

## Success Indicators

Git workflow is working when:
- ✅ Branches follow naming convention
- ✅ Commits use conventional format
- ✅ No accidental commits to main/master
- ✅ PRs are well-documented
- ✅ Branches cleaned up after merge
- ✅ User understands next steps
