# 🚀 Quick Start - Push to GitHub

## Option 1: Using Batch Script (Windows)

1. **Double-click** `PUSH_TO_GITHUB.bat` 
2. Follow the instructions shown

## Option 2: Manual Steps (All Platforms)

### Step 1: Initialize Git
```bash
git init
```

### Step 2: Add All Files
```bash
git add .
```

### Step 3: Commit
```bash
git commit -m "Initial commit: SangamSetu - Missing Person Reunification Platform"
```

### Step 4: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `sangamsetu`
3. Description: `Missing Person Reunification Platform`
4. Choose Public or Private
5. **DON'T** check README, .gitignore, or license
6. Click **"Create repository"**

### Step 5: Copy Repository URL

After creating, GitHub shows the URL. It looks like:
```
https://github.com/YOUR_USERNAME/sangamsetu.git
```

### Step 6: Connect and Push

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/sangamsetu.git
git branch -M main
git push -u origin main
```

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)

## 🔑 Get Personal Access Token

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select `repo` scope
5. Generate and copy the token
6. Use this token as password when pushing

## ✅ Verify Success

Go to: `https://github.com/YOUR_USERNAME/sangamsetu`

You should see all your files including:
- ✅ README.md
- ✅ Dockerfile
- ✅ docker-compose.yml
- ✅ .github/workflows/ci-cd.yml
- ✅ All source code

---

**That's it! Your code is now on GitHub! 🎉**

