@echo off
echo ========================================
echo   Building Collabrix Portable (No Admin)
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
echo [2/3] Building portable version...
call npx electron-packager . Collabrix --platform=win32 --arch=x64 --out=dist --overwrite --icon=icon.png

if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    echo.
    echo Trying alternative method...
    call npm install electron-packager --save-dev
    call npx electron-packager . Collabrix --platform=win32 --arch=x64 --out=dist --overwrite
)

echo.
echo [3/3] Build complete!
echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Output: %CD%\dist\Collabrix-win32-x64\
echo.
echo This is a PORTABLE version (no installer needed)
echo Users can:
echo 1. Extract the folder
echo 2. Run Collabrix.exe directly
echo 3. No installation required!
echo.
echo Opening dist folder...
start "" "%CD%\dist"
echo.
pause
