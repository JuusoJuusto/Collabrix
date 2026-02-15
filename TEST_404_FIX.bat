@echo off
echo ========================================
echo   Testing Vercel 404 Fix
echo ========================================
echo.

echo Testing URLs...
echo.

echo 1. Testing /auth/action
curl -I https://collabrixs.vercel.app/auth/action 2>nul | findstr "HTTP"
echo.

echo 2. Testing /login
curl -I https://collabrixs.vercel.app/login 2>nul | findstr "HTTP"
echo.

echo 3. Testing /register
curl -I https://collabrixs.vercel.app/register 2>nul | findstr "HTTP"
echo.

echo ========================================
echo   Results
echo ========================================
echo.
echo If you see "HTTP/2 200" - SUCCESS! ✅
echo If you see "HTTP/2 404" - Still broken ❌
echo.
echo Now test in browser:
echo https://collabrixs.vercel.app/auth/action
echo.
echo Press Ctrl+Shift+R to hard refresh!
echo.
pause
