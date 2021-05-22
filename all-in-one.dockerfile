# Set the base image to node:12-alpine
FROM node:12-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the container
COPY . /app/

# Prepare the container for building React
RUN yarn install
# We want the production version
RUN yarn run build

# Prepare nginx
FROM nginx:1.16.0-alpine

COPY nginx/ /etc/nginx/templates
COPY --from=build /app/build /usr/share/nginx/html

VOLUME [ "/app" ]
