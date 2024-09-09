#!/usr/bin/bash

PM2_APP_NAME=PM2_APP_NAME
PORT=PORT

pm2 stop ${PM2_APP_NAME}

pm2 delete ${PM2_APP_NAME}

export PATH=/root/.nvm/versions/node/v18.20.4/bin:$PATH

PORT=${PORT} pm2 start /var/www/packages/ts2mock-node-setup/dist/app.js --name ${PM2_APP_NAME}

