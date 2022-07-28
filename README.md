# Static-Content-Travel-Site
The Travel simple site use this service as static content server, like images or medias.
Here the commands to create the service on Openshift.

Server is wrote on NodeJS

## Build database container (ephemeral)
In order to build server container (NodeJS) prepare the config properties in a configmap:

```shell script
oc create configmap staticcontent-config.json --from-file=conf/prod/config.json
```
Now on your Openshift project you will have a new ConfigMap usable on build.

Create the stream where put the build result:

```shell script
oc create is static-content-travel-site
```
This need for the BuildConfig.spec.output

Create BuildConfig using:

```shell script
oc create -f ./build-config-openshift.yml
```

Start build on Openshift:

```shell script
oc start-build static-content-travel-site
```

##Deploy container
For run the builded image stream run:

```shell script
oc new-app static-content-travel-site --name=static-content-travelsite
```

Expose in a route the service with:

```shell script
oc create route passthrough --service static-content-travelsite
```

##Access

Your server now is accessible on browser.

The path exposed are:
 - /health : return the health check status
 - /upload/image : upload an image using POST method
 - /get/:filename : where :filename is the name of the file that you want load, this load and expose the file from server to browser
 

## Building from external registry

###Build image and push

Using _hub.docker.com_, build localy the image using docker client


```shell script
docker build -t static-content-travelsite .
```

Login into docker hub (or your registry site, e.g. quay.io)

```shell script
docker login -u username -p Your-app-generared-password
```

Tag image 

```shell script
docker tag static-content-travelsite username/static-content-travelsite
```

Push image

```shell script
docker push username/static-content-travelsite
```

After login in Openshift via OC cli, create a new app using the docker image

```shell script
oc new-app --as-deployment-config -lapp=static-content --docker-image username/static-content-travelsite
```

Your static content server is up and running
