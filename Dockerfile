FROM node:17.9.0-alpine

LABEL author="Luca Martinelli"
LABEL name="static-content-travelsite"

RUN mkdir /opt/app && mkdir /opt/app/conf && mkdir /opt/app/src && mkdir /opt/medias
WORKDIR /opt/app

COPY package*.json ./
COPY src ./src/
ADD ["config.json", "/opt/app/conf/config.json"]

#for the moment set here, but move certificate to another place like secrets on Openshift
COPY conf/prod/*.pem ./conf/

RUN npm install -g typescript && \
	npm install && \
	tsc src/*
	

EXPOSE 5000
CMD [ "npm", "run", "prod" ]