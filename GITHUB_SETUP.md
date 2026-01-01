# GitHub Setup Guide - Step by Step

## 📋 Prerequisites
- GitHub account created
- Git installed on your system
- Terminal/Command Prompt ready

## 🚀 Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open terminal in the project root directory (`C:\Users\Hp\sangamsetu`) and run:

```bash
git init
```

### Step 2: Add All Files to Git

```bash
git add .
```

### Step 3: Make Initial Commit

```bash
git commit -m "Initial commit: SangamSetu - Missing Person Reunification Platform"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `sangamsetu` (or any name you prefer)
   - **Description**: "Missing Person Reunification Platform for Kumbh Mela"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/sangamsetu.git

# Or if you prefer SSH (if you have SSH keys set up):
# git remote add origin git@github.com:YOUR_USERNAME/sangamsetu.git
```

### Step 6: Rename Branch to Main (if needed)

```bash
git branch -M main
```

### Step 7: Push Code to GitHub

```bash
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

## 🔑 Using Personal Access Token (Recommended)

If you get authentication errors, use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name and select scopes: `repo` (full control)
4. Click "Generate token"
5. Copy the token (you won't see it again!)
6. Use this token as your password when pushing

## ✅ Verify Push

1. Go to your GitHub repository page
2. You should see all your files there
3. Check that these files are present:
   - README.md
   - Dockerfile
   - docker-compose.yml
   - .github/workflows/ci-cd.yml
   - All source code files

## 🔄 Future Updates

After making changes, use these commands to push updates:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## 🛠️ Troubleshooting

### Issue: "fatal: remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/sangamsetu.git
```

### Issue: "Permission denied"
**Solution:**
- Use Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue: "Large files detected"
**Solution:**
- Make sure `node_modules/` is in `.gitignore`
- Remove large files: `git rm --cached <file>`
- Commit again

### Issue: "Nothing to commit"
**Solution:**
- Check if files are in `.gitignore`
- Use `git status` to see what's tracked

## 📝 Quick Command Summary

```bash
# One-time setup
git init
git add .
git commit -m "Initial commit: SangamSetu project"
git remote add origin https://github.com/YOUR_USERNAME/sangamsetu.git
git branch -M main
git push -u origin main

# For future updates
git add .
git commit -m "Your commit message"
git push
```

---

**Need help?** Check GitHub documentation: https://docs.github.com/en/get-started

