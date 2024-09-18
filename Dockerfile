FROM node:19.9 as build

COPY . .
RUN npm install
RUN npm run build

FROM nginxinc/nginx-unprivileged:mainline-alpine-slim

COPY --from=build --chown=101:101 dist/ /usr/share/nginx/html/