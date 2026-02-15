@echo off
echo ========================================
echo   Building Collabrix Desktop Installer
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Building Windows installer...
echo This may take 2-3 minutes...
call npm run build:win

if errorlevel 1 (
    echo ❌ Build failed!
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
echo Installer: %CD%\dist\Collabrix-Setup-1.0.0.exe
echo.
echo The installer will:
echo - Install to Program Files
echo - Create Start Menu shortcut
echo - Create Desktop shortcut
echo - Add to Windows Apps list
echo.
start "" "%CD%\dist"
pause
