const functions = require('firebase-functions');
const app = require('actions-on-google').dialogflow({debug: false});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.intent('Default Fallback Intent', function(conv) {
    conv.ask("I'm fallback intent");
});

exports.webhook = functions.https.onRequest(app);