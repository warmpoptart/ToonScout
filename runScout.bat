@echo off

rem Register all commands and log output
start /b cmd /c "npm run register"

rem Start the Node.js application and log output
start /b cmd /c "node app.js"

rem Start LocalTunnel and log output
start /b cmd /c "lt --port 3000 --subdomain toon"

exit