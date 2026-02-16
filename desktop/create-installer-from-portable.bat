@echo off
echo ========================================
echo Creating Installer from Portable Build
echo ========================================
echo.

if not exist "dist\win-unpacked\Collabrix.exe" (
    echo ERROR: Portable build not found!
    echo Please run build-portable.bat first
    pause
    exit /b 1
)

echo Step 1: Installing NSIS (if needed)...
where makensis >nul 2>nul
if %errorlevel% neq 0 (
    echo NSIS not found. Installing via Chocolatey...
    where choco >nul 2>nul
    if %errorlevel% neq 0 (
        echo ERROR: Chocolatey not installed!
        echo.
        echo Please install NSIS manually from: https://nsis.sourceforge.io/Download
        echo Or install Chocolatey from: https://chocolatey.org/install
        pause
        exit /b 1
    )
    choco install nsis -y
)

echo.
echo Step 2: Creating NSIS script...

(
echo !include "MUI2.nsh"
echo.
echo Name "Collabrix"
echo OutFile "dist\Collabrix-Setup-1.0.0.exe"
echo InstallDir "$PROGRAMFILES64\Collabrix"
echo RequestExecutionLevel admin
echo.
echo !define MUI_ICON "icon.ico"
echo !define MUI_UNICON "icon.ico"
echo !define MUI_HEADERIMAGE
echo !define MUI_HEADERIMAGE_BITMAP "icon.ico"
echo !define MUI_WELCOMEFINISHPAGE_BITMAP "icon.ico"
echo.
echo !insertmacro MUI_PAGE_WELCOME
echo !insertmacro MUI_PAGE_DIRECTORY
echo !insertmacro MUI_PAGE_INSTFILES
echo !insertmacro MUI_PAGE_FINISH
echo.
echo !insertmacro MUI_UNPAGE_CONFIRM
echo !insertmacro MUI_UNPAGE_INSTFILES
echo.
echo !insertmacro MUI_LANGUAGE "English"
echo.
echo Section "Install"
echo   SetOutPath "$INSTDIR"
echo   File /r "dist\win-unpacked\*.*"
echo   CreateDirectory "$SMPROGRAMS\Collabrix"
echo   CreateShortcut "$SMPROGRAMS\Collabrix\Collabrix.lnk" "$INSTDIR\Collabrix.exe"
echo   CreateShortcut "$DESKTOP\Collabrix.lnk" "$INSTDIR\Collabrix.exe"
echo   WriteUninstaller "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Collabrix" "DisplayName" "Collabrix"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Collabrix" "UninstallString" "$INSTDIR\Uninstall.exe"
echo SectionEnd
echo.
echo Section "Uninstall"
echo   Delete "$INSTDIR\Uninstall.exe"
echo   RMDir /r "$INSTDIR"
echo   Delete "$SMPROGRAMS\Collabrix\Collabrix.lnk"
echo   RMDir "$SMPROGRAMS\Collabrix"
echo   Delete "$DESKTOP\Collabrix.lnk"
echo   DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Collabrix"
echo SectionEnd
) > installer.nsi

echo.
echo Step 3: Building installer...
makensis installer.nsi

if exist "dist\Collabrix-Setup-1.0.0.exe" (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo Installer created: dist\Collabrix-Setup-1.0.0.exe
    echo.
    del installer.nsi
) else (
    echo.
    echo ========================================
    echo FAILED!
    echo ========================================
    echo.
    echo Check error messages above
)

pause
