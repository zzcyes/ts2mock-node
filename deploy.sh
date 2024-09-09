#!/usr/bin/bash

PM2_APP_NAME=PM2_APP_NAME
PORT=PORT
NODE_PATH=NODE_PATH
PACKAGE_PATH=PACKAGE_PATH
APP_PATH=APP_PATH
PM2_PATH=PM2_PATH

export PATH=NODE_PATH:$PATH
export PATH=PM2_PATH:$PATH

pm2 stop ${PM2_APP_NAME}

pm2 delete ${PM2_APP_NAME}

PORT=${PORT} pm2 start ${PACKAGE_PATH}/${APP_PATH} --name ${PM2_APP_NAME}

