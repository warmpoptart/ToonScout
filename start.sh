#!/bin/bash

# register all commands
npm run register
# Start the Node.js application and redirect output
node /c/Users/erin/workspaces/toonlocalapi/app.js > /c/Users/erin/workspaces/toonlocalapi/logs/app.log 2>&1 &

# allow time for LocalTunnel to start
sleep 1

# Start LocalTunnel
lt --port 3000 --subdomain toon
