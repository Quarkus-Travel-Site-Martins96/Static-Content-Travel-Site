FROM node:18-alpine

LABEL author="Luca Martinelli"
LABEL name="static-content-travelsite"

RUN mkdir /opt/app && mkdir /opt/app/conf && mkdir /opt/app/src && mkdir /opt/medias
WORKDIR /opt/app

COPY package*.json ./
COPY src ./src/
ADD ["config.json", "/opt/app/conf/config.json"]

#This is for data starting up, remove if you need a clean statement
COPY tmp /opt/medias


RUN npm install -g typescript && \
	npm install && \
	tsc src/*
	

EXPOSE 5000
CMD [ "npm", "run", "prod" ]