# Conventional Commits Reference

## Format

```
<type>: <description>

[optional body]

[optional footer]
```

## Types

### Primary Types

**feat**: A new feature for the user
```
feat: add outfit generation endpoint
feat: implement user authentication
feat: add weather-based recommendations
```

**fix**: A bug fix for the user
```
fix: resolve analyzing badge false positive
fix: correct login validation error
fix: handle null weather data
```

**refactor**: Code change that neither fixes a bug nor adds a feature
```
refactor: simplify classification prompt structure
refactor: extract outfit scoring logic
refactor: optimize database queries
```

### Secondary Types

**docs**: Documentation only changes
```
docs: update API endpoint documentation
docs: add setup instructions to README
docs: improve SKILL.md examples
```

**test**: Adding or updating tests
```
test: add unit tests for outfit generator
test: update integration tests for auth
test: add edge case tests for classifier
```

**chore**: Changes to build process or auxiliary tools
```
chore: update dependencies
chore: configure ESLint rules
chore: update .gitignore
```

**style**: Changes that don't affect code meaning (formatting, whitespace)
```
style: fix indentation in components
style: format code with prettier
style: remove trailing whitespace
```

**perf**: Performance improvements
```
perf: optimize classification speed
perf: reduce API response time
perf: cache wardrobe queries
```

## Scope (Optional)

Add scope in parentheses after type:

```
feat(api): add outfit endpoint
fix(ui): resolve badge display issue
refactor(auth): simplify token validation
```

## Body (Optional)

Provide additional context:

```
feat: add outfit generation endpoint

Implements AI-powered outfit generation based on weather,
occasion, and user preferences. Uses GPT-4 for outfit
logic and scoring.
```

## Footer (Optional)

Reference issues or breaking changes:

```
fix: resolve login validation error

Fixes validation logic that was rejecting valid emails
with certain TLDs.

Closes #42
```

Breaking changes:

```
feat: update authentication flow

BREAKING CHANGE: JWT tokens now expire after 24 hours
instead of 7 days. Users will need to re-authenticate
more frequently.
```

## Examples by Scenario

### New Feature Development
```
feat: add outfit generation with weather context

Implements complete outfit generation workflow:
- Weather API integration
- AI-powered outfit selection
- Outfit scoring system
- Response caching

Closes #15
```

### Bug Fix
```
fix: resolve analyzing badge false positive

Badge was showing "analyzing" status when confidence
was 0.0 instead of checking if it's actually null or
undefined. Changed condition to check confidence < 0.1.

Fixes #28
```

### Refactoring
```
refactor: extract classification prompt logic

Moved AI prompts from inline strings to separate
config file for easier maintenance and testing.

- Created ai_prompts_config.md
- Updated classify-clothing function
- Added prompt versioning support
```

### Multiple Related Changes
```
feat: implement complete user authentication

- Add JWT token generation
- Create login/signup endpoints
- Implement password hashing
- Add email verification
- Create protected route middleware

Closes #8, #9, #10
```

## Best Practices

### DO ✅

- Use imperative mood: "add" not "added"
- Start with lowercase after type
- Be specific but concise
- Include "why" in body if needed
- Reference issues in footer

### DON'T ❌

- Use past tense: ~~"added feature"~~
- Be too vague: ~~"update stuff"~~
- Write novels: ~~"I noticed that..."~~
- Mix multiple types: ~~"feat/fix: add and fix things"~~
- Forget the type: ~~"updated the code"~~

## Good vs Bad Examples

### ❌ Bad
```
update
fixed bug
added some stuff
changes to the API
WIP
```

### ✅ Good
```
fix: resolve null pointer in user profile
feat: add outfit recommendation engine
refactor: simplify authentication flow
docs: update API documentation
test: add unit tests for classifier
```

## Commit Message Length

**Subject line**: Max 50 characters
**Body**: Wrap at 72 characters
**Footer**: No length limit

## Why Conventional Commits?

- **Automated changelog generation**
- **Semantic versioning**
- **Clear commit history**
- **Better collaboration**
- **Easier code review**
- **Improved project navigation**

## Tools Integration

### Changelog Generation
```bash
conventional-changelog -p angular -i CHANGELOG.md -s
```

### Commit Linting
```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### Semantic Release
```bash
npm install --save-dev semantic-release
```

## For Styled App

**Default branch**: main
**Scope**: Use when helpful (api, ui, auth, db)
**Footer**: Always link to issues
**Body**: Use for non-obvious changes

Example for Styled:
```
feat(api): add outfit generation endpoint

Implements /generate-outfit endpoint that creates 3
outfit combinations based on:
- User's wardrobe items
- Current weather conditions
- Selected occasion
- User preferences

Uses GPT-4 for outfit logic and includes reasoning
for each suggestion.

Closes #42
Related: #38, #39
```
