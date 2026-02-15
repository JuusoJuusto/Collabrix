@echo off
echo ========================================
echo   Building Collabrix Desktop for Windows
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Building Windows installer...
call npm run build:win

echo.
echo [3/3] Build complete!
echo.
echo Output: dist\Collabrix Setup 1.0.0.exe
echo.
echo You can now:
echo 1. Test the installer
echo 2. Upload to GitHub Releases
echo 3. Share the download link
echo.
pause
