# compas-bot

- Fullfillment code for compas card agent
- Allows us to POST and GET information to/from dialogueflow during a conversation

## Deploying the application

### Locally

1. [Install the latest version of node.js](https://nodejs.org/en/)
2. [Setup, install & authorize ngrok](https://dashboard.ngrok.com/get-started)
3. From the root directory of this repo, install required node modules: `$ npm install`
4. Deploy functions locally using google cloud functions emulator: `$ functions start && functions deploy CompasCard --trigger-http`
5. Point ngrok to where your functions are running: `$ ~/ngrok http 8010`
6. In Dialogflow Fullfillment, set the URL: `<ngrok forwarding address>/compascard-cbc5b/us-central1/CompasCard`
7. You can now send messages in dialogflow, which will trigger your local fullfillments code

### On Google Cloud Platform

Hosting and deployment is setup with a google cloud project.

1. [Install & setup GLP cli](https://cloud.google.com/functions/docs/quickstart)
2. Select the project associated with this customer: `$ gcloud config set project compascard-cbc5b`
3. Deploy node modules to GCP: `$ gcloud beta functions deploy CompasCard --stage-bucket staging.compascard-cbc5b.appspot.com --trigger-http`

### ToDo
 
- [x] Call a fake API with card and amount to upload with, respond to user
- [x] Get running locally with ngrok
- [x] agent.handleRequest() only takes intent handlers, not action handlers
- [x] At login, call fake compass API, set output context to logged in with parameters for user info
- [x] Reference user entities when loading card to verify card exists and there is a payment method
- [ ] Load stored value follow up context does not work

- [ ] Bulk out with more definitions and smalltalk
- [ ] Arrange meeting with translink to demo the agent
- [ ] Run functions with nodemon to make it easy to edit and debug your code