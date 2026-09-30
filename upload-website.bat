@echo off
title MINEGTA Website Upload
color 0A

cd /d "C:\Users\smart\Pictures\minepresets_ready_to_upload"

echo.
echo ==========================================
echo       MINEGTA WEBSITE UPLOADER
echo ==========================================
echo.

echo [1/4] Checking website files...
if not exist "index.html" (
    echo.
    echo ERROR: index.html nahi mila!
    echo Check karo ki website folder sahi hai.
    pause
    exit /b
)

echo.
echo [2/4] Adding new changes...
git add -A

echo.
echo [3/4] Creating update...
git commit -m "Update website"

echo.
echo [4/4] Uploading to GitHub...
git push origin main

echo.
echo ==========================================
echo        WEBSITE UPLOAD COMPLETE!
echo ==========================================
echo.
echo GitHub:
echo https://github.com/minegta-001/Minegta-website
echo.
echo Live website update hone me thoda time lag sakta hai.
echo Browser me Ctrl + F5 dabana.
echo.
pause