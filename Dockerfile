FROM node:13.12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD node /app/src/index.js
