# Pull Request Templates

## Standard PR Structure

```markdown
## What
[Brief description of changes]

## Why
[Context and reasoning]

## How
- [Key implementation detail 1]
- [Key implementation detail 2]
- [Key implementation detail 3]

## Testing
[How it was tested]

## Related
[Issue references]
```

## Complete PR Template

```markdown
## What
[1-2 sentence description of what this PR does]

## Why
[Why is this change needed? What problem does it solve?]

## How
- [Key implementation approach]
- [Important technical decisions]
- [Notable changes]

## Testing
- [x] Unit tests added/updated
- [x] Integration tests pass
- [x] Manual testing completed
- [ ] Performance testing (if applicable)

## Screenshots/Demo
[If UI changes, add screenshots or demo video]

## Breaking Changes
[List any breaking changes, or write "None"]

## Related
Closes #[issue-number]
Related: #[issue-number], #[issue-number]

## Checklist
- [x] Code follows project style guidelines
- [x] Documentation updated
- [x] Tests added/updated
- [x] No new warnings
- [x] PR title follows conventional commit format
```

## PR Title Format

### Standard Format
```
<type>: <description>
```

### Examples
```
feat: add outfit generation endpoint
fix: resolve analyzing badge false positive
refactor: optimize classification speed
docs: update API documentation
test: add unit tests for generator
chore: update dependencies
```

### With Scope (Optional)
```
feat(api): add outfit generation endpoint
fix(ui): resolve badge display issue
refactor(auth): simplify token validation
```

## Example PRs by Type

### Feature PR

```markdown
# feat: add outfit generation with weather context

## What
Adds AI-powered outfit generation that creates 3 outfit combinations based on user's wardrobe, current weather, and selected occasion.

## Why
Users need personalized outfit suggestions that consider weather conditions. This is a core feature for the MVP launch.

## How
- Implemented `/generate-outfit` edge function
- Integrated OpenAI GPT-4 for outfit logic
- Added weather API integration (OpenWeatherMap)
- Created outfit scoring system (weather compatibility, occasion fit, style coherence)
- Implemented response caching (5 min TTL)

## Testing
- ✅ Unit tests for outfit generation logic
- ✅ Integration tests with mock weather data
- ✅ Manual testing with 10 sample wardrobes
- ✅ Tested with various weather conditions (32°F to 95°F)
- ✅ Verified AI responses are consistent

## Screenshots
[Outfit suggestion UI]
[Weather integration]

## Performance
- Average response time: 3.2s
- Cache hit ratio: 68%
- AI token usage: ~500 tokens per request

## Breaking Changes
None

## Related
Closes #42
Depends on #38 (weather API)
Related: #39 (outfit history)

## Checklist
- [x] Code follows `.cursorrules` standards
- [x] Updated `api_design_doc.md`
- [x] Added to `project_context.md` feature list
- [x] TypeScript types added to `types_file.md`
- [x] AI prompts added to `ai_prompts_config.md`
- [x] Tests coverage >80%
```

### Bug Fix PR

```markdown
# fix: resolve analyzing badge false positive on load

## What
Fixes the "Analyzing..." badge showing incorrectly when confidence is 0.0 instead of null/undefined.

## Why
Badge was displaying "Analyzing" status for items that had completed classification but had confidence exactly 0.0, which is a valid score. This confused users.

## How
- Changed condition from `confidence === 0` to `confidence === null || confidence === undefined`
- Added additional check for `confidence < 0.1` to catch edge cases
- Updated TypeScript types to make confidence nullable

## Testing
- ✅ Tested with confidence = 0.0 (should show score)
- ✅ Tested with confidence = null (should show "analyzing")
- ✅ Tested with confidence = undefined (should show "analyzing")
- ✅ Tested with confidence = 0.95 (should show score)
- ✅ Added unit tests for all cases

## Before/After
**Before**: Badge showed "Analyzing..." for items with 0.0 confidence
**After**: Badge correctly shows confidence score or analyzing status

## Related
Fixes #28

## Checklist
- [x] Bug fix tested thoroughly
- [x] Added regression tests
- [x] No breaking changes
```

### Refactor PR

```markdown
# refactor: extract AI prompts to configuration file

## What
Moves all AI prompts from inline strings to centralized configuration file for easier maintenance and iteration.

## Why
- Prompts were scattered across multiple files
- Hard to iterate and improve prompts
- Difficult to track prompt versions
- No single source of truth

## How
- Created `ai_prompts_config.md` with all prompts
- Updated all edge functions to import from config
- Added prompt versioning support
- Extracted 5 prompt templates (classification, outfit generation, style analysis, etc.)

## Testing
- ✅ All existing tests pass
- ✅ Verified prompt behavior unchanged
- ✅ Tested with real wardrobe data
- ✅ No performance regression

## Files Changed
- `ai_prompts_config.md` (new)
- `supabase/functions/classify-clothing/index.ts` (updated)
- `supabase/functions/generate-outfit/index.ts` (updated)

## Breaking Changes
None - internal refactor only

## Related
Related: #35 (prompt iteration)

## Checklist
- [x] All tests pass
- [x] Documentation updated
- [x] No functional changes
- [x] Code is cleaner and more maintainable
```

