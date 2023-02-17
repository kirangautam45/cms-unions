FROM node:16.14.2-buster as node

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

RUN apt-get update && apt-get install python python3 python3-pip -y

WORKDIR /app

ADD ./ /app
RUN npm cache clear --force
RUN npm install
RUN npm run build --base-href='/cms'
 
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx

FROM nginx:latest
COPY --from=node /app/build/ /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# support running as arbitrary user which belogs to the root group
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chgrp -R root /var/cache/nginx

# comment user directive as master process is run as user in OpenShift anyhow
RUN sed -i 's/^user/#user/' /etc/nginx/nginx.conf
#RUN sed -i 's|/static/|/auth-web/static/|g' /usr/share/nginx/html/index.html
RUN addgroup nginx root

EXPOSE 8080

USER nginx
