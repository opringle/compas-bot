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
const compass_api = require('./compass_modules/compass_api');
var FuzzyMatching = require('fuzzy-matching');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.CompasCard = (request, response) => {

  // Create a webhookclient class
  const agent = new WebhookClient({ request, response });

  // Log the incoming request from Dialogflow
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  const allowed_top_up = [5, 10, 20, 40, 50, 100] // users can only top up these values

  // Call CompasCard's API to load funds for the user
  function load_value(agent) {
    console.log(`User requested to load stored value to their compass card`);

    // Get the amount and card we wish to load funds to from the previous context
    const parameters = agent.getContext('loadstoredvalue-followup')['parameters'];
    const amount = parameters['amount'];
    const card = parameters['Compasscard'];

    // Call Translink API to execute the transaction

    // Reply to the user
    agent.clearContext('loadstoredvalue-followup');
    agent.add(amount + ` CAD has been added to card "` + card + `".`);
  }

  function log_in(agent) {
    console.log(`User requested to log in`);

    // Call CompasCard's API to log in the user and retrieve required information for the conversation
    const user_info = compass_api.login();

    // Retrive user information for the rest of the conversation
    const cards = []// user_info['Cards'];
    const name = user_info['Contact information']['Name'];

    // Update user context to logged in for 30 minutes and add user parameters
    const context = { 'name': 'loggedin', 'lifespan': 30, 'parameters': {'user_cards': cards, 'name': name} };
    agent.setContext(context);

    // Add the response
    agent.add(`Hi ${name}. Looks like you are successfully logged in!`);
  }

  function check_card(agent) {
    console.log(`Checking card and amounts for loading stored value`);

    // Retreive parameters from the loggin context
    const parameters = agent.getContext('loggedin')['parameters'];
    const userCards = parameters['user_cards'];
    const extractedCard = parameters['Compasscard'];
    const extractedAmount = parameters['amount'];

    // If no amount was extracted go back to dailogflow
    if (extractedAmount === ''){
      agent.add(`Of course. Please specify an amount.`);
      agent.setContext('load_stored_value_dialog_context');  //We are on this intent
      agent.setContext('load_stored_value_dialog_params_amount');  //We are still looking for an amount
    }

    // If amount extracted was not an allowed value, go back to dialogflow for another value
    else if (allowed_top_up.indexOf(Math.floor(extractedAmount)) === -1){
      agent.add(`You can only top up values: ${allowed_top_up}. How much would you like to add?`);
      agent.setContext('load_stored_value_dialog_context');  //We are on this intent
      agent.setContext('load_stored_value_dialog_params_amount');  //We are still looking for an amount
    }

    // If the user has no cards, fail gracefully
    else if (userCards.length === 0){
      // agent.clearOutgoingContexts(); //doesn't work
      // agent.setContext('loggedin'); 
      // Set `temperature` context lifetime to zero
      // to reset the conversational state and parameters
      agent.setContext({ name: 'load_stored_value_dialog_context', lifespan: 0 });
      agent.add(`I'm sorry ${parameters['name']}. I wasn't able to find a Compass card on your account :(`);
    }

    // If the user has one card, assume that is the one they want to load!
    else if (userCards.length === 1){
      const matchedCard = userCards[0]
      agent.add(`Are you sure you want to add ${extractedAmount} CAD to card '${matchedCard}'`);
      const context = { 'name': 'loadstoredvalue-followup', 'parameters': { 'Compasscard': matchedCard, 'amount': extractedAmount } };
      agent.setContext(context);
    }

    // If the user has many cards
    else{

      // If not card was extracted, prompt the user to enter it again
      if(extractedCard === ''){
        agent.add(`Please choose from one of the cards on your account: ` + userCards);
        agent.setContext('load_stored_value_dialog_context');  //We are on this intent
        agent.setContext('load_stored_value_dialog_params_compasscard');  //We are still looking for a card
      }
      
      // Attempt to fuzzy match the extracted card with one of the cards on their account
      else{
        var fm = new FuzzyMatching(userCards);
        const matchedCard = fm.get(extractedCard)['value']  //retrieve closest card to extracted value

        // If not value was close enough
        if (matchedCard === null){
          agent.add(`I can't find a card named ${extractedCard} on your account. Please choose from cards: ` + userCards);
          agent.setContext('load_stored_value_dialog_context');  //We are on this intent
          agent.setContext('load_stored_value_dialog_params_compasscard');  //We are still looking for a card
        }
        // Otherwise return the match
        else{
        agent.add(`Are you sure you want to add ${extractedAmount} CAD to card ${matchedCard}?`);
        const context = { 'name': 'loadstoredvalue-followup', 'parameters': { 'Compasscard': matchedCard, 'amount': extractedAmount } };
        agent.setContext(context);
        }
      }
    }
  }
    
  let intentMap = new Map();
  intentMap.set('Load Stored Value', check_card);
  intentMap.set('Load Stored Value - yes', load_value);
  intentMap.set('Log User In', log_in);
  agent.handleRequest(intentMap);
};