const compass_api = require('../compass_modules/compass_api');

module.exports.log_in = function (agent) {
    console.log(`User requested to log in`);

    // Call CompasCard's API to log in the user and retrieve required information for the conversation
    const user_info = compass_api.login();

    // Retrive user information for the rest of the conversation
    const cards = user_info['Cards'];
    const name = user_info['Contact information']['Name'];

    // Update user context to logged in for 30 minutes and add user parameters
    const context = { 'name': 'loggedin', 'lifespan': 30, 'parameters': { 'user_cards': cards, 'name': name } };
    agent.setContext(context);

    // Add the response
    // let conv = agent.conv();
    // conv.ask(`Hi ${name}. Looks like you are successfully logged in!`);
    // agent.add(conv);
    agent.add(`Hi ${name}. Looks like you are successfully logged in!`);
}

module.exports.ask_to_execute_intent = function(agent, intent, question, response_no, response_yes, response_fallback){
    // Agent asks user if they would like to execute the intent
    // Sets context to intelligently handle responses
    // Clears any other contexts for the current dialog
    console.log(`Asking user if they want to execute functionality for intent '${intent}'`);

    // ask the user if they want to execute the function
    // let conv = agent.conv();
    // conv.ask(question);
    // agent.add(conv);
    agent.add(question);

    // store context parameters for use in next response
    const context = { 
        'name': 'answering_execute_intent', 
        'lifespan': 1, 
        'parameters': {
            'intent': `${intent}`, 
            'response_no': response_no, 
            'response_yes': response_yes,
            'response_fallback': response_fallback
        }
    };
    agent.setContext(context);
    // agent.clearContext() //ToDo: Get this working
}

module.exports.respond_to_execute_intent_question = function (agent, function_handler){
    // If user responded yes to execute intent question: clear context, execute intent & response_yes
    // If user responded no to execute intent question: clear context  & response_no
    // If the user doesn't did not match any intent: leave context & response_followup
    // eg check_context(agent, 'loggedin', loggin, 'Ok. I won't log you in then.', 'Great, you're logged in.', Sorry 'I didn't get. Would you like to log in?'.)
    
    const context = agent.getContext('answering_execute_intent');

    if (context != null && agent.intent == 'Answering Yes'){
        params = context['parameters'];
        console.log(`User responded yes to intent execution: ${params['intent']}`);

        // let the user know you are about to call the function
        // let conv = agent.conv();
        // conv.ask(params['response_yes']);
        // agent.add(conv);
        agent.add(params['response_yes']);

        agent.setContext({ name: 'answering_execute_intent', lifespan: -1 }); // Clear the context
        agent.intent = 'Log User In';
        agent.handleRequest(function_handler); // Call the user intention
        
    }
    else if (context != null && agent.intent == 'Answering No') {
        params = context['parameters'];
        console.log(`User responded no to intent execution: ${params['intent']}`);

        // Let the user know you will not call the function
        // let conv = agent.conv();
        // conv.ask(params['response_no']);
        // agent.add(conv);
        agent.add(params['response_no']);

        agent.setContext({ name: 'answering_execute_intent', lifespan: -1 }); // Clear the context

    }
}

module.exports.fallback = function(agent, fallback_response){
    // If user is responding to a yes no question, retrieve the context
    const context = agent.getContext('answering_execute_intent');

    if (context != null) {
        params = context['parameters'];
        console.log(`Low confidence from nlp during context 'answering_execute_intent'`);

        // Contextually respond to the user
        // let conv = agent.conv();
        // conv.ask(params['response_fallback']);
        // agent.add(conv);
        agent.add(params['response_fallback']);

        // Clear the context
        agent.setContext({ name: 'answering_execute_intent', lifespan: -1 }); // Clear the context
    }
    // Otherwise fail normally
    else {

        console.log(`Low confidence from nlp`);
        // let conv = agent.conv();
        // conv.ask(fallback_response); // Ask the question on google assistant
        // agent.add(conv); // Add response to dialogflow object
        agent.add(fallback_response);
    }
}
