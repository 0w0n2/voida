FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build
