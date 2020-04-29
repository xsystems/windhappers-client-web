FROM httpd:2.4-alpine

LABEL maintainer="xsystems"

COPY es6-unbundled/ /usr/local/apache2/htdocs/

RUN echo "FallbackResource /index.html" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
