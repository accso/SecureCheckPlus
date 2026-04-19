# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

ARG REACT_APP_API_URL=''
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install
COPY . .
RUN yarn build || npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
