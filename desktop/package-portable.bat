@echo off
echo ========================================
echo Packaging Collabrix Portable
echo ========================================
echo.

if not exist "dist\win-unpacked\Collabrix.exe" (
    echo ERROR: Portable app not found!
    echo Please run build-portable.bat first
    pause
    exit /b 1
)

echo Creating portable package...
echo.

REM Create a clean folder name
set PACKAGE_NAME=Collabrix-Portable-v1.0.0

REM Remove old package if exists
if exist "dist\%PACKAGE_NAME%" rmdir /s /q "dist\%PACKAGE_NAME%"
if exist "dist\%PACKAGE_NAME%.zip" del /q "dist\%PACKAGE_NAME%.zip"

REM Copy files to package folder
echo Copying files...
xcopy "dist\win-unpacked" "dist\%PACKAGE_NAME%\" /E /I /Q

REM Create README
echo Creating README...
(
echo COLLABRIX PORTABLE
echo ==================
echo.
echo This is the portable version of Collabrix.
echo No installation required!
echo.
echo HOW TO USE:
echo -----------
echo 1. Extract this entire folder anywhere on your computer
echo 2. Double-click Collabrix.exe to run
echo 3. That's it!
echo.
echo You can copy this folder to a USB drive or anywhere else.
echo Your settings will be saved in this folder.
echo.
echo SYSTEM REQUIREMENTS:
echo --------------------
echo - Windows 10 or 11
echo - Internet connection
echo.
echo SUPPORT:
echo --------
echo Visit: https://collabrixs.vercel.app
echo GitHub: https://github.com/JuusoJuusto/Collabrix
echo.
echo Enjoy Collabrix!
) > "dist\%PACKAGE_NAME%\README.txt"

echo.
echo Package created: dist\%PACKAGE_NAME%\
echo.
echo You can now:
echo 1. Copy the folder to distribute
echo 2. Or create a ZIP file manually
echo.
echo To create ZIP: Right-click the folder and select "Send to > Compressed (zipped) folder"
echo.

pause
