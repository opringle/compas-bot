// Dialogflow Node.js fulfillment getting started guide:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs#quick-start

'use strict';

// Load webhookclient class from Dialogflow fullfillment modules:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs/blob/master/docs/WebhookClient.md
// Load Card and Suggestion class:
// https://github.com/dialogflow/dialogflow-fulfillment-nodejs/blob/master/docs/Card.md
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const compass_api = require('./compass_modules/compass_api');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.CompasCard = (request, response) => {

  // Create a webhookclient class
  const agent = new WebhookClient({ request, response });

  // Log the incoming request from Dialogflow
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  // Call CompasCard's API to load funds for the user
  function load_value(agent) {

    // Get the amount and card we wish to load funds to from the previous context
    const parameters = agent.getContext('confirm_add_funds')['parameters'];
    const amount = parameters['amount'];
    const card = parameters['card'];

    // Call Translink API to execute the transaction

    // Reply to the user
    agent.add(amount + ` CAD has been added to card "` + card + `".`);
  }

  function log_in(agent) {

    // Reply to the user
    agent.add(`Welcome! You have been successfully logged in!`);

    // Call CompasCard's API to log in the user and retrieve required information for the conversation
    const user_info = compass.login("ojapringle@gmail.com", "myfakepassword");

    // Retrive the user card names as lowercase
    const cards = user_info['cards'];

    // Upload them to the Dialogflow 'cards' entity
    var options = {
      host: url,
      port: 80,
      path: '/resource?id=foo&bar=baz',
      method: 'POST'
    };

    http.request(options, function (res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    }).end();
  }


  // function welcome(agent) {
  //   agent.add(`Welcome to my agent!`);
  // }

  // function load_existing_cards(agent) {
  //   // Retrieve users card names from compas API and load them into Dialogflow user entity

  //   // Get the users cards from compas API
  //   const cards = ['oliver', 'steven'];

  //   // Upload them to the user entity in Dialogflow
    

  //   // Reply with this message
  //   agent.add(amount + ` CAD has been added to card "` + card + `".`);
  //   // agent.add(new Card({
  //   //     title: `Title: this is a card title`,
  //   //     imageUrl: 'https://dialogflow.com/images/api_home_laptop.svg',
  //   //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //   //     buttonText: 'This is a button',
  //   //     buttonUrl: 'https://docs.dialogflow.com/'
  //   //   })
  //   // );
  //   //   agent.add(new Suggestion(`Quick Reply`));
  //   //   agent.add(new Suggestion(`Suggestion`));
  //   //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }

  // Run the proper function handler based on the Dialogflow itnent name
  let intentMap = new Map();
  // actionMap.set('Default Welcome Intent', welcome);
  // actionMap.set('Default Fallback Intent', fallback);
  intentMap.set('Load Stored Value - yes', load_value);
  intentMap.set('Log User In', log_in);
  //actionMap.set('Load Stored Value - yes', load_value);
  // actionMap.set('check_card', check_cards);
  // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
  agent.handleRequest(intentMap);
};