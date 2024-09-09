#!/usr/bin/bash

PM2_APP_NAME=PM2_APP_NAME
PORT=PORT
NODE_PATH=NODE_PATH

pm2 stop ${PM2_APP_NAME}

pm2 delete ${PM2_APP_NAME}

export PATH=NODE_PATH:$PATH

PORT=${PORT} pm2 start /var/www/packages/ts2mock-node-setup/dist/app.js --name ${PM2_APP_NAME}

