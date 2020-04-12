# Stage 1 - React build
FROM node:10 as react-build
WORKDIR /app
COPY . ./
RUN yarn install --network-timeout 1000000
RUN yarn build

# Stage 2 - production container
FROM nginx:alpine
ENV APP_HOME  /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build ${APP_HOME}
ADD docker/entrypoint.sh /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
