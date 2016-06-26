FROM httpd:2.4

MAINTAINER xsystems

COPY ./dist/ /usr/local/apache2/htdocs/
