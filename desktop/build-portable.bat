@echo off
echo ========================================
echo Building Collabrix Portable Version
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
echo Building portable version...
call npm run build

echo.
if exist "dist\win-unpacked" (
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Portable app created in: dist\win-unpacked\
    echo.
    echo Run Collabrix.exe from that folder
) else (
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo Check the error messages above
)

echo.
pause
