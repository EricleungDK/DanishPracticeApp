# Feature: [Feature Name]

**Date:** YYYY-MM-DD
**Status:** [Planned / In Progress / Completed / Deprecated]
**Report:** [Link to Reports/feature-YYYYMMDD-feature-name.md if exists]

## Overview
[1-2 paragraph description of what this feature does and why it's needed]

## Requirements

### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Non-Functional Requirements
- [ ] Performance target (e.g., <5s response time)
- [ ] Accessibility (e.g., WCAG AA compliance)
- [ ] Security considerations
- [ ] Scalability targets

### Acceptance Criteria
- [ ] Criterion 1: [Specific, measurable outcome]
- [ ] Criterion 2: [Specific, measurable outcome]
- [ ] Criterion 3: [Specific, measurable outcome]

## Implementation Plan

### Phase 1: [Phase Name]
1. Step 1
2. Step 2
3. Step 3

### Phase 2: [Phase Name]
1. Step 1
2. Step 2
3. Step 3

## Technical Design

### Architecture Impact
[Describe which parts of the system this feature affects]

**Affected Components:**
- Component 1: [Path/to/component]
- Component 2: [Path/to/component]

### Database Changes
[Describe any schema changes needed]

```sql
-- Example migration SQL
ALTER TABLE table_name ADD COLUMN new_column TYPE;
```

### API Changes
[Describe any new or modified endpoints]

**New Endpoints:**
- `POST /endpoint-name` - Description

**Modified Endpoints:**
- `GET /existing-endpoint` - What changed

### UI/UX Changes
[Describe any user-facing changes]

**New Screens:**
- Screen 1: `app/(tabs)/screen-name.tsx`

**Modified Screens:**
- Screen 2: What changed

## Dependencies

**External:**
- Package/Service 1: [Why needed]
- Package/Service 2: [Why needed]

**Internal:**
- Feature/Component 1: [Why needed]
- Feature/Component 2: [Why needed]

## Testing Strategy

### Unit Tests
- [ ] Test 1: [What to test]
- [ ] Test 2: [What to test]

### Integration Tests
- [ ] Test 1: [What to test]
- [ ] Test 2: [What to test]

### User Acceptance Tests
- [ ] Scenario 1: [User workflow]
- [ ] Scenario 2: [User workflow]

## Implementation Timeline

| Phase | Tasks | Estimated Duration | Status |
|-------|-------|-------------------|--------|
| Phase 1 | [Description] | X days | Not Started |
| Phase 2 | [Description] | X days | Not Started |

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Risk 1 | High/Medium/Low | High/Medium/Low | How to mitigate |
| Risk 2 | High/Medium/Low | High/Medium/Low | How to mitigate |

## Success Metrics

- Metric 1: [How to measure]
- Metric 2: [How to measure]
- Metric 3: [How to measure]

## Documentation Updates Needed

- [ ] Update `System/project_architecture.md` - [What section]
- [ ] Update `System/api_endpoints.md` - [Add new endpoints]
- [ ] Update `System/database_schema.md` - [Add new tables/columns]
- [ ] Update `.agent/README.md` - [Add links to this feature]

## Related Documents

- [Related Feature 1](path/to/feature1.md)
- [Related Bug Fix](../Reports/debugger-YYYYMMDD-bug-name.md)
- [System Component](../System/component.md)

## Notes

[Any additional context, assumptions, or decisions that don't fit above]
