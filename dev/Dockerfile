# Stage 1 - React build
FROM node:12
WORKDIR /app
COPY package.json /app/
RUN yarn install
ENTRYPOINT ["yarn"]
CMD ["start"]