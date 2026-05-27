@echo off
cd /d D:\Dropbox\VibeC\after-effects-scripts-and-tools-library
git config user.name "Zenzuke-Animation"
git config user.email "zenzuke@gmail.com"
git add .
git commit -m "Initial commit: After Effects Scripts and Tools catalog"
git branch -M main
git remote add origin https://github.com/Zenzuke-Animation/after-effects-scripts-and-tools-library.git
git push -u origin main
echo DONE
