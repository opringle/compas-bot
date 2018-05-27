authorize = require('./authorize');

module.exports.ask_to_execute_intent = function(agent, intent, question, response_no, response_yes, response_fallback){
    // Agent asks user if they would like to execute the intent
    // Sets context to intelligently handle responses
    // Clears any other contexts for the current dialog
    console.log(`Asking user if they want to execute functionality for intent '${intent}'`);

    agent.add(question); // ask the user if they want to execute the function
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
    agent.setContext(context); // store context parameters for use in next response
    // agent.clearContext() //ToDo: Get this working
}

module.exports.respond_to_execute_intent_question = function (agent, function_handler){
    // If user responded yes to execute intent question: clear context, execute intent & response_yes
    // If user responded no to execute intent question: clear context  & response_no
    // If the user doesn't did not match any intent: leave context & response_followup
    // eg check_context(agent, 'loggedin', loggin, 'Ok. I won't log you in then.', 'Great, you're logged in.', Sorry 'I didn't get. Would you like to log in?'.)
    
    const params = agent.getContext('answering_execute_intent')['parameters'];

    if (params != null && agent.intent == 'Answering Yes'){
        console.log(`User responded yes to intent execution: ${params['intent']}`);

        // let result = handler.get(params['intent'])(this);
        // let promise = Promise.resolve(result);
        // // retrieve the function ToDo: This is broken
        // const f = function_handler.get(params['intent']);
        // let f_promise = Promise.resolve(f);

        agent.setContext({ name: 'answering_yes_no_function', lifespan: 0}); // Clear the context
        agent.add(params['response_yes']); // let the user know you are about to call the function
        agent.handleRequest(authorize.log_in); // call the function
    }
    else {
        console.log(`User responded no to intent execution: ${params['intent']}`);
        agent.setContext({ name: 'answering_yes_no_function', lifespan: 0 }); // Clear the context
        agent.add(params['response_no']); //respond
    }
}

module.exports.fallback = function(agent){
    console.log(`User did not match an intent with high confidence`);
    // Checks the context
    // Fails gracefully by extracting contexts
    agent.add(`I'm sorry I don't understand.`);
}
