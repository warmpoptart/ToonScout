@echo off

REM Change directory to the location of the Node.js app
cd /d "%~dp0"

REM Run the Node.js application in the background
start "" cmd /c "node app.js > logs\app.log 2>&1"

REM Wait a bit for the Node.js application to start
timeout /t 2 /nobreak

REM Run LocalTunnel in the background
start "" cmd /c "lt --port 3000 --subdomain toon"
