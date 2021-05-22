FROM nginx:1.20

COPY nginx/ /etc/nginx/templates
COPY ./build /usr/share/nginx/html

VOLUME [ "/app" ]
