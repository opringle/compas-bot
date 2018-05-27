// Dialogflow Node.js fulfillment code:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs#quick-start
// Dialoglofw Node.js fullfillment example:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs/blob/master/samples/parameters-contexts-and-rich-responses/functions/index.js
// fullfillments node.js webhookclient class:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs/blob/master/docs/WebhookClient.md
// fullfillments node.js suggestion class:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs/blob/master/docs/Card.md

'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const FuzzyMatching = require('fuzzy-matching');
const login = require('./src/authorize');
const stored_value = require('./src/stored_value');
const core = require('./src/core')

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.CompasCard = (request, response) => {

  // Create a webhookclient class
  const agent = new WebhookClient({ request, response });

  // Set business parameters 
  const allowed_top_up = [5, 10, 20, 40, 50, 100];

  // Log the incoming request from Dialogflow
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  // Make sure all callback functions only take agent as arg
  const check_card = function (agent) { stored_value.check_card(agent, allowed_top_up);}

  // Define which functions are called for which intents
  let intentMap = new Map();
  intentMap.set('Log User In', login.log_in);
  intentMap.set('Load Stored Value', check_card);
  intentMap.set('Load Stored Value - yes', stored_value.load_value);
  // Define core intents
  const respond_to_execute_intent_question = function (agent) { core.respond_to_execute_intent_question(agent, intentMap); }
  intentMap.set('Answering Yes', respond_to_execute_intent_question);
  intentMap.set('Answering No', respond_to_execute_intent_question);
  intentMap.set('Default Fallback Intent', core.fallback);

  agent.handleRequest(intentMap);
};