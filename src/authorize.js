const compass_api = require('../compass_modules/compass_api')

module.exports.log_in = function(agent) {
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
    agent.add(`Hi ${name}. Looks like you are successfully logged in!`);
}