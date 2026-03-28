# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Accept REACT_APP_API_URL as build arg and expose as env for webpack DefinePlugin
ARG REACT_APP_API_URL=''
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install
COPY . .
RUN yarn build || npm run build

# Stage 2: Serve
FROM nginx:alpine
# Copy build output from Webpack (dist directory)
COPY --from=build /app/dist /usr/share/nginx/html

# Also copy Django-managed staticfiles (icons, images, rest_framework) into the nginx html root
# The build context for this Dockerfile is the repo root, so backend/staticfiles is available.
COPY /staticfiles/icons /usr/share/nginx/html/static/icons
COPY /staticfiles/images /usr/share/nginx/html/static/images
COPY /staticfiles/rest_framework /usr/share/nginx/html/static/rest_framework
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
