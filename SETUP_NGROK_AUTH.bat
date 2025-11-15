@echo off
REM Script to help set up ngrok authentication
echo ========================================
echo ngrok Authentication Setup
echo ========================================
echo.
echo Step 1: Sign up at https://dashboard.ngrok.com/signup
echo Step 2: Get your authtoken at https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo After you have your authtoken, run this command:
echo.
echo   "C:\Program Files\ngrok.exe" config add-authtoken YOUR_AUTHTOKEN
echo.
echo Then you can start ngrok with:
echo.
echo   "C:\Program Files\ngrok.exe" http 5000
echo.
echo ========================================
pause

