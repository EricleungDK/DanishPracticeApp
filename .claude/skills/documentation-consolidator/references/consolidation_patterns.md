# Documentation Consolidation Patterns

This reference explains how to consolidate scattered information across the `.agent/` directory structure into coherent, up-to-date documentation.

## When to Consolidate

Consolidation is needed when:
1. **After completing a feature** - Merge planning (Tasks/) + implementation (Reports/) + system impact (System/)
2. **After fixing bugs** - Update system docs to reflect root cause and prevention
3. **On-demand review** - Periodic cleanup of scattered information
4. **Before starting new work** - Ensure AI agents have accurate context

## Core Consolidation Patterns

### Pattern 1: Feature Lifecycle Consolidation

**Problem:** Information about a feature is scattered across Tasks/, Reports/, and System/

**Solution:** Create a unified feature story that traces planning → implementation → testing

**Steps:**
1. **Identify** all documents related to the feature:
   - `Tasks/[feature-name].md` (planning)
   - `Reports/*-[feature-name].md` (implementation)
   - `Reports/test-executor-*-[feature-name].md` (testing)
   - Relevant sections in `System/*.md` (architecture impact)

2. **Extract** key information from each:
   - **From Tasks/**: Original requirements, acceptance criteria
   - **From Reports/**: Implementation decisions, challenges faced
   - **From Tests/**: What was validated, test results
   - **From System/**: How the feature integrates

3. **Update** system documentation:
   ```markdown
   ## Outfit Generation (Implemented 2025-11-20)

   **Purpose:** Generate AI-powered outfit recommendations based on weather and occasion

   **Implementation:** See [Reports/feature-20251120-outfit-generation.md]

   **Key Components:**
   - Edge Function: `generate-outfit`
   - Database: `outfits` table with user_id, items[], occasion, weather_context
   - UI: `app/(tabs)/outfits.tsx` with save/view functionality

   **Testing:** Validated in [Reports/test-executor-20251120-outfit-generation.md]
   - ✅ Generates outfits for various weather conditions
   - ✅ Saves outfits to database
   - ✅ Retrieves saved outfits correctly

   **Known Issues:** None

   **Related:** See [Tasks/outfit-generation.md] for original requirements
   ```

4. **Update** context.md to reflect completion:
   ```markdown
   ## Recent Implementations
   - ✅ Outfit Generation (2025-11-20) - Fully tested and deployed
   ```

### Pattern 2: Bug Fix Consolidation

**Problem:** Bug fixes are documented in debugger reports but system docs don't reflect the learnings

**Solution:** Extract root cause and update system docs to prevent recurrence

**Steps:**
1. **Read** the debugger report: `Reports/debugger-YYYYMMDD-[issue].md`

2. **Extract** key information:
   - Root cause of the bug
   - Which system component was affected
   - What the fix changed

3. **Update** relevant system documentation:
   ```markdown
   ## Component: Outfit Saving Logic

   **Implementation:** `supabase/functions/generate-outfit/outfit-logic.ts`

   **Key Pattern:** Always validate user_id exists before inserting outfits

   **Common Pitfall (Fixed 2025-11-21):**
   ❌ Don't assume user_id is always present in request
   ✅ Validate and provide error response if missing

   See: [Reports/debugger-20251121-outfit-saving-bug.md]
   ```

4. **Update** SOP/debugging_guide.md if the bug revealed a common pattern:
   ```markdown
   ## Common Issue: Null Reference Errors

   **Symptom:** "Cannot read property of undefined"

   **Root Cause:** Missing null checks before accessing nested properties

   **Solution Pattern:**
   ```typescript
   // ❌ Dangerous
   const name = user.profile.name;

   // ✅ Safe
   const name = user?.profile?.name ?? 'Unknown';
   ```

   **Real Example:** [Outfit saving bug](Reports/debugger-20251121-outfit-saving-bug.md)
   ```

5. **Update** context.md to remove from known issues:
   ```markdown
   ## Known Issues
   - ~~Outfit saving fails when user_id is undefined~~ (Fixed 2025-11-21)
   ```

### Pattern 3: Test Results Consolidation

**Problem:** Test reports exist but system docs don't reflect test coverage

**Solution:** Update system docs to show what's been tested and validated

**Steps:**
1. **Read** test executor reports: `Reports/test-executor-*.md`

2. **Extract** test coverage information:
   - What components were tested
   - What scenarios were validated
   - Pass/fail results

3. **Update** system documentation with test coverage:
   ```markdown
   ## Component: Outfit Generation API

   **Endpoint:** POST `/generate-outfit`

   **Test Coverage:** ✅ Comprehensive (2025-11-20)
   - ✅ Generates outfits for sunny weather
   - ✅ Generates outfits for rainy weather
   - ✅ Handles missing occasion parameter
   - ✅ Returns appropriate error for invalid items
   - ✅ Performance: <5s response time

   **Last Tested:** 2025-11-20 ([Report](Reports/test-executor-20251120-outfit-generation.md))
   ```

4. **Create** test coverage summary in System/:
   ```markdown
   # System/test_coverage.md

   ## API Endpoints
   | Endpoint | Coverage | Last Tested | Status |
   |----------|----------|-------------|--------|
   | POST /generate-outfit | 95% | 2025-11-20 | ✅ Passing |
   | POST /classify-clothing | 90% | 2025-11-15 | ✅ Passing |
   | GET /weather | 80% | 2025-11-10 | ⚠️  Needs update |

   ## Components
   | Component | Coverage | Last Tested | Status |
   |-----------|----------|-------------|--------|
   | Outfit saving | 100% | 2025-11-21 | ✅ Passing |
   | Item classification | 95% | 2025-11-15 | ✅ Passing |
   ```

### Pattern 4: Architecture Decision Consolidation

**Problem:** Architecture decisions documented in reports but not in permanent system docs

**Solution:** Extract decisions and create Architecture Decision Records (ADRs)

**Steps:**
1. **Identify** architectural decisions in Reports/:
   - "We decided to use X instead of Y"
   - "Changed from pattern A to pattern B"
   - "Added caching layer because..."

2. **Extract** the decision rationale:
   ```markdown
   # System/architecture_decisions.md

   ## ADR-001: Use Supabase Edge Functions over Express Server

   **Date:** 2025-11-01

   **Status:** Accepted

   **Context:**
   Need serverless API layer for AI classification and outfit generation.

   **Decision:**
   Use Supabase Edge Functions (Deno) instead of Express/Node server.

   **Rationale:**
   - Seamless integration with Supabase database
   - Built-in authentication when we add it (MVP phase)
   - Auto-scaling without server management
   - Deno's security model better for AI API calls

   **Consequences:**
   + No server infrastructure to manage
   + Automatic scaling
   - Learning curve for Deno (vs Node.js)
   - Limited to Supabase ecosystem

   **References:**
   - [Initial implementation](Reports/feature-20251101-edge-functions.md)
   ```

3. **Link** from relevant system docs:
   ```markdown
   # System/api_endpoints.md

   ## Architecture

   All API endpoints are implemented as Supabase Edge Functions.

   See [ADR-001](architecture_decisions.md#adr-001) for rationale.
   ```

### Pattern 5: Context.md Continuous Update

**Problem:** `Tasks/context.md` becomes stale and doesn't reflect current project state

**Solution:** Treat context.md as a living document updated after every significant change

**Update Triggers:**
- Feature completed → Add to "Recent Implementations"
- Bug fixed → Remove from "Known Issues"
- New task started → Add to "Active Tasks"
- Sub-agent consulted → Update "Active Delegations"

**Template Pattern:**
```markdown
# Project Context

**Last Updated:** 2025-11-21

## Current Project State
[1-2 paragraph summary of where the project is now]

## Active Tasks
- [ ] Implementing user authentication (in progress)
- [ ] Adding weather caching layer (planned)

## Recent Implementations (Last 30 days)
- ✅ Outfit Generation (2025-11-20)
- ✅ Outfit Saving Bug Fix (2025-11-21)
- ✅ Item Classification Enhancement (2025-11-15)

## Known Issues
- Weather API rate limiting needs addressing
- Image upload size limit too restrictive (5MB)

## Active Delegations
| Sub-Agent | Task ID | Status | Started | Expected Completion |
|-----------|---------|--------|---------|-------------------|
| systematic-debugger | DEBUG-001 | COMPLETED | 2025-11-21 10:00 | 2025-11-21 10:30 |

## Architecture Overview
[Link to System/project_architecture.md]

## Key Constraints
- POC phase: No user authentication yet
- AI costs: Monitor Claude API usage
- Mobile-first design
```

## Conflict Resolution Patterns

### When Documents Conflict

**Pattern:** Information differs between System/ docs and Reports/

**Resolution:**
1. **Check timestamps**: Most recent information wins
2. **Read Reports/**: Implementation reports show what was actually done
3. **Update System/**: System docs should reflect current reality
4. **Document change**: Note when/why the change happened

**Example:**
```markdown
## Database Schema: outfits table

**Current Schema (as of 2025-11-21):**
```sql
CREATE TABLE outfits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  -- Added 2025-11-21 (see Reports/debugger-20251121)
  items JSONB NOT NULL,
  occasion TEXT,
  weather_context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Previous Schema:** user_id was optional (caused bugs, fixed 2025-11-21)
```

### When Multiple Reports Cover Same Topic

**Pattern:** Multiple agents reported on the same feature/bug

**Resolution:**
1. **Chronological order**: Read reports from oldest to newest
2. **Extract evolution**: Show how understanding progressed
3. **Final state**: System docs reflect final implementation
4. **Keep history**: Link to all relevant reports

**Example:**
```markdown
## Feature: Outfit Generation

**Implementation History:**
1. Initial implementation (2025-11-20)
   - [Feature Report](Reports/feature-20251120-outfit-generation.md)
   - Basic outfit generation working

2. Bug discovered in saving logic (2025-11-21)
   - [Debug Report](Reports/debugger-20251121-outfit-saving-bug.md)
   - Root cause: Missing user_id validation

3. Fix validated (2025-11-21)
   - [Test Report](Reports/test-executor-20251121-outfit-saving-fix.md)
   - All tests passing

**Current State:** Fully functional with robust error handling
```

## Automation Opportunities

Use the provided scripts to automate consolidation:

```bash
# 1. Audit what needs consolidation
python3 scripts/audit_documentation.py

# 2. Generate consolidated context summary
python3 scripts/consolidate_context.py --output .agent/Tasks/consolidated_context.md

# 3. Validate against standards
python3 scripts/validate_standards.py

# 4. Review generated files and manually update System/ docs
```

## Best Practices

1. **Update Immediately**: Don't batch documentation updates; do them right after implementation
2. **Cross-Reference**: Always link between related documents
3. **Keep Reports**: Don't delete Reports/ even after consolidating; they provide history
4. **Version System Docs**: Note when significant changes happen in System/ docs
5. **Use Templates**: Start with templates from `assets/templates/` for consistency
6. **Validate Often**: Run `validate_standards.py` weekly to catch drift early
7. **Consolidate Context**: Run `consolidate_context.py` before starting new work sessions

## Anti-Patterns to Avoid

❌ **Don't**: Copy entire reports into System/ docs
✅ **Do**: Extract key insights and link to full reports

❌ **Don't**: Delete old reports when consolidating
✅ **Do**: Keep reports as historical record, link from consolidated docs

❌ **Don't**: Let context.md go >7 days without updates
✅ **Do**: Update context.md after every significant change

❌ **Don't**: Document only what's currently broken
✅ **Do**: Document the full system state, including what works

❌ **Don't**: Write consolidation documentation without reading all source docs
✅ **Do**: Read all related reports/tasks before writing consolidated view
