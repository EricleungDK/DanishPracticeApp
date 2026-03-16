# Test Report: [Feature/Component Name]

**Date:** YYYY-MM-DD
**Tested By:** [Agent/Person name]
**Test Type:** [Unit / Integration / E2E / Manual]
**Overall Status:** ✅ Passed / ❌ Failed / ⚠️ Warning
**Coverage:** [Percentage if applicable]

## Executive Summary
[1-2 paragraph summary of what was tested and the overall results]

## Test Scope

### In Scope
- Component/Feature 1
- Component/Feature 2
- Component/Feature 3

### Out of Scope
- Component/Feature A (will be tested separately)
- Component/Feature B (not yet implemented)

## Test Environment

**Platform:** [iOS / Android / Both / Backend]
**Test Framework:** [Jest / Detox / Manual / etc.]
**Environment:** [Development / Staging / Production]
**Device/Browser:** [Specific device or browser if applicable]

## Test Cases

### Test Suite 1: [Suite Name]

#### Test Case 1.1: [Test Name]
**Status:** ✅ Passed / ❌ Failed / ⚠️ Warning
**Description:** [What this test validates]

**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]

**Evidence:**
```
[Logs, output, or screenshots]
```

---

#### Test Case 1.2: [Test Name]
**Status:** ✅ Passed / ❌ Failed / ⚠️ Warning
**Description:** [What this test validates]

**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]

---

### Test Suite 2: [Suite Name]

[Continue with more test cases...]

## Test Results Summary

### Pass/Fail Statistics
- **Total Tests:** X
- **Passed:** X (XX%)
- **Failed:** X (XX%)
- **Warnings:** X (XX%)
- **Skipped:** X (XX%)

### Coverage Analysis
- **Lines Covered:** XX%
- **Branches Covered:** XX%
- **Functions Covered:** XX%

**Coverage Gaps:**
- File 1: [What's not covered]
- File 2: [What's not covered]

## Failed Tests

### Failure 1: [Test Name]
**Severity:** High / Medium / Low
**Component:** [Affected component]

**Error Details:**
```
[Error message and stack trace]
```

**Root Cause:** [Why it failed]
**Action Required:** [What needs to be done]
**Assignee:** [Who should fix it]

---

### Failure 2: [Test Name]
[Similar structure as above]

## Performance Metrics

| Test Case | Duration | Threshold | Status |
|-----------|----------|-----------|--------|
| Test 1 | Xms | <XXms | ✅ |
| Test 2 | Xms | <XXms | ❌ |
| Test 3 | Xms | <XXms | ✅ |

**Performance Issues:**
- Test 2 exceeded threshold by Xms
- Recommendation: Optimize [specific component]

## Regression Testing

**Previous Test Results:** [Link to previous test report]

**Regression Status:**
- ✅ No new failures
- ✅ All previous issues still fixed
- ❌ New regression in [component]: [description]

## Edge Cases & Boundary Testing

| Edge Case | Expected Behavior | Result |
|-----------|-------------------|--------|
| Empty input | Show error message | ✅ |
| Maximum length input | Accept and process | ✅ |
| Special characters | Sanitize and accept | ❌ Needs fix |
| Null/undefined values | Handle gracefully | ✅ |

## Security Testing (if applicable)

- [ ] Input validation tested
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Authentication enforced
- [ ] Authorization checks working
- [ ] Sensitive data not exposed in logs

## Accessibility Testing (if applicable)

- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present

## Cross-Platform Testing (if applicable)

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| iOS | 17.0 | ✅ | Working perfectly |
| iOS | 16.0 | ⚠️ | Minor UI glitch |
| Android | 14 | ✅ | Working perfectly |
| Android | 13 | ✅ | Working perfectly |

## Known Issues

### Issue 1: [Issue Name]
**Severity:** High / Medium / Low
**Description:** [What the issue is]
**Workaround:** [Temporary fix if available]
**Ticket:** [Link to bug report if created]

## Recommendations

1. **High Priority:**
   - Recommendation 1
   - Recommendation 2

2. **Medium Priority:**
   - Recommendation 3
   - Recommendation 4

3. **Low Priority / Future:**
   - Recommendation 5
   - Recommendation 6

## Test Artifacts

- **Test Logs:** `path/to/test-logs.txt`
- **Screenshots:** `path/to/screenshots/`
- **Video Recording:** `path/to/recording.mp4`
- **Code Coverage Report:** `path/to/coverage/index.html`

## Sign-off

**Tested By:** [Name]
**Reviewed By:** [Name]
**Approved By:** [Name]

**Approval Status:**
- [ ] Ready for deployment
- [ ] Needs fixes before deployment
- [ ] Requires additional testing

## Next Steps

1. [ ] Fix identified issues
2. [ ] Re-run failed tests
3. [ ] Update documentation
4. [ ] Deploy to [environment]

## Related Documents

- **Feature Specification:** [Link to Tasks/feature.md]
- **Implementation Report:** [Link to Reports/feature-implementation.md]
- **Previous Test Report:** [Link if applicable]
- **Bug Reports:** [Links to any bugs found]

## Notes

[Any additional context, observations, or recommendations]
