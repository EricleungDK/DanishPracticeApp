---
name: documentation-consolidator
description: Consolidate and maintain project documentation to meet excellent coding standards. Use after completing features, fixing bugs, or for on-demand documentation review. Ensures documentation is traceable, accurate, complete, and discoverable for AI agents working on the project in various situations (new features, bug fixes, testing, pending tasks).
---

# Documentation Consolidator

## Overview

This skill helps consolidate scattered documentation across the `.agent/` directory structure and maintain it to excellent coding standards. Use this skill to ensure AI agents can effectively understand project context for any situation: implementing new features, fixing bugs, validating tests, or planning future work.

The skill provides:
- **Automated auditing** to identify documentation issues
- **Context consolidation** to merge scattered information
- **Standards validation** to ensure quality metrics are met
- **Templates** for consistent documentation creation

## When to Use This Skill

Invoke this skill in these situations:

1. **After completing a feature** - Consolidate planning docs (Tasks/), implementation reports (Reports/), and system documentation (System/)

2. **After fixing bugs** - Update system docs to reflect root cause learnings and prevent recurrence

3. **On-demand review** - Periodic cleanup to ensure documentation reflects current project state

4. **Before starting new work** - Verify AI agents have accurate, consolidated context

**Trigger phrases:**
- "Consolidate the documentation"
- "Review and update documentation"
- "Ensure docs meet coding standards"
- "Audit the .agent/ documentation"
- "Validate documentation quality"

## Core Workflow

### 1. Audit Current Documentation

Start by identifying what needs consolidation using the audit script:

```bash
python3 scripts/audit_documentation.py
```

**What it checks:**
- **Outdated docs** - System/ files not updated despite recent Reports/
- **Missing connections** - Features not traced from Tasks → Reports → System
- **Quality issues** - Missing sections, sparse content, incomplete files
- **Orphaned reports** - Reports/ not referenced in other documentation

**Output:** Detailed report of all documentation issues categorized by severity.

### 2. Generate Consolidated Context

Create a unified view of project state from scattered documentation:

```bash
python3 scripts/consolidate_context.py --output .agent/Tasks/consolidated_context.md
```

**What it consolidates:**
- **Features** - Status summary from Tasks/ and Reports/
- **Bugs & Fixes** - Active bugs, fixes, root causes from debugger reports
- **Testing Status** - Test results and coverage from test-executor reports
- **System State** - Current architecture snapshot from System/ docs
- **Active Tasks** - Current work from context.md and current_plan.md

**Output:** Markdown file with unified project context ready for AI agents.

### 3. Validate Against Standards

Check documentation quality against the Four Pillars of Excellence:

```bash
python3 scripts/validate_standards.py
```

**Validates:**
1. **Traceability** (90%+ for Grade A)
   - Can trace features through planning → implementation → testing?
   - Are bug fixes linked to original features and tests?

2. **Accuracy** (90%+ for Grade A)
   - Does documentation reflect current code state?
   - System/ docs updated within 14 days of implementations?

3. **Completeness** (90%+ for Grade A)
   - All required System/ files exist with required sections?
   - README.md provides comprehensive index?

4. **Discoverability** (90%+ for Grade A)
   - Can AI agents quickly find needed information?
   - Clear directory structure and cross-references?

**Output:** Graded report (A-F) with specific issues and improvement suggestions.

### 4. Apply Consolidation Patterns

Based on audit results, apply the appropriate consolidation pattern from `references/consolidation_patterns.md`:

**Pattern 1: Feature Lifecycle Consolidation**
- Merge Tasks/ planning + Reports/ implementation + System/ impact
- Update System/ docs with feature details and test results
- Update context.md to reflect completion

**Pattern 2: Bug Fix Consolidation**
- Extract root cause from debugger report
- Update System/ docs with "Common Pitfall" sections
- Update SOP/debugging_guide.md with pattern
- Remove from context.md Known Issues

**Pattern 3: Test Results Consolidation**
- Update System/ docs with test coverage information
- Create/update System/test_coverage.md
- Link test reports to relevant components

**Pattern 4: Architecture Decision Consolidation**
- Extract architectural decisions from Reports/
- Create Architecture Decision Records (ADRs) in System/
- Link from relevant component documentation

