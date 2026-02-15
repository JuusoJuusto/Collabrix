@echo off
echo ========================================
echo   FORCE DEPLOY TO VERCEL
echo ========================================
echo.
echo This will:
echo 1. Commit the vercel.json fix
echo 2. Push to GitHub
echo 3. Force redeploy to Vercel
echo.
pause

cd client

echo.
echo [1/4] Adding changes...
git add .

echo [2/4] Committing...
git commit -m "Fix: Update vercel.json for SPA routing"

echo [3/4] Pushing to GitHub...
git push origin main

echo.
echo [4/4] Force deploying to Vercel...
call vercel --prod --force

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Test these URLs now:
echo - https://collabrixs.vercel.app/login
echo - https://collabrixs.vercel.app/auth/action
echo.
echo If still 404, wait 1-2 minutes for propagation
echo.
pause
