FROM node:14-alpine

COPY . .

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE 8005

CMD [ "yarn",  "start" ]
