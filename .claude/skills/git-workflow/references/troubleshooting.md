# Git Workflow Troubleshooting

## Common Issues and Solutions

### Issue: "Branch already exists"

**Error**: `fatal: A branch named 'feature/name' already exists`

**Solutions**:
1. Use different name: `scripts/git_start_feature.sh feature/name-v2`
2. Delete existing: `git branch -D feature/name`
3. Switch to existing: `git checkout feature/name`

### Issue: "Uncommitted changes"

**Error**: `error: You have uncommitted changes`

**Solutions**:
1. Commit: `scripts/git_commit.sh feat "message"`
2. Stash: `git stash` (restore later with `git stash pop`)
3. Discard: `git reset --hard HEAD` (⚠️ destructive)

### Issue: "PR creation failed"

**Error**: `gh: command not found`

**Solutions**:
1. Install GitHub CLI: `brew install gh` (macOS)
2. Authenticate: `gh auth login`
3. Create PR manually on GitHub

### Issue: "Merge conflicts"

**Error**: `CONFLICT (content): Merge conflict`

**Solutions**:
1. Resolve manually:
   - Edit conflicted files
   - Remove conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - `git add <files>`
   - `git commit -m "resolve conflicts"`
2. Abort: `git merge --abort`

### Issue: "Permission denied"

**Error**: `Permission denied (publickey)`

**Solutions**:
1. Check SSH: `ssh -T git@github.com`
2. Generate key: `ssh-keygen -t ed25519`
3. Add to GitHub: Settings → SSH Keys

### Issue: "Scripts not executable"

**Error**: `Permission denied`

**Solution**: `chmod +x scripts/git_*.sh`

### Issue: "Scripts not found"

**Error**: `No such file or directory`

**Solutions**:
1. Check directory: `pwd`
2. Install scripts: `bash install-git-workflow.sh`
3. Navigate to project root

## Emergency Commands

**Undo last commit (keep changes)**:
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes)**:
```bash
git reset --hard HEAD~1
```

**Create backup**:
```bash
git branch backup-branch
```

**Find lost commits**:
```bash
git reflog
```

## Prevention Tips

✅ Update main before creating branch
✅ Commit frequently
✅ Pull before push
✅ Test before committing
✅ Review changes: `git diff`
