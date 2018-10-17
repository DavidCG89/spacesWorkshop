const express = require('express');
const bodyParser = require('body-parser');
const {WebhookClient, Suggestion} = require('dialogflow-fulfillment');

const app = express();

app.use(bodyParser.json());

app.post('/', async function (request, response) {
    const agent = new WebhookClient({ request, response });
    agent.data.myVariable = 2;
    async function fallback (agent) {
        agent.add("This is the fallback message");
    }
    async function welcome (agent) {
        agent.add("This is the welcome message");
    }
    let intentMap = new Map();
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Default Welcome Intent', welcome);
    agent.handleRequest(intentMap);
});

const port = process.env.PORT || 8764; 
app.listen(port, function () {
    console.log(`App listening in port ${port}`); 
  });