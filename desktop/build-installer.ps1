# Collabrix Installer Build Script
# Run this with: powershell -ExecutionPolicy Bypass -File build-installer.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Collabrix Desktop Installer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run as admin:" -ForegroundColor Yellow
    Write-Host "1. Right-click PowerShell" -ForegroundColor Yellow
    Write-Host "2. Select 'Run as administrator'" -ForegroundColor Yellow
    Write-Host "3. Navigate to this folder" -ForegroundColor Yellow
    Write-Host "4. Run: .\build-installer.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check icon files
if (-not (Test-Path "icon.ico")) {
    Write-Host "ERROR: icon.ico not found!" -ForegroundColor Red
    Write-Host "Please add icon.ico before building" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path "icon.png")) {
    Write-Host "ERROR: icon.png not found!" -ForegroundColor Red
    Write-Host "Please add icon.png before building" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Found icon files:" -ForegroundColor Green
Get-ChildItem icon.* | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

# Clean old builds and cache
Write-Host "Cleaning old builds and cache..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
}

$cacheDir = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
if (Test-Path $cacheDir) {
    Write-Host "Removing code signing cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $cacheDir -ErrorAction SilentlyContinue
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Set environment variables to disable code signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:WIN_CSC_KEY_PASSWORD = ""

# Build installer
Write-Host "Building Windows installer (this may take 2-3 minutes)..." -ForegroundColor Yellow
Write-Host "Please wait..." -ForegroundColor Gray
Write-Host ""

npm run build:win

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installer created in: dist\" -ForegroundColor Cyan
    Write-Host ""
    Get-ChildItem "dist\*.exe" | ForEach-Object { 
        Write-Host "  $($_.Name)" -ForegroundColor White
        Write-Host "  Size: $([math]::Round($_.Length / 1MB, 2)) MB" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "You can now install Collabrix on your computer!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "The build encountered errors." -ForegroundColor Yellow
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
