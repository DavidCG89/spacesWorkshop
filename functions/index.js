const functions = require('firebase-functions');
const {BasicCard, Button, Carousel, BImage, SimpleResponse, dialogflow} = require('actions-on-google');
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
    if(!conv.parameters.date) {
        conv.ask(new SimpleResponse({
            speech: 'When do you want to book the room?',
            text: 'When do you want to book the room?',
          }));
    }
    else if(!conv.parameters.time) {
        conv.ask(new SimpleResponse({
            speech: 'At what time?',
            text: 'At what time?',
          }));
    }
    else if(!conv.parameters.City) {
        conv.ask(new SimpleResponse({
            speech: 'In what City?',
            text: 'In what City?',
          }));
    }
    else if(!conv.parameters.Space) {
        const data = fs.readFileSync("./spaces.json");
        let options = [];
        dataJson = JSON.parse(data);
        dataJson.cities.forEach(city => {
            if (city.name === conv.parameters.City) {
                city.spaces.forEach(space => {
                    const basicCard = {"optionInfo": {
                        "key": space
                    },
                    "title": space,
                    "description": space,
                    "image": {
                        "url": "https://spaces.kollekt.fm/img/Facebook-Logo_Spaces-1200x630--1200x630.png",
                        "accessibilityText": "Math & prime numbers"
                    }}
                    options.push(basicCard);
                })
            }
        });
        //console.log(options);
        console.log("Salimos del foreach");
        let response = new Carousel({items: options});
        conv.ask(new SimpleResponse({
            speech: 'Ok, which of these Rooms do you want to book?',
            text: 'Ok, which of these Rooms do you want to book?',
          }));
        conv.ask(response);
    } else {
        conv.ask(new SimpleResponse({
            speech: 'Ok! We have your room booked!',
            text: 'Ok! We have your room booked!',
          }))
    }

})

exports.webhook = functions.https.onRequest(app);