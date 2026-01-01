@echo off
echo ========================================
echo SangamSetu - GitHub Push Script
echo ========================================
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Making initial commit...
git commit -m "Initial commit: SangamSetu - Missing Person Reunification Platform with Docker and CI/CD"
echo.

echo ========================================
echo Next Steps (Manual):
echo ========================================
echo 1. Create a new repository on GitHub
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
echo IMPORTANT: Replace YOUR_REPOSITORY_URL with your actual GitHub repo URL
echo Example: https://github.com/yourusername/sangamsetu.git
echo ========================================
pause

