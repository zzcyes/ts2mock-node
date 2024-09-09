#!/bin/bash

PM2_APP_NAME=ts2mock-node-server
PORT=3000

sudo pm2 stop ${PM2_APP_NAME}

sudo pm2 delete ${PM2_APP_NAME}

sudo PORT=${PORT} pm2 start /var/www/packages/ts2mock-node-setup/app.js --name ${PM2_APP_NAME}

rm /var/www/packages/ts2mock-node/package.tgz

# 输出 pm2 状态
sudo pm2 list