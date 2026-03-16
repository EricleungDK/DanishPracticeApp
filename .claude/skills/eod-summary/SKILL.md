---
name: eod-summary
description: Create end-of-day summary of work completed and update project documentation. Use when the user indicates the work session is ending (e.g., "let's call it a day", "create EOD summary", "wrap up"). This skill generates a dated summary in Daily_blogpost and runs /update_doc to sync documentation.
---

# End-of-Day Summary Skill

## Purpose

This skill creates comprehensive end-of-day summaries that capture:
- Work accomplished during the session
- Files created/modified
- Git commits made
- Key decisions and changes
- Next steps and pending tasks

The skill also ensures project documentation stays current by running the `/update_doc` command after creating the summary.

## When to Use This Skill

Trigger this skill when the user indicates the work session is ending:
- "Let's call it a day"
- "Create EOD summary"
- "Wrap up for today"
- "End of day summary"
- Any similar end-of-session phrase

## How to Use This Skill

### Step 1: Gather Session Information

Collect information about the current session by reviewing:
1. **Git status and commits** - Run `git log --oneline -10` to see recent commits
2. **Modified files** - Run `git status` to see changed files
3. **Conversation context** - Review what was discussed and accomplished
4. **Todo list state** - Check if there are any pending tasks

### Step 2: Create the Daily Summary

Write the summary to `docs/Daily_blogpost/YYYY-MM-DD.md` where the date is today's date.

**Use the template from `references/template.md`** to structure the summary.

Include:
- **Date**: Today's date
- **Session Summary**: Brief overview of what was accomplished
- **Key Accomplishments**: Bulleted list of major achievements
- **Files Changed**: List of created/modified files with brief descriptions
- **Git Commits**: List of commits with messages
- **Technical Details**: Important implementation details, decisions made
- **Testing Results**: Any test results or validations performed
- **Next Steps**: What needs to be done next
- **Notes**: Any important observations or blockers

### Step 3: Run Documentation Update

After creating the summary, **ALWAYS run the `/update_doc` slash command** to update project documentation:

```
/update_doc
```

This ensures that:
- `.agent/` documentation reflects the latest changes
- Database schema docs are updated if migrations were added
- API endpoint docs are updated if Edge Functions were created/modified
- Task tracking docs reflect completion status

### Step 4: Confirm Completion

Inform the user that:
- EOD summary has been created at `docs/Daily_blogpost/YYYY-MM-DD.md`
- Documentation has been updated via `/update_doc`
- The day's work is ready for review

## Important Guidelines

1. **Always use today's date** for the filename (YYYY-MM-DD format)
2. **Always run `/update_doc`** after creating the summary
3. **Be comprehensive** - Include all significant work from the session
4. **Be specific** - Reference exact file paths, commit hashes, function names
5. **Be structured** - Follow the template format for consistency
6. **Include context** - Explain why decisions were made, not just what was done

## Example Workflow

```
User: "Let's call it a day"

1. Check git commits: git log --oneline -5
2. Check modified files: git status
3. Review conversation for accomplishments
4. Create docs/Daily_blogpost/2025-10-30.md using template
5. Run: /update_doc
6. Confirm: "EOD summary created and documentation updated!"
```

## Tips for Effective Summaries

- Start with the most important accomplishments
- Group related changes together
- Include test results if validation was performed
- Note any blockers or issues encountered
- Link commits to features/fixes they address
- Mention any technical debt or follow-up needed
