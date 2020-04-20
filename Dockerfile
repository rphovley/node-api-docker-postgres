# image for node version 12
FROM node:erbium-alpine 

COPY ./node_modules /api/node_modules
COPY ./server/dist /api/server/dist