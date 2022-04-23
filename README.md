# An interactive application for learning web development

This application is a platform for completing front-end web development projects tightly coupled to real-world scenarios. A hosted, production version of this application can be found [here](https://acecoder.vercel.app/).

The application uses SvelteKit for the front-end user interface. Firebase is used for authentication, database and cloud function services. Docker and Google Cloud Run are used to create and deploy the online judge system used to evaluate submissions.



## Running the project

The following instructions are written for deployment with Linux. Some of these tools may not work, or more configuration may be required on other operating systems.

### Configuration

Clone this repository to your local machine. Install and configure [Node.js](https://nodejs.org/en/). Install and configure the [Firebase emulator](https://firebase.google.com/docs/emulator-suite)

Ensure that the `export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"` environment variable is set so that the Admin SDK can communicate with the emulator.

### Local execution

The following commands must be executed from the root directory of this repository to run the project locally:

1. Start the firebase emulators with `npm run emulator`.
2. Start the evaluation server using `cd server && npm install && npm run local:emulator`
3. Start the web application with `cd app && npm install && npm run dev`

### Deployment

This project has been configured to deploy to Google Cloud and Vercel. Alternative deployment destinations will require further configuration.

To build and deploy the evaluation server, run `cd server && npm install &&  deploy`.

To build and deploy the front-end application using Vercel, run `cd app && npm install && vercel`

Deploy and provision Firebase resources using `npm install && firebase deploy`

## Admin SDK

The admin SDK is used to securely configure the backend of the application. It should only be run in a secure development environment. Ensure the following environment variable is set: `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"` to give Google Cloud tools access to your service account.

## CI/CD

A GitLab Runner instance is used on a docker container to run the CI/CD pipeline defined in `.gitlab-ci.yml`. Note that this is not required to run the application. Create the instance with the following command

```bash
docker run -d --name gitlab-runner --restart always \
     -v /srv/gitlab-runner/config:/etc/gitlab-runner \
     -v /var/run/docker.sock:/var/run/docker.sock \
     gitlab/gitlab-runner:latest
```

To interact with a running container, run `sudo docker exec -it gitlab-runner /bin/bash`. If the container is running but not responding, restart the service with the following:

```bash
service gitlab-runner stop
service gitlab-runner start
```


> A dissertation project created by [Daniel Berry](mailto:deb1g19@soton.ac.uk) at the University of Southampton.