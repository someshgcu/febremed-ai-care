@echo off
REM Quick script to start ngrok tunnel for Flask API
echo Starting ngrok tunnel for Flask API (port 5000)...
echo.
echo IMPORTANT: Copy the HTTPS URL (forwarding line) and set it in Supabase!
echo.
cd /d "%~dp0"
"C:\Program Files\ngrok.exe" http 5000
pause

