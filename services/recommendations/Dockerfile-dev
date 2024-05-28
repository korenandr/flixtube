FROM node:22.2.0

WORKDIR /usr/src/app
COPY package*.json ./

CMD npm install --prefer-offline && \
    npm run start:dev