FROM node:8

WORKDIR /usr/src/msim-app

COPY . .

RUN npm install

EXPOSE 9000

CMD [ "npm", "start" ]
