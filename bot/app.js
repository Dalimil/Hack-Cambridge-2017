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

function getDevpostInfo(user) {
    return (`
        Name: ${user.name}
        Hackathons attended: ${user.hackathons_count}
        Followers: ${user.followers_count}
        Devpost URL: https://devpost.com/${user.username}`
    );
}
function getAllInfo(userData) {
    return `Hello ${userData.username}!
        Devpost data: ${getDevpostInfo(userData.devpost)}`;
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
        const username = results.response;
        session.userData.username = username;
        fetch.getDevpost(username).then(data => {
            session.userData.devpost = data;
            session.userData.devpost.username = username;
            console.log("Finished /profile", results.response, data);
            session.endDialog();
        });
    }
]);

// TEST
fetch.getDevpost('Dalimil').then(data => {
    console.log(getDevpostInfo(data));
});