**Pattern 5: Context.md Continuous Update**
- Treat context.md as living document
- Update after every significant change
- Maintain Active Delegations table to prevent recursive sub-agent calls

### 5. Use Templates for New Documentation

When creating new documentation, use templates from `assets/templates/`:

- **Feature planning:** `feature_template.md`
- **Bug reports:** `bug_report_template.md`
- **Test reports:** `test_report_template.md`
- **Architecture decisions:** `adr_template.md`
- **Procedures:** `sop_template.md`

**Example usage:**
```bash
# Copy template to create new feature doc
cp assets/templates/feature_template.md .agent/Tasks/new-feature.md

# Edit with your content
# Follow the template structure for consistency
```

## Documentation Excellence Standards

To understand what "excellent coding standards" means for documentation, read `references/documentation_standards.md`. Key principles:

### Four Pillars of Excellence

1. **Traceability** - Every feature, bug, test can be traced through the system
2. **Accuracy** - Documentation reflects current code state, not outdated snapshots
3. **Completeness** - All essential information documented, no critical gaps
4. **Discoverability** - Information easy to find when AI agents need it

### Target Quality Metrics

| Grade | Score Range | Standard |
|-------|-------------|----------|
| A | 90-100% | Excellent - Maintain this |
| B | 80-89% | Good - Acceptable minimum |
| C | 70-79% | Needs improvement |
| D | 60-69% | Significant issues |
| F | <60% | Critical - Fix immediately |

**Project Goal:** Maintain Grade B (80%+) minimum, strive for Grade A (90%+)

## Step-by-Step Consolidation Example

### Scenario: Just completed outfit generation feature

**Step 1: Audit**
```bash
python3 scripts/audit_documentation.py
```
Output shows:
- System/api_endpoints.md not updated (30 days old)
- Feature report exists but not referenced in System/
- context.md still lists feature as "in progress"

**Step 2: Read related documents**
- Tasks/outfit-generation.md (planning)
- Reports/feature-20251120-outfit-generation.md (implementation)
- Reports/test-executor-20251120-outfit-generation.md (testing)

**Step 3: Apply Feature Lifecycle Consolidation**

Update `System/api_endpoints.md`:
```markdown
## POST /generate-outfit (Implemented 2025-11-20)

**Purpose:** Generate AI-powered outfit recommendations

**Implementation:** [Reports/feature-20251120-outfit-generation.md]

**Request:**
```json
{
  "occasion": "work",
  "weather": { "temp": 72, "condition": "sunny" }
}
```

**Response:** Outfit with item IDs and styling suggestions

**Test Coverage:** ✅ Comprehensive
- See [Reports/test-executor-20251120-outfit-generation.md]
```

Update `Tasks/context.md`:
```markdown
## Recent Implementations
- ✅ Outfit Generation (2025-11-20) - Fully tested and deployed

## Active Tasks
- ~~Implement outfit generation~~ (completed)
```

**Step 4: Validate**
```bash
python3 scripts/validate_standards.py
```
Output shows improved grade from C (75%) to A (92%)

**Step 5: Generate consolidated context**
```bash
python3 scripts/consolidate_context.py --output .agent/Tasks/consolidated_context.md
```
Now AI agents have unified view of entire project state.

## Common Consolidation Tasks

### Task 1: Fix Outdated System Documentation

**Problem:** System/ docs haven't been updated despite recent implementations

**Solution:**
1. Run audit to identify which System/ docs are outdated
2. Read recent Reports/ to understand what changed
3. Update relevant System/ docs with new information
4. Add "Last Updated" dates and links to implementation reports
5. Re-validate to confirm improvement

### Task 2: Link Orphaned Reports

**Problem:** Reports/ contain valuable information but aren't referenced elsewhere

**Solution:**
1. Run audit to identify orphaned reports
2. Read each orphaned report to understand content
3. Update relevant System/ or Tasks/ docs to reference the report
4. Add cross-references between related reports
5. Verify traceability score improves

### Task 3: Create Missing README Index

**Problem:** No .agent/README.md to help discover documentation

**Solution:**
1. Read all existing documentation to understand structure
2. Create .agent/README.md using structure from `references/documentation_standards.md`
3. Add sections for System/, Tasks/, SOP/, Reports/
4. Link to all major documentation files
5. Re-validate to confirm discoverability score improves

### Task 4: Fill Documentation Gaps

**Problem:** Required files or sections missing

