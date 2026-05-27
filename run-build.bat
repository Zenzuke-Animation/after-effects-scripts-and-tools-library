@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d D:\Dropbox\VibeC\after-effects-scripts-and-tools-library
echo Cleaning previous build...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
echo.
echo Building static site...
call npm run build
echo.
echo Fixing paths for subdirectory deployment...
call powershell -NoProfile -ExecutionPolicy Bypass -File fix-paths.ps1
echo.
echo DONE
pause
