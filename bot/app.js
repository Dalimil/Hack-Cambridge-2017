const restify = require('restify');
const builder = require('botbuilder');
const fetch = require("./fetch");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const server = restify.createServer();
server.listen(8081, () => {
   console.log('Bot listening to http://localhost:8081/api/messages');
});

// Create chat bot
const connector = new builder.ChatConnector({
    appId: '5408f3dc-f9f0-473e-9447-88d8cdb48c92',
    appPassword: 'mJonOa2wY5Skjc1ycgymFjG'
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    fetch.getDevpost('Dalimil').then(data => {
        var user = JSON.parse(data);
        var out = "Name: " + user.name + "\n" +
            "Number of Projects: " + user.projects.length + "\n" +
            "Number of Hackathons: " + user.hackathons_count + "\n" +
            "Devpost URL: " + "https://devpost.com/dalimil";
        session.send(out);
    });
});

// TEST
fetch.getDevpost('Dalimil').then(data => {
    var user = JSON.parse(data);
    var out = "Name: " + user.name + "\n" +
        "Number of Projects: " + user.projects.length + "\n" +
        "Number of Hackathons: " + user.hackathons_count + "\n" +
        "Devpost URL: " + "https://devpost.com/dalimil";
    console.log(out);
});
