FROM node:18-alpine

LABEL author="Luca Martinelli"
LABEL name="static-content-travelsite (DEV)"

RUN mkdir /opt/app && mkdir /opt/app/conf && mkdir /opt/app/src && mkdir /opt/medias
WORKDIR /opt/app

COPY package*.json ./
COPY src ./src/

#DEV config and testing data
ADD ["conf/dev/static-content-config.json", "/opt/app/conf/static-content-config.json"]
COPY tmp ./tmp/


RUN npm install -g typescript && \
	npm install && \
	tsc src/*
	

EXPOSE 5000
CMD [ "npm", "run", "dev" ]