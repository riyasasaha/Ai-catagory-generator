@echo off
echo Starting Backend Server...
start cmd /k "cd server && node server.js"

echo Starting Frontend Server...
start cmd /k "cd client && node node_modules/vite/bin/vite.js"

echo.
echo =========================================
echo Both servers have been launched!
echo The App should be available at http://localhost:5173
echo Please make sure you added your GEMINI_API_KEY in server/.env
echo =========================================
pause
