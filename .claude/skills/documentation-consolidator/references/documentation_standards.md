# Documentation Standards for Excellence

This reference defines what "excellent level coding standards" means for project documentation in the `.agent/` directory structure.

## Four Pillars of Excellence

### 1. Traceability
Every feature, bug fix, and architectural decision should be traceable through the documentation system.

**Requirements:**
- Features documented in `Reports/` should be referenced in `Tasks/` (planning) and `System/` (architecture impact)
- Bug fixes documented in `Reports/debugger-*` should link to:
  - Original feature implementation (if applicable)
  - Test reports that caught the bug
  - System docs updated to reflect the fix
- Tests documented in `Reports/test-executor-*` should reference:
  - The feature or bug being tested
  - System components covered

**Example Traceability Chain:**
```
1. Tasks/outfit-generation-feature.md (planning)
   ↓
2. Reports/feature-20251120-outfit-generation.md (implementation)
   ↓
3. System/api_endpoints.md (updated with new endpoints)
   ↓
4. Reports/test-executor-20251120-outfit-generation.md (validation)
   ↓
5. Reports/debugger-20251121-outfit-saving-bug.md (bug found)
   ↓
6. Reports/test-executor-20251121-outfit-saving-fix.md (fix validated)
```

### 2. Accuracy
Documentation must reflect the current state of the codebase, not outdated snapshots.

**Requirements:**
- `System/` documentation updated within 14 days of significant implementations
- Reports in `Reports/` include implementation completion status
- `Tasks/context.md` reflects current project state, not stale information
- No conflicting information between different documentation files

**Accuracy Checklist:**
- [ ] System architecture docs match current directory structure
- [ ] API endpoint docs list all currently available endpoints
- [ ] Database schema docs reflect latest migrations
- [ ] Technology stack in docs matches `package.json` / dependencies
- [ ] Code examples in docs are valid and run without errors

### 3. Completeness
All essential information must be documented; no critical gaps.

**Required Files Structure:**

```
.agent/
├── README.md                    # Index of all documentation
├── Tasks/
│   ├── context.md              # Current project state, active tasks
│   ├── current_plan.md         # Active implementation plan
│   └── [feature-name].md       # Feature PRDs and plans
├── System/
│   ├── project_architecture.md # Full system overview
│   ├── database_schema.md      # Tables, relationships, constraints
│   ├── api_endpoints.md        # All Edge Functions/APIs
│   └── ai_layer.md             # AI provider integration
├── SOP/
│   ├── development_workflow.md # How to develop features
│   ├── testing_procedures.md  # How to test
│   └── debugging_guide.md      # How to debug issues
└── Reports/
    ├── [agent]-YYYYMMDD-[task].md  # Sub-agent reports
    └── ...
```

**Required Sections by Document Type:**

**System/project_architecture.md:**
- ## Overview (2-3 paragraphs)
- ## Tech Stack (detailed list with versions)
- ## Directory Structure (with explanations)
- ## Key Patterns (architectural decisions)
- ## Integration Points (external services)

**System/database_schema.md:**
- ## Tables (all tables with columns, types, constraints)
- ## Relationships (foreign keys, junction tables)
- ## Indexes (performance-critical indexes)
- ## Migration History (major schema changes)

**System/api_endpoints.md:**
- ## Endpoints (grouped by functionality)
- ## Request Format (parameters, body)
- ## Response Format (success, error cases)
- ## Authentication (if applicable)
- ## Rate Limits / Constraints

**Tasks/context.md:**
- ## Current Project State
- ## Active Tasks
- ## Recent Implementations
- ## Known Issues
- ## Active Delegations (sub-agent tracking)

**SOP/[procedure].md:**
- ## Purpose (what this procedure is for)
- ## Prerequisites (what's needed before starting)
- ## Step-by-Step Instructions (numbered, detailed)
- ## Validation (how to verify success)
- ## Troubleshooting (common issues)

### 4. Discoverability
Information should be easy to find when AI agents or developers need it.

