# Bug Report: [Bug Name]

**Date Reported:** YYYY-MM-DD
**Date Fixed:** YYYY-MM-DD (if applicable)
**Severity:** [Critical / High / Medium / Low]
**Status:** [Investigating / Identified / Fixed / Verified]
**Reporter:** [Who found the bug]

## Summary
[1-2 sentence description of the bug]

## Environment

**Platform:** [iOS / Android / Both]
**Device:** [Specific device if applicable]
**OS Version:** [Version number]
**App Version:** [Version/commit hash]

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3
4. Observe the bug

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots / Logs

```
[Paste relevant error logs here]
```

[Attach screenshots if applicable]

## Root Cause Analysis

### Investigation Process
[How the bug was investigated]

1. Checked component X
2. Reviewed logs
3. Traced code execution
4. Identified issue in file Y

### Root Cause
[Technical explanation of why the bug occurs]

**Affected Code:**
```typescript
// File: path/to/file.ts:line_number
[Code snippet showing the problematic code]
```

**Why It Failed:**
[Detailed explanation]

## Fix Implementation

### Solution Approach
[High-level description of how the bug was fixed]

### Code Changes

**File 1:** `path/to/file1.ts`
```typescript
// Before
[Old code]

// After
[New code]
```

**File 2:** `path/to/file2.ts`
```typescript
// Before
[Old code]

// After
[New code]
```

### Testing the Fix

**Test Cases:**
- [ ] Test case 1: [Description]
- [ ] Test case 2: [Description]
- [ ] Regression test: [Ensure fix doesn't break existing functionality]

**Test Report:** [Link to Reports/test-executor-YYYYMMDD-bug-fix-verification.md]

## Impact Assessment

### User Impact
- **Affected Users:** [Who was affected]
- **Severity:** [How bad was the impact]
- **Frequency:** [How often did it occur]

### System Impact
- **Components Affected:** [List of components]
- **Data Integrity:** [Any data corruption or loss]
- **Performance:** [Any performance degradation]

## Prevention

### Lessons Learned
1. Lesson 1: [What we learned]
2. Lesson 2: [What we learned]

### Preventive Measures
- [ ] Add validation check in component X
- [ ] Add unit test for this scenario
- [ ] Update documentation to warn about this pattern
- [ ] Add linting rule to catch similar issues

### Documentation Updates
- [ ] Update `System/[component].md` with "Common Pitfall" section
- [ ] Update `SOP/debugging_guide.md` with this debugging pattern
- [ ] Update `System/architecture_decisions.md` if architectural change was needed

## Related Issues

- **Related Bugs:** [Link to similar bugs]
- **Related Features:** [Link to feature that introduced this bug]
- **Upstream Issues:** [Link to library/framework issues if applicable]

## Timeline

| Date | Event |
|------|-------|
| YYYY-MM-DD | Bug reported |
| YYYY-MM-DD | Investigation started |
| YYYY-MM-DD | Root cause identified |
| YYYY-MM-DD | Fix implemented |
| YYYY-MM-DD | Fix tested and verified |
| YYYY-MM-DD | Deployed to production |

## Verification Checklist

- [ ] Bug reproduced in development
- [ ] Root cause identified and documented
- [ ] Fix implemented and code reviewed
- [ ] Unit tests added for this bug
- [ ] Integration tests pass
- [ ] Manual testing confirms fix
- [ ] No regression issues found
- [ ] Documentation updated
- [ ] Deployed to production

## Notes

[Any additional context or considerations]
