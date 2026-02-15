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

echo Installing dependencies...
call npm install

echo.
echo Building Windows installer...
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
    echo Check the error messages above
)

echo.
pause
