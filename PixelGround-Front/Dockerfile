FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist/pixel-ground-front /usr/share/nginx/html
EXPOSE 80
