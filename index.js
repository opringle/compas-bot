'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const FuzzyMatching = require('fuzzy-matching');
const login = require('./src/login');
const stored_value = require('./src/stored_value');

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

  agent.handleRequest(intentMap);
};