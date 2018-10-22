# spacesWorkshop
Fulfillment for dialogflow spaces

## Instructions

### Local
1. **_npm install_** To install all the dependencies.
2. **_node index.js_** To run the server.
3. **_ngrok http 3005_**  If the port of index.js change you should also change this port.

### Web
4. In **_DialogFlow_**, in the fulfillment tab, fill the webhook slot with the ngrok https link that was generated in the previous step.

5. Test it in the Actions on Google console. https://console.actions.google.com