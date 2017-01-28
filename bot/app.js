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

const intents = new builder.IntentDialog();
bot.dialog('/', intents);

function getAllInfo(userData) {
    var user = userData.devpost;
    var out = "Name: " + user.name + "\n" +
        "Number of Projects: " + user.projects.length + "\n" +
        "Number of Hackathons: " + user.hackathons_count + "\n" +
        "Devpost URL: " + "https://devpost.com/dalimil";
    return `Hello ${userData.username}!
        Devpost data: ${out}`;
}

intents.matches(/change.* username/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send(`Ok. Changed your username to ${session.userData.username},
        Debug: ${getAllInfo(session.userData)}`);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.username) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(getAllInfo(session.userData));
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your username?');
    },
    function (session, results) {
        session.userData.username = results.response;
        fetch.getDevpost(session.userData.username).then(data => {
            session.userData.devpost = data;
            console.log("Finished /profile", results.response, data);
            session.endDialog();
        });
    }
]);

// TEST
fetch.getDevpost('Dalimil').then(data => {
    var user = JSON.parse(data);
    var out = "Name: " + user.name + "\n" +
        "Number of Projects: " + user.projects.length + "\n" +
        "Number of Hackathons: " + user.hackathons_count + "\n" +
        "Devpost URL: " + "https://devpost.com/dalimil";
    console.log(out);
});
