core = require('./core');
authorize = require('./authorize');

module.exports.load_value = function(agent) {
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

module.exports.check_card = function(agent, allowed_top_up) {
    console.log(`Checking card and amounts for loading stored value`);

    // If the user is not logged in, prompt them to
    const logged_in = agent.getContext('loggedin');
    if (logged_in == null){
        core.ask_to_execute_intent(
            agent,
            'Log User In',
            `You need to be logged in to use this feature. Would you like to login?`,
            `Ok no worries.`,
            `Great. Let's get you logged  in....`,
            `I dont follow. Would you like to log in?`
        )
    }
    // Otherwise proceed with the intent
    else{
        // Retreive parameters from the loggin context
        const parameters = agent.getContext('loggedin')['parameters'];
        const userCards = parameters['user_cards'];
        const extractedCard = parameters['Compasscard'];
        const extractedAmount = parameters['amount'];

        // If no amount was extracted go back to dailogflow
        if (extractedAmount === '') {
            agent.add(`Of course. Please specify an amount.`);
            agent.setContext('load_stored_value_dialog_context');  //We are on this intent
            agent.setContext('load_stored_value_dialog_params_amount');  //We are still looking for an amount
        }

        // If amount extracted was not an allowed value, go back to dialogflow for another value
        else if (allowed_top_up.indexOf(Math.floor(extractedAmount)) === -1) {
            agent.add(`You can only top up values: ${allowed_top_up}. How much would you like to add?`);
            agent.setContext('load_stored_value_dialog_context');  //We are on this intent
            agent.setContext('load_stored_value_dialog_params_amount');  //We are still looking for an amount
        }

        // If the user has no cards, fail gracefully
        else if (userCards.length === 0) {
            agent.add(`I'm sorry ${parameters['name']}. I wasn't able to find a Compass card on your account.`);
            // Set dialog context lifetime to zero
            agent.setContext({ name: 'load_stored_value_dialog_context', lifespan: 0 });
        }

        // If the user has one card, assume that is the one they want to load!
        else if (userCards.length === 1) {
            const matchedCard = userCards[0]
            agent.add(`Are you sure you want to add ${extractedAmount} CAD to card '${matchedCard}'`);
            const context = { 'name': 'loadstoredvalue-followup', 'parameters': { 'Compasscard': matchedCard, 'amount': extractedAmount } };
            agent.setContext(context);
        }

        // If the user has many cards
        else {

            // If not card was extracted, prompt the user to enter it again
            if (extractedCard === '') {
                agent.add(`Please choose from one of the cards on your account: ` + userCards);
                agent.setContext('load_stored_value_dialog_context');  //We are on this intent
                agent.setContext('load_stored_value_dialog_params_compasscard');  //We are still looking for a card
            }

            // Attempt to fuzzy match the extracted card with one of the cards on their account
            else {
                var fm = new FuzzyMatching(userCards);
                const matchedCard = fm.get(extractedCard)['value']  //retrieve closest card to extracted value

                // If not value was close enough
                if (matchedCard === null) {
                    agent.add(`I can't find a card named ${extractedCard} on your account. Please choose from cards: ` + userCards);
                    agent.setContext('load_stored_value_dialog_context');  //We are on this intent
                    agent.setContext('load_stored_value_dialog_params_compasscard');  //We are still looking for a card
                }
                // Otherwise return the match
                else {
                    agent.add(`Are you sure you want to add ${extractedAmount} CAD to card ${matchedCard}?`);
                    const context = { 'name': 'loadstoredvalue-followup', 'parameters': { 'Compasscard': matchedCard, 'amount': extractedAmount } };
                    agent.setContext(context);
                }
            }
        }
    }
}
