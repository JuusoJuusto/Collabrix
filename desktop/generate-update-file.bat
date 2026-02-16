@echo off
echo Generating latest.yml for auto-updates...
echo.

if not exist "dist\collabrix-desktop Setup 1.0.0.exe" (
    echo ERROR: Installer not found!
    echo Please build the installer first with BUILD-INSTALLER-ADMIN.bat
    pause
    exit /b 1
)

:: Get file size and calculate SHA512
for %%F in ("dist\collabrix-desktop Setup 1.0.0.exe") do set SIZE=%%~zF

echo Creating latest.yml...
(
echo version: 1.0.0
echo files:
echo   - url: collabrix-desktop Setup 1.0.0.exe
echo     sha512: AUTO_GENERATED_ON_GITHUB
echo     size: %SIZE%
echo path: collabrix-desktop Setup 1.0.0.exe
echo sha512: AUTO_GENERATED_ON_GITHUB
echo releaseDate: '%date:~-4%-%date:~3,2%-%date:~0,2%T00:00:00.000Z'
) > "dist\latest.yml"

echo.
echo SUCCESS! Created dist\latest.yml
echo.
echo NEXT STEPS:
echo 1. Upload to GitHub Releases:
echo    - collabrix-desktop Setup 1.0.0.exe
echo    - latest.yml
echo.
echo 2. Users will get auto-update notifications!
echo.
pause
