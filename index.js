const express = require('express');
const bodyParser = require('body-parser');
const {WebhookClient} = require('dialogflow-fulfillment');
const {SimpleResponse, Permission, Suggestions, BasicCard, Image, Carousel} = require('actions-on-google');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.post('/', async function (request, response) {
    const agent = new WebhookClient({ request, response });

    async function fallback (agent) {
        const conv = agent.conv();
        conv.ask(new SimpleResponse({
            speech: "I missed what you said. I can help you make a booking at spaces if you tell me about your next meeting.",
            text: "I missed what you said. I can help you make a booking at spaces if you tell me about your next meeting.",
          }));
        agent.add(conv);
    }

    async function welcome (agent) {
        let conv = agent.conv();
        if ( conv.user.storage.permissions === undefined ) {
            const options = {
                permissions: ['NAME'],
                context: "Hi! I'm Spacy! Would you like me to call you by your name?"
              };
              conv.ask(new Permission(options));
        }
        else {
            if (conv.user.storage.permissions === true) {
                conv.ask(new SimpleResponse({
                    speech: `Hi ${conv.user.storage.name}! What do you need today?`,
                    text: `Hi ${conv.user.storage.name}! What do you need today?`,
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?`,
                    text: `Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?`,
                }));
            } 
            conv.ask(new BasicCard({
                image: new Image({
                    url: 'https://spaces.kollekt.fm/img/Facebook-Logo_Spaces-1200x630--1200x630.png',
                    alt: 'Welcome to Spaces',
                }),
                display: 'CROPPED',
            }));  
        }
        conv.ask(new Suggestions(['Book a room']));
        agent.add(conv);
    }

    async function getName (agent) {
        let conv = agent.conv();
        if (conv.user.name.given != undefined) {
            conv.user.storage.permissions = true;
            conv.user.storage.name = conv.user.name.given;
            conv.ask(new SimpleResponse({
                speech: `Ok ${conv.user.storage.name}! So do you need to book a room?`,
                    text: `Ok ${conv.user.storage.name}! So do you need to book a room?`,
            }));
        } else {
            conv.user.storage.permissions = false;
            conv.ask(new SimpleResponse({
                speech: `Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?`,
                    text: `Hello! My name is Stacy, I'm your virtual assistant at SPACES. I can help you book a meeting room. What do you need?`,
            }));
        }
        conv.ask(new Suggestions(['Book a room']));
        agent.add(conv);
    }

    async function booking (agent) {
        const conv = agent.conv();
        if (conv.parameters) {
            if(!conv.parameters.date) {
                conv.ask(new SimpleResponse({
                    speech: 'When will the meeting happen?',
                    text: 'When will the meeting happen?',
                  }));
                conv.ask(new Suggestions(['Tomorrow']));
            }
            else if(!conv.parameters.time) {
                conv.ask(new SimpleResponse({
                    speech: 'At what time?',
                    text: 'At what time?',
                  }));
                conv.ask(new Suggestions(['At 5 pm']));
            }
            else if(!conv.parameters.City) {
                conv.ask(new SimpleResponse({
                    speech: 'In what City?',
                    text: 'In what City?',
                  }));
                conv.ask(new Suggestions(['Madrid', 'Barcelona']));
            }
            else if(!conv.parameters.Space && !conv.arguments.parsed.input.OPTION) {
                const data = fs.readFileSync("./spaces.json");
                let options = [];
                dataJson = JSON.parse(data);
                dataJson.cities.forEach(city => {
                    if (city.name === conv.parameters.City) {
                        city.spaces.forEach(space => {
                            const basicCard = {"optionInfo": {
                                "key": space.roomName
                            },
                            "title": space.roomName,
                            "description": space.description,
                            "image": {
                                "url": space.img,
                                "accessibilityText": space.accText
                            }}
                            options.push(basicCard);
                        })
                    }
                });
                //console.log(options);
                let response = new Carousel({items: options});
                conv.ask(new SimpleResponse({
                    speech: 'Ok, which of these Rooms do you want to book?',
                    text: 'Ok, which of these Rooms do you want to book?',
                  }));
                conv.ask(response);
            } else {
                const date = conv.parameters.date.split('T')[0];
                const time = conv.parameters.time.split('T')[1].split('+')[0];
                const city = conv.parameters.City;
                const space = conv.parameters.Space || conv.arguments.parsed.input.OPTION;
                conv.ask(new SimpleResponse({
                    speech: `Perfect! I have booked the Room ${space} in ${city} on ${date} at ${time}`,
                    text: `Perfect! I have booked the Room ${space} in ${city} on ${date} at ${time}`,
                }));
                conv.parameters = {};
            }
            agent.add(conv);
        } else {
            agent.add(conv.ask(new SimpleResponse({
                speech: 'You should not get in here...',
                text: 'You should not get in here...',
              })))
        }
        
    }

    let intentMap = new Map();
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Get Name', getName);
    intentMap.set('Booking', booking);
    agent.handleRequest(intentMap);
});

const port = process.env.PORT || 3005; 
app.listen(port, function () {
    console.log(`App listening in port ${port}`); 
});