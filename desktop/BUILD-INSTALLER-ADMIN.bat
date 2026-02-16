@echo off
:: Collabrix Installer Builder with Auto-Admin
:: Double-click this file to build the installer

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% == 0 (
    goto :build
) else (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:build
:: Now running as admin
title Collabrix Installer Builder
color 0A

echo.
echo ========================================
echo   COLLABRIX INSTALLER BUILDER
echo ========================================
echo   Running with Administrator privileges
echo ========================================
echo.

:: Check icon files
if not exist "%~dp0icon.ico" (
    color 0C
    echo [ERROR] icon.ico not found!
    echo Please add icon.ico to the desktop folder
    echo.
    pause
    exit /b 1
)

if not exist "%~dp0icon.png" (
    color 0C
    echo [ERROR] icon.png not found!
    echo Please add icon.png to the desktop folder
    echo.
    pause
    exit /b 1
)

echo [OK] Found icon files
echo.

:: Clean old builds
echo [1/4] Cleaning old builds...
if exist "%~dp0dist" (
    rmdir /s /q "%~dp0dist" 2>nul
)

:: Clean problematic cache
echo [2/4] Cleaning code signing cache...
if exist "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" (
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" 2>nul
)

:: Install dependencies
echo [3/4] Installing dependencies...
cd /d "%~dp0"
call npm install >nul 2>&1

:: Build installer
echo [4/4] Building installer (this takes 2-3 minutes)...
echo       Please wait...
echo.

set CSC_IDENTITY_AUTO_DISCOVERY=false
set WIN_CSC_LINK=
set WIN_CSC_KEY_PASSWORD=

call npm run build:win

echo.
:: Check if successful
if exist "%~dp0dist\Collabrix-Setup-*.exe" (
    color 0A
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    for %%F in ("%~dp0dist\Collabrix-Setup-*.exe") do (
        echo   File: %%~nxF
        echo   Size: %%~zF bytes
        echo   Location: dist\
    )
    echo.
    echo ========================================
    echo   You can now install Collabrix!
    echo ========================================
) else (
    color 0C
    echo ========================================
    echo   BUILD FAILED
    echo ========================================
    echo.
    echo The installer could not be created.
    echo.
    echo WORKAROUND: Use the portable version instead
    echo Location: dist\win-unpacked\Collabrix.exe
    echo.
    echo The portable version works without installation!
)

echo.
echo Press any key to exit...
pause >nul