**Solution:**
1. Run validate_standards.py to identify gaps
2. Use templates from `assets/templates/` to create missing files
3. For missing sections, refer to `references/documentation_standards.md` for required content
4. Populate with information from code, git history, or team knowledge
5. Re-validate to confirm completeness score improves

## Maintenance Schedule

**After Every Feature/Bug Fix:**
- [ ] Create/update report in Reports/
- [ ] Update System/ docs affected
- [ ] Update Tasks/context.md
- [ ] Link report to relevant docs

**Weekly (or After 3+ Changes):**
- [ ] Run audit_documentation.py
- [ ] Run validate_standards.py
- [ ] Review and address issues
- [ ] Run consolidate_context.py

**Monthly:**
- [ ] Review README.md completeness
- [ ] Archive old reports (>90 days) if not referenced
- [ ] Update SOPs based on new patterns
- [ ] Validate grade maintains B+ (80%+)

## Best Practices

1. **Update Immediately** - Don't batch documentation updates; do them after implementation
2. **Cross-Reference** - Always link between related documents
3. **Keep Reports** - Don't delete Reports/ even after consolidating; they provide history
4. **Version System Docs** - Note when significant changes happen
5. **Use Templates** - Start with templates for consistency
6. **Validate Often** - Run validate_standards.py weekly to catch drift
7. **Consolidate Context** - Run consolidate_context.py before new work sessions

## Anti-Patterns to Avoid

❌ **Don't** copy entire reports into System/ docs
✅ **Do** extract key insights and link to full reports

❌ **Don't** delete old reports when consolidating
✅ **Do** keep reports as historical record, link from consolidated docs

❌ **Don't** let context.md go >7 days without updates
✅ **Do** update context.md after every significant change

❌ **Don't** create documentation without reading existing docs first
✅ **Do** read all related docs before writing new consolidated view

## Resources Reference

### Scripts (scripts/)

**audit_documentation.py** - Identify documentation issues
- Checks for outdated docs, missing connections, quality issues, orphaned reports
- Run before consolidation to understand what needs work

**consolidate_context.py** - Generate unified context summary
- Merges information from Tasks/, Reports/, System/
- Creates consolidated markdown for AI agent consumption

**validate_standards.py** - Grade documentation quality
- Validates against Four Pillars of Excellence
- Outputs A-F grade with specific improvement recommendations

### References (references/)

**documentation_standards.md** - Defines excellence standards
- Four Pillars: Traceability, Accuracy, Completeness, Discoverability
- Quality metrics and grading rubric
- Required file structure and sections
- Maintenance schedule

**consolidation_patterns.md** - How to consolidate information
- 5 core consolidation patterns with examples
- Conflict resolution patterns
- Best practices and anti-patterns

### Templates (assets/templates/)

**feature_template.md** - Feature documentation structure
**bug_report_template.md** - Bug report and fix documentation
**test_report_template.md** - Test results and coverage
**adr_template.md** - Architecture Decision Record
**sop_template.md** - Standard Operating Procedure

## Success Criteria

Documentation consolidation is successful when:

1. **Audit clean** - No high-severity issues from audit_documentation.py
2. **Grade B+** - validate_standards.py returns grade B (80%) or higher
3. **Context complete** - consolidate_context.py generates comprehensive summary
4. **AI agents effective** - Agents can understand project context without asking for clarification
5. **Maintenance sustainable** - Weekly validations maintain quality without significant effort

## Troubleshooting

**Problem:** Audit shows many outdated docs

**Solution:** Start with highest-priority System/ docs (project_architecture.md, api_endpoints.md, database_schema.md). Update these first before tackling others.

**Problem:** Low traceability score

**Solution:** Focus on linking Reports/ to System/ and Tasks/. Add cross-references showing how features were planned → implemented → tested.

**Problem:** Validation grade stuck at C

**Solution:** Run audit to identify specific issues. Focus on one pillar at a time (start with Completeness - easiest wins).

**Problem:** Context consolidation feels overwhelming

**Solution:** Don't try to consolidate everything at once. Focus on most recent work (last 30 days). Archive older Reports/ for now.

---

**Usage Note:** This skill should be invoked proactively after significant project work (features, bug fixes) and periodically for quality maintenance. AI agents should use this skill to ensure they have accurate project context before starting new work.
