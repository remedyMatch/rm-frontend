# Stage 1 - Build Angular App
FROM node:10-alpine as builder

COPY package.json package-lock.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN npm run ng build -- --prod --output-path=dist

# Stage 2 - production container
FROM nginx:alpine
#COPY docker/entrypoint.sh /usr/local/sbin/entrypoint.sh
#COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /ng-app/dist /usr/share/nginx/html
EXPOSE 80
#ENTRYPOINT ["/usr/local/sbin/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
