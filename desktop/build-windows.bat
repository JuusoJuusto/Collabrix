@echo off
echo ========================================
echo Building Collabrix Desktop Installer
echo ========================================
echo.

REM Check if icon files exist
if not exist "icon.ico" (
    echo ERROR: icon.ico not found!
    echo Please add icon.ico before building
    pause
    exit /b 1
)

if not exist "icon.png" (
    echo ERROR: icon.png not found!
    echo Please add icon.png before building
    pause
    exit /b 1
)

echo Cleaning old build cache...
if exist "dist" rmdir /s /q "dist"
if exist "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign"

echo.
echo Installing dependencies...
call npm install

echo.
echo Building Windows installer (this may take 2-3 minutes)...
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run build:win

echo.
if exist "dist\Collabrix-Setup-*.exe" (
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Installer created in: dist\
    echo.
    dir /b dist\*.exe
    echo.
    echo You can now install Collabrix on your computer!
) else (
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Try running this script as Administrator:
    echo Right-click build-windows.bat and select "Run as administrator"
    echo.
    echo Or use build-portable.bat instead (no admin needed)
)

echo.
pause
