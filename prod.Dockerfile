FROM node:18-alpine

LABEL author="Luca Martinelli"
LABEL name="static-content-travelsite"

RUN mkdir /opt/app && mkdir /opt/app/conf && mkdir /opt/app/src && mkdir /opt/medias
WORKDIR /opt/app

#Sample data
COPY tmp ../medias/

COPY package*.json ./
COPY src ./src/

#config
ADD ["conf/prod/static-content-config.json", "/opt/app/conf/static-content-config.json"]


RUN npm cache clean --force  && \
	chown -R node "/opt" && \
	chown -R node "/usr/local" && \
	chown -R node "/home/node"
	
USER node

RUN npm install -g typescript && \
	npm install && \
	tsc src/*

EXPOSE 5000
CMD [ "npm", "run", "prod" ]