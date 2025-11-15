# PowerShell script to start ngrok tunnel for Flask API
Write-Host "Starting ngrok tunnel for Flask API (port 5000)..." -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Copy the HTTPS URL (forwarding line) and set it in Supabase!" -ForegroundColor Yellow
Write-Host ""

# Start ngrok
& "C:\Program Files\ngrok.exe" http 5000

