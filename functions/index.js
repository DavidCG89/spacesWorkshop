const functions = require('firebase-functions');
const {BasicCard, Button, Carousel, Image, SimpleResponse, dialogflow} = require('actions-on-google');
const fs = require('fs');

const app = dialogflow({debug: false});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.intent('Default Fallback Intent', function(conv) {
    console.log(conv);
    conv.ask(new SimpleResponse({
        speech: "I missed what you said. I can help you make a booking at spaces if you tell me about your next meeting.",
        text: "I missed what you said. I can help you make a booking at spaces if you tell me about your next meeting.",
      }));
});

app.intent('Default Welcome Intent', function(conv) {
    conv.ask(new SimpleResponse({
        speech: "Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?",
        text: "Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?",
      }));
    conv.ask(new BasicCard({
        image: new Image({
          url: 'https://spaces.kollekt.fm/img/Facebook-Logo_Spaces-1200x630--1200x630.png',
          alt: 'Welcome to Spaces',
        }),
        display: 'CROPPED',
      }));
});

app.intent('Booking', function(conv) {
    console.log(conv.parameters);
    if(!conv.parameters.date) {
        console.log("Estamos en preguntar date");
        conv.ask(new SimpleResponse({
            speech: 'When do you want to book the room?',
            text: 'When do you want to book the room?',
          }));
    }
    else if(!conv.parameters.time) {
        console.log("Estamos en preguntar time");
        conv.ask(new SimpleResponse({
            speech: 'At what time?',
            text: 'At what time?',
          }));
    }
    else if(!conv.parameters.Space) {
        conv.ask(new SimpleResponse({
            speech: "I need to know in which space. Rio, Atocha or Castellana?",
            text: "I need to know in which space. Rio, Atocha or Castellana?",
          }));
    }
    else {
        console.log("Estamos al final");
        const space = conv.parameters.Space;
        const date = conv.parameters.date;
        const response = "I have a room ready for you in the space " +space+ " on " + date;

        conv.ask(new SimpleResponse({
            speech: response,
            text: response,
          }));
    }

})

exports.webhook = functions.https.onRequest(app);