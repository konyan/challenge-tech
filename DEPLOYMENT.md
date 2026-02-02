****# GitHub Pages Deployment Guide

This project is configured for automatic deployment to GitHub Pages.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Update Repository Name (if different)

If your repository name is not `code-challenge-main`, update the base path in `vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### 3. Push to Main Branch

The deployment will trigger automatically when you push to the `main` branch:

```bash
git add .
npm run commit
git push origin main
```

## Build Commands

### Local Development
```bash
npm run dev
```

### Build for Production (GitHub Pages)
```bash
npm run build:github
```

### Build for Local Testing
```bash
npm run build
npm run preview
```

## Deployment Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Runs on push to main branch**
2. **Checks out code**
3. **Installs dependencies**
4. **Runs Biome linting and formatting checks**
5. **Builds the project** with the correct base path
6. **Deploys to GitHub Pages**

## CI Workflow

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Every pull request to main
- Every push to main

It performs:
- Biome checks (linting + formatting)
- Build verification

## Accessing Your Site

After deployment, your site will be available at:
```
https://YOUR-USERNAME.github.io/code-challenge-main/
```

Replace `YOUR-USERNAME` with your GitHub username.

## Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the branch and click **Run workflow**

## Troubleshooting

### Assets not loading

If CSS/JS files aren't loading, verify:
- The `base` path in `vite.config.js` matches your repository name
- The deployment completed successfully in GitHub Actions

### Deployment failed

Check the GitHub Actions logs:
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Review the error messages

Common issues:
- GitHub Pages not enabled in repository settings
- Incorrect permissions in workflow file
- Build errors (run `npm run build:github` locally to test)

## Notes

- The `dist/` folder is git-ignored (never commit it)
- Builds are created fresh on every deployment
- Old deployments are automatically replaced
