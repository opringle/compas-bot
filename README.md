# compas-bot

- Fullfillment code for compas card agent
- Allows us to POST and GET information to/from dialogueflow during a conversation

## Deploying the code

Hosting and deployment is setup with a google cloud project.

0. [Install & setup GLP cli](https://cloud.google.com/functions/docs/quickstart)
1. Select the project associated with this customer: `$ gcloud config set project compascard-cbc5b`
2. Deploy node modules to GCP: `$ gcloud beta functions deploy CompasCard --stage-bucket staging.compascard-cbc5b.appspot.com --trigger-http
`

### ToDo:
 
- [x] Call a fake API with card and amount to upload with, respond to user
- [ ] When the user authenticates, we should load information from compasscard into user entities for use later
- [ ] Call a fake API to check user card info is correct


### Learning

- Actions allow us to trigger certain java code when an intent is hit!
- Events allow triggering dialogueflow intents from your application
- For example, I could send a facebook location
- I can customize the response manually for all channels or use a custom payload that defines the response for all channels