### Documentation PR

```markdown
# docs: update API documentation with new endpoints

## What
Updates API design documentation with new outfit generation and classification endpoints.

## Why
Documentation was outdated after recent API changes. Need to reflect current implementation.

## How
- Updated `api_design_doc.md` with new endpoints
- Added request/response examples
- Documented error codes
- Added authentication notes for MVP phase

## Changes
- Added `/generate-outfit` endpoint documentation
- Updated `/classify-clothing` with new response format
- Added weather integration details
- Updated error handling section

## Related
Related: #42 (outfit generation), #38 (weather API)

## Checklist
- [x] All endpoints documented
- [x] Examples are accurate
- [x] Error codes listed
- [x] Clear and readable
```

## PR Description Best Practices

### DO ✅

**Be specific**:
```
✅ "Adds outfit generation using GPT-4 with weather context"
❌ "Adds feature"
```

**Explain why**:
```
✅ "Users need outfit suggestions based on weather to make better clothing decisions"
❌ "Because we should have this"
```

**Include testing details**:
```
✅ "Tested with 10 sample wardrobes across 5 weather conditions"
❌ "Tested it"
```

**Reference issues**:
```
✅ "Closes #42, Related: #38, #39"
❌ "Fixes some bugs"
```

**Add context for reviewers**:
```
✅ "This is the first step toward the complete outfit recommendation system. Follow-up PR will add outfit history."
❌ "Review this"
```

### DON'T ❌

**Don't be vague**:
```
❌ "Updated some stuff"
❌ "Fixed things"
❌ "Changes"
```

**Don't skip testing section**:
```
❌ "Tested: Yes"
❌ "It works"
```

**Don't forget issue links**:
```
❌ No mention of related issues
```

**Don't write novels**:
```
❌ 1000 word essay about implementation details
```

## PR Size Guidelines

### Small PR (Preferred)
- **Lines changed**: < 200
- **Files changed**: < 5
- **Review time**: 15-30 minutes
- **Examples**: Bug fixes, small features, documentation

### Medium PR
- **Lines changed**: 200-500
- **Files changed**: 5-10
- **Review time**: 30-60 minutes
- **Examples**: New features, refactors

### Large PR (Avoid)
- **Lines changed**: > 500
- **Files changed**: > 10
- **Review time**: > 60 minutes
- **Should be split**: Yes

**Tip**: Break large PRs into smaller, reviewable chunks

## Review Process

### For PR Author

1. **Self-review first**: Review your own PR before requesting reviews
2. **Check CI/CD**: Ensure all checks pass
3. **Add reviewers**: Tag appropriate team members
4. **Be responsive**: Reply to comments promptly
5. **Update PR**: Address feedback quickly

### For Reviewers

1. **Review promptly**: Within 24 hours
2. **Be constructive**: Suggest improvements, don't just criticize
3. **Ask questions**: If something is unclear
4. **Approve when ready**: Don't block unnecessarily
5. **Test if needed**: Pull and test locally for complex changes

## PR Labels

### Type Labels
- `feature` - New features
- `bug` - Bug fixes
- `refactor` - Code improvements
- `documentation` - Documentation updates
- `test` - Test additions/updates

### Priority Labels
- `critical` - Must be merged immediately
- `high` - Should be merged soon
- `medium` - Normal priority
- `low` - Nice to have

### Status Labels
- `wip` - Work in progress
- `ready-for-review` - Ready for team review
- `changes-requested` - Needs updates
- `approved` - Ready to merge

## Automated PR Checks

### CI/CD Pipeline
```
✅ Linting passes
✅ Tests pass (unit + integration)
✅ Build succeeds
✅ No new warnings
✅ Coverage maintained/improved
```

### PR Template Checklist
```
✅ PR title follows conventional commits
✅ Description includes what/why/how
✅ Testing section completed
✅ Related issues linked
✅ Breaking changes noted (if any)
✅ Documentation updated
```

## For Styled App

### Project-Specific Template

```markdown
# [type]: [description]

## What
[What this PR does]

## Why
[Why it's needed]

## How
[Implementation approach]

## Testing
[How tested]

## Documentation Updates
- [ ] Updated relevant docs in /docs/
- [ ] Updated project_context.md (if major feature)
- [ ] Updated api_design_doc.md (if API changes)
- [ ] Updated types_file.md (if type changes)

## Related
Closes #[issue]

## Styled-Specific Checklist
- [ ] Follows .cursorrules standards
- [ ] AI prompts in ai_prompts_config.md (if applicable)
- [ ] Works with POC constraints
- [ ] Mobile-first design considered
- [ ] Error handling included
```

## Quick Reference

| PR Type | Title Format | Must Include |
|---------|-------------|--------------|
| Feature | `feat: description` | What, Why, How, Testing |
| Bug Fix | `fix: description` | Before/After, Root cause |
| Refactor | `refactor: description` | No functional changes note |
| Docs | `docs: description` | What docs updated |
| Tests | `test: description` | Coverage improvement |
