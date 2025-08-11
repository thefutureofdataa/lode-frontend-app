## Git quick start

### Clone this repository
- SSH:

```bash
git clone git@github.com:malcolmling97/lode-frontend-app.git
  ```
- HTTPS:
```bash
git clone https://github.com/malcolmling97/lode-frontend-app.git
  ```

### Best practice: updating your work branch
Use this flow when starting a new project or when coming back to continue work.

1) Ensure `main` is up to date
```bash
git checkout main
git pull
```

2) Switch back to your feature branch
```bash
git checkout <your-branch-name>
# If you use an alias, `gco <your-branch-name>` works too
```

3) Rebase your branch onto the latest `main`
```bash
git rebase main
# If conflicts occur: resolve them, then
# git add <files>
# git rebase --continue
```

4) Continue your work as usual
```bash
# edit code
# commit changes
git add -A
git commit -m "Describe your change"
```

5) Push your branch
- First push (or if you haven't pushed before):
```bash
git push -u origin <your-branch-name>
```
- After a rebase (history rewritten): prefer a safe force-push
```bash
git push --force-with-lease
# If you have an alias `p` for `push`, then: git p --force-with-lease
# Avoid plain --force unless you know exactly what you're doing.
```

### Notes
- Rebasing rewrites commit history. Only force-push branches you own; coordinate if others may be using the same branch.
- `--force-with-lease` protects you from overwriting remote work you don’t have locally.
- If your local `main` doesn’t track `origin/main`, you can rebase with:
```bash
git fetch origin
git rebase origin/main
```