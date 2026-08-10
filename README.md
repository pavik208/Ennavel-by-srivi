# Ennaval by srivi

This project is a static storefront built for GitHub Pages.

## Deploy to GitHub Pages

1. Create a GitHub repository for this project.
2. Add a remote and push the current branch:

```bash
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin master
```

3. The workflow at `.github/workflows/gh-pages.yml` will automatically deploy the site.

## Notes

- The site is served directly from the repository root.
- `.nojekyll` is included to prevent Jekyll processing.
