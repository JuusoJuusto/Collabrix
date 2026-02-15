@echo off
echo ========================================
echo   Deploying Client to Vercel
echo ========================================
echo.

cd client

echo Checking for uncommitted changes...
git status --short
echo.

echo Building locally to check for errors...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed! Fix errors before deploying.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo Deploying to Vercel production...
call vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test the birthday order (should be Day/Month/Year)
echo 2. Update Railway CORS_ORIGIN with your Vercel URL
echo 3. Add Vercel domain to Firebase authorized domains
echo.
pause
