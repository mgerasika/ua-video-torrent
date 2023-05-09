FROM node:16 as builder

COPY . /app/

WORKDIR /app
RUN yarn
RUN yarn run build

FROM nginx:latest
ENV PORT=8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /var/www/dist
