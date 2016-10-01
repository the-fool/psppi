FROM node:6
RUN mkdir /app
WORKDIR /app
ADD ./compose/client/entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]