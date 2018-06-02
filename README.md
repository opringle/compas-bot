# compas-bot

- Fullfillment code for compas card agent
- Allows us to POST and GET information to/from dialogueflow during a conversation

## Deploying the application

### Locally

1. [Install the latest version of node.js](https://nodejs.org/en/)
2. [Setup, install & authorize ngrok](https://dashboard.ngrok.com/get-started)
3. From the root directory of this repo, install required node modules: `$ npm install`
4. Deploy functions locally using [google cloud functions emulator](https://cloud.google.com/functions/docs/emulator):
    - `$ functions list`
    - `$ functions config set projectId <project id>`
    - `$ gcloud beta functions deploy CompasCard --trigger-http`
    - `$ functions inspect CompasCard`
5. Point ngrok to where your functions are running: `$ ~/ngrok http 8010`
6. In the Dialogflow agent front end, set Fullfillment URL: `<ngrok forwarding address>/compascard-cbc5b/us-central1/CompasCard`
7. You can now send messages in dialogflow, which will trigger your local fullfillments code

### On Google Cloud Platform

Hosting and deployment is setup with a google cloud project.

1. [Install & setup GLP cli](https://cloud.google.com/functions/docs/quickstart)
2. Select the project associated with this customer: `$ gcloud config set project compascard-cbc5b`
3. Deploy node modules to GCP: `$ gcloud beta functions deploy CompasCard --stage-bucket staging.compascard-cbc5b.appspot.com --trigger-http`

### ToDo

- [ ] Run functions with nodemon to make it easy to edit and debug your code
- [ ] Logged in parameters should be stored as user session parameters so we can clear loggin context
- [ ] Bulk out with more definitions and smalltalk
- [ ] Core modules should be a package which is installed into every business project 
- [ ] Need to handle fallbacks depending on context.

## Design Principles

- Functions for performing various tasks like confirming intent execution are valuable to scalable design