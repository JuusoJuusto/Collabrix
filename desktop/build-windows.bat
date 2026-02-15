@echo off
echo ========================================
echo   Building Collabrix Desktop for Windows
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ⚠️  This script needs Administrator privileges
    echo    Right-click and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

REM Get the directory where this script is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo [1/4] Clearing electron-builder cache...
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache" 2>nul
echo Cache cleared!

echo.
echo [2/4] Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo ❌ Failed to install dependencies
    echo Make sure Node.js is installed: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [3/4] Building Windows installer (no code signing)...
call npm run build:win

if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Output: %CD%\dist\Collabrix Setup 1.0.0.exe
echo.
echo ⚠️  Note: This installer is NOT code-signed
echo    Windows will show a warning when users install it
echo    This is normal for unsigned apps
echo.
echo You can now:
echo 1. Test the installer by running it
echo 2. Upload to GitHub Releases
echo 3. Share the download link
echo.
echo Opening dist folder...
start "" "%CD%\dist"
echo.
pause
