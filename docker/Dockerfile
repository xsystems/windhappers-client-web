FROM httpd:2.4-alpine

LABEL maintainer="xsystems"

COPY windhappers-client-web /usr/local/bin/
COPY es-bundled/ /usr/local/apache2/htdocs/
COPY httpd-windhappers-client-web.conf /usr/local/apache2/conf/extra/

RUN echo "Include conf/extra/httpd-windhappers-client-web.conf" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["windhappers-client-web"]
