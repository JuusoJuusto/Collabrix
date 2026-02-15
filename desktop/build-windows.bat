@echo off
echo ========================================
echo   Building Collabrix Desktop for Windows
echo ========================================
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo [1/3] Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo ❌ Failed to install dependencies
    echo Make sure Node.js is installed: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/3] Building Windows installer...
call npm run build:win

if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo [3/3] Build complete!
echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Output: %CD%\dist\Collabrix Setup 1.0.0.exe
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
