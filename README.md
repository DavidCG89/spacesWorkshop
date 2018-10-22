# spacesWorkshop
Fulfillment for dialogflow spaces

## Instructions

### Local
1. *npm install* To install all the dependencies.
2. *node index.js* To run the server.
3. *ngrok http 3005*  If the port of index.js change you should also change this port.

### Web
4. In *DialogFlow*, in the fulfillment tab, fill the webhook slot with the ngrok https link that was generated in the previous step.

5. Test it in the Actions on Google console. https://console.actions.google.com