**Requirements:**
- `.agent/README.md` serves as comprehensive index with links to all major docs
- Clear directory structure with intuitive naming
- Consistent filename conventions:
  - System docs: `lowercase_with_underscores.md`
  - Feature tasks: `kebab-case-feature-name.md`
  - Reports: `[agent]-YYYYMMDD-[task-name].md`
- Cross-references between related documents
- Table of contents in long documents (>500 lines)

**Discoverability Index Structure (README.md):**

```markdown
# .agent Documentation Index

## System Documentation
Core technical documentation about the current state of the system.

- [Project Architecture](System/project_architecture.md) - Full system overview
- [Database Schema](System/database_schema.md) - Tables and relationships
- [API Endpoints](System/api_endpoints.md) - All Edge Functions
- [AI Layer](System/ai_layer.md) - AI provider integration

## Tasks Documentation
Feature planning, PRDs, and implementation plans.

- [Current Context](Tasks/context.md) - Project state and active tasks
- [Current Plan](Tasks/current_plan.md) - Active implementation plan
- [Feature: Outfit Generation](Tasks/outfit-generation.md)
- [Feature: Weather Integration](Tasks/weather-integration.md)

## Standard Operating Procedures (SOPs)
How to perform common development tasks.

- [Development Workflow](SOP/development_workflow.md)
- [Testing Procedures](SOP/testing_procedures.md)
- [Debugging Guide](SOP/debugging_guide.md)

## Reports Archive
Historical reports from sub-agents and implementations.

- Recent reports in [Reports/](Reports/)
- Use `ls -lt Reports/` to see by date
```

## Quality Metrics

Documentation is considered "excellent" when it meets these thresholds:

| Category | Grade A | Grade B | Grade C | Grade D | Grade F |
|----------|---------|---------|---------|---------|---------|
| Traceability | 90-100% | 80-89% | 70-79% | 60-69% | <60% |
| Accuracy | 90-100% | 80-89% | 70-79% | 60-69% | <60% |
| Completeness | 90-100% | 80-89% | 70-79% | 60-69% | <60% |
| Discoverability | 90-100% | 80-89% | 70-79% | 60-69% | <60% |

**Overall Grade = Average of all four categories**

**Target:** Maintain Grade B (80%+) at minimum, strive for Grade A (90%+)

## Common Anti-Patterns to Avoid

1. **Stale Context**: `context.md` not updated after implementations
2. **Orphaned Reports**: Reports in `Reports/` never referenced elsewhere
3. **Missing Links**: System docs don't cross-reference related features
4. **Sparse Documentation**: Files exist but contain <500 chars of actual content
5. **Inconsistent Naming**: Mix of different naming conventions across files
6. **No README Index**: Developers/agents must hunt for information
7. **Undocumented Decisions**: Why certain patterns were chosen not explained
8. **Test Gaps**: Features implemented without corresponding test reports

## Documentation Maintenance Schedule

**After Every Feature Implementation:**
- [ ] Create feature report in `Reports/`
- [ ] Update `System/` docs affected by the feature
- [ ] Update `Tasks/context.md` with completion status
- [ ] Link report to relevant system/task docs

**After Every Bug Fix:**
- [ ] Create debugger report in `Reports/debugger-*`
- [ ] Update `System/` docs if bug revealed architectural issues
- [ ] Create test report validating the fix
- [ ] Update `Tasks/context.md` to remove from known issues

**Weekly (or After 3+ Changes):**
- [ ] Run `audit_documentation.py` to identify issues
- [ ] Run `validate_standards.py` to check grade
- [ ] Review orphaned reports and link or archive
- [ ] Consolidate context with `consolidate_context.py`

**Monthly:**
- [ ] Review README.md index for completeness
- [ ] Archive old reports (>90 days) if not referenced
- [ ] Update SOP docs based on new patterns discovered
- [ ] Validate all external links still work

## Templates

See `assets/templates/` for:
- Feature documentation template
- Bug report template
- Test report template
- Architecture decision record template
- SOP template
