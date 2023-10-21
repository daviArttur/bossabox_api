FROM node:18.18.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]