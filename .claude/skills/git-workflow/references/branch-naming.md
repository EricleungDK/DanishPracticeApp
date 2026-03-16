# Branch Naming Conventions

## Standard Format

```
<type>/<description-with-hyphens>
```

## Branch Types

### feature/
For new features or capabilities

**Examples**:
```
feature/outfit-generator
feature/user-authentication
feature/weather-integration
feature/calendar-sync
feature/social-sharing
```

**When to use**: Adding new functionality that users will see

### fix/ or bugfix/
For bug corrections

**Examples**:
```
fix/analyzing-badge-bug
fix/login-validation-error
fix/null-pointer-exception
bugfix/image-upload-failure
fix/incorrect-weather-data
```

**When to use**: Fixing broken functionality

### refactor/
For code improvements without changing behavior

**Examples**:
```
refactor/classification-speed
refactor/api-structure
refactor/database-queries
refactor/authentication-flow
refactor/component-hierarchy
```

**When to use**: Improving code quality, performance, or structure

### docs/
For documentation updates

**Examples**:
```
docs/api-endpoints
docs/setup-instructions
docs/contributing-guide
docs/architecture-updates
docs/readme-improvements
```

**When to use**: Documentation-only changes

### test/
For test additions or updates

**Examples**:
```
test/unit-tests-classifier
test/integration-tests-api
test/e2e-outfit-flow
test/performance-benchmarks
test/edge-cases
```

**When to use**: Adding or updating tests

### chore/
For maintenance tasks

**Examples**:
```
chore/update-dependencies
chore/configure-eslint
chore/update-gitignore
chore/cleanup-unused-code
chore/upgrade-node-version
```

**When to use**: Build process, dependencies, tooling

### hotfix/
For emergency production fixes

**Examples**:
```
hotfix/critical-security-patch
hotfix/production-crash
hotfix/data-loss-prevention
hotfix/payment-processing-error
```

**When to use**: Urgent fixes that can't wait for normal cycle

## Naming Rules

### DO ✅

**Use lowercase**:
```
✅ feature/outfit-generator
❌ feature/Outfit-Generator
❌ feature/OUTFIT-GENERATOR
```

**Use hyphens for spaces**:
```
✅ fix/user-profile-error
❌ fix/user_profile_error
❌ fix/userProfileError
❌ fix/user profile error
```

**Be descriptive but concise**:
```
✅ feature/weather-based-recommendations
❌ feature/thing
❌ feature/add-a-new-feature-that-uses-weather-api-to-recommend-outfits
```

**Include issue number (optional)**:
```
✅ fix/badge-bug-42
✅ feature/auth-15
```

### DON'T ❌

**Avoid special characters**:
```
❌ feature/outfit_generator
❌ fix/bug#42
❌ refactor/api@v2
```

**Avoid generic names**:
```
❌ feature/new-feature
❌ fix/bug-fix
❌ update/update
❌ feature/wip
```

**Don't use camelCase or snake_case**:
```
❌ feature/outfitGenerator
❌ feature/outfit_generator
```

## Branch Lifespan

### Short-lived (1-7 days)
```
feature/small-ui-change
fix/typo-in-error-message
docs/update-readme
```

### Medium-lived (1-2 weeks)
```
feature/outfit-generator
refactor/api-restructure
```

### Long-lived (2+ weeks) - Avoid if possible
```
feature/complete-social-platform
refactor/entire-codebase-rewrite
```

**Tip**: Break large features into smaller branches

## Examples by Scenario

### Adding New API Endpoint
```
feature/outfit-generation-endpoint
```

### Fixing UI Bug
```
fix/badge-display-issue
```

### Performance Improvement
```
refactor/optimize-classification-speed
```

### Adding Tests
```
test/outfit-generator-unit-tests
```

### Updating Documentation
```
docs/api-design-updates
```

### Emergency Production Fix
```
hotfix/critical-auth-vulnerability
```

### Dependency Update
```
chore/upgrade-react-native
```

## Multi-word Descriptions

**Good examples**:
```
feature/user-profile-management
fix/email-validation-regex
refactor/database-connection-pooling
docs/getting-started-guide
test/integration-test-suite
```

**Bad examples**:
```
❌ feature/userProfileManagement
❌ fix/email_validation_regex
❌ refactor/DatabaseConnectionPooling
❌ feature/user profile management
```

## Related to Issues

### With Issue Number
```
feature/outfit-gen-42
fix/badge-bug-28
refactor/api-15
```

### With Issue Reference
```
feature/user-auth-closes-8
fix/login-error-fixes-23
```

## Branch Prefixes by Project Phase

### POC Phase
```
poc/basic-classification
poc/outfit-algorithm
poc/ui-prototype
```

### MVP Phase
```
feature/user-authentication
feature/outfit-history
```

### Production Phase
```
hotfix/security-patch
feature/premium-features
```

## Team Conventions

### By Developer
```
feature/jane/outfit-generator
fix/john/badge-bug
```

### By Epic
```
feature/social/user-profiles
feature/social/feed-implementation
feature/social/messaging
```

## Git Flow Branches

### Main Branches (Long-lived)
```
main          # Production code
develop       # Integration branch
```

### Supporting Branches (Short-lived)
```
feature/*     # New features
hotfix/*      # Production fixes
release/*     # Release preparation
```

## Branch Cleanup

**Delete after merge**:
```bash
git branch -d feature/outfit-generator
git push origin --delete feature/outfit-generator
```

**Check stale branches**:
```bash
git branch -vv
git remote prune origin
```

## For Styled App

### Standard Base
Always branch from: `main`

### Naming Examples
```
feature/outfit-generator
feature/user-authentication
fix/analyzing-badge-bug
fix/classification-timeout
refactor/prompt-organization
refactor/api-error-handling
docs/architecture-updates
docs/api-documentation
test/outfit-generator-tests
chore/dependency-updates
hotfix/production-crash
```

### With Issue Numbers
```
feature/outfit-gen-42
fix/badge-bug-28
```

### Project-Specific Types
```
feature/ai-integration
feature/ui-component
feature/api-endpoint
feature/database-schema
```

## Best Practices Summary

1. **Type prefix**: Use standard type
2. **Lowercase**: All lowercase letters
3. **Hyphens**: Separate words with hyphens
4. **Descriptive**: Clear what the branch does
5. **Concise**: Short but meaningful
6. **Consistent**: Follow team conventions
7. **Clean up**: Delete after merge

## Quick Reference

| Scenario | Branch Name |
|----------|-------------|
| New feature | `feature/name` |
| Bug fix | `fix/name` |
| Refactor | `refactor/name` |
| Documentation | `docs/name` |
| Tests | `test/name` |
| Maintenance | `chore/name` |
| Emergency fix | `hotfix/name` |
