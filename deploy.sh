#!/bin/bash

PM2_APP_NAME=ts2mock-node-server
PORT=3000

pm2 stop ${PM2_APP_NAME}

pm2 delete ${PM2_APP_NAME}

PORT=${PORT} pm2 start /var/www/packages/ts2mock-node-setup/dist/app.js --name ${PM2_APP_NAME}

# rm /var/www/packages/ts2mock-node/package.tgz