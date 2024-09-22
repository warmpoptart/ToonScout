@echo off

:: Set the working directory to the script's location
cd /d "%~dp0"

:: Register all commands
npm run register

:: Start the Node.js application and redirect output to app.log
start /B cmd /C "node %~dp0app.js > %~dp0logs\app.log 2>&1"

:: Allow time for LocalTunnel to start
timeout /t 1 /nobreak > nul

:: Start LocalTunnel
lt --port 3000 --subdomain toon
