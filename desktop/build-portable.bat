@echo off
echo ========================================
echo Building Collabrix Portable Version
echo ========================================
echo.
echo NOTE: This creates a portable app (no installer needed)
echo No admin rights required!
echo.

REM Check if icon files exist in current directory
if not exist "%~dp0icon.ico" (
    echo ERROR: icon.ico not found in desktop folder!
    echo Current directory: %CD%
    echo Looking for: %~dp0icon.ico
    echo Please add icon.ico before building
    pause
    exit /b 1
)

if not exist "%~dp0icon.png" (
    echo ERROR: icon.png not found in desktop folder!
    echo Current directory: %CD%
    echo Looking for: %~dp0icon.png
    echo Please add icon.png before building
    pause
    exit /b 1
)

echo Found icon files:
dir /b "%~dp0icon.*"
echo.

echo Cleaning old build...
if exist "%~dp0dist" rmdir /s /q "%~dp0dist"

echo.
echo Installing dependencies...
call npm install

echo.
echo Building portable version...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run build

echo.
if exist "%~dp0dist\win-unpacked" (
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Portable app created in: dist\win-unpacked\
    echo.
    echo To use:
    echo 1. Copy the entire "win-unpacked" folder anywhere
    echo 2. Run Collabrix.exe from that folder
    echo 3. No installation needed!
) else (
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Check the error messages above
)

echo.
pause
