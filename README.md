# Portfolio Forge

> Auto-generate a polished GitHub README portfolio from your GitHub profile and repository data.

## What it does

Portfolio Forge reads your GitHub profile and all repositories via the GitHub API, then generates a visually rich `README.md` with:
- Your profile stats (stars, forks, followers, following)
- Your top repositories by star count
- Recent GitHub activity (commits, PRs, issues)
- Tech stack badges and language breakdown
- Contribution graph

The output is a single `generated-portfolio-README.md` file you copy to your GitHub profile README.

## Why use this?

A GitHub profile README is often the first thing recruiters and collaborators see. Portfolio Forge automates the tedious work of keeping it updated — every time you run it, it pulls fresh data from GitHub and regenerates.

## Requirements

- Node.js 16+
- A GitHub Personal Access Token (PAT) with `repo` scope

## Install

```bash
git clone https://github.com/mamuaminu/matador-portfolio-forge.git
cd matador-portfolio-forge
npm install
```

## Setup

### 1. Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Grant the `repo` scope (full repo access)
4. Copy the token

### 2. Configure the generator

**Option A — Environment variable (recommended)**
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

**Option B — Edit index.js**
Find the line near the top:
```javascript
const USERNAME = "your-github-username";
```
Replace with your actual GitHub username.

### 3. Update your GitHub profile

Go to https://github.com/settings/profile and create or update your profile README. The filename must be `README.md` and it must be in the root of a public repo that matches your username (e.g. `https://github.com/yourusername/yourusername`).

## Run

```bash
node index.js
```

On success, you'll see:
```
✅ Generated: generated-portfolio-README.md
📋 Copy the contents of generated-portfolio-README.md to your GitHub profile README
```

## Copy to your GitHub profile

1. Open `generated-portfolio-README.md` in a text editor
2. Go to your GitHub profile repo (the one named after your username)
3. Edit the `README.md` and paste the generated content
4. Commit

## Automate daily updates

Use GitHub Actions to regenerate daily:

```yaml
# .github/workflows/generate-portfolio.yml
name: Regenerate Portfolio
on:
  schedule:
    - cron: '0 9 * * *'   # every day at 9 AM
  workflow_dispatch:         # manual trigger

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: node index.js
      - uses: actions/commit-push@v4
        with:
          file_path: generated-portfolio-README.md
          commit_message: "🤖 Auto-regenerate portfolio README"
```

## Files

```
matador-portfolio-forge/
├── index.js                       # Main generator
├── generated-portfolio-README.md # Generated output (copy this to your profile)
├── package.json
└── README.md                      # This file
```

---

By Muhammad Aminu Musa
