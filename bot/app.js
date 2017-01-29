const restify = require('restify');
const builder = require('botbuilder');
const fetch = require("./fetch");

const webServer = require("../web/app");
webServer.run();

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

intents.matches(/who.*is/i, [
    function (session) {
        builder.Prompts.text(session, 'Who?');
    },
    function (session, results) {
        const username = results.response;
        session.send('ok' + username);
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
        // Send a greeting and start the menu.
        const preurl = 'https://cambotweb.localtunnel.me/uploads/';
        fetch.getUser('my-username').then(data => {
            console.log(data);
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachments([
                    new builder.HeroCard(session)
                        .images([
                            builder.CardImage.create(session, preurl + data.devpostUrl)
                        ]),
                    new builder.HeroCard(session)
                        .subtitle(`Mentor: ${data.mentor}  |  LFTeam: ${data.lfteam}  |  GitHub: <https://github.com/${data.github}|@${data.github}>  |  Devpost: <https://devpost.com/${data.devpost}|@${data.devpost}>`)
                        .text("Languages: " + data.langs.join(", "))
                        .images([
                            builder.CardImage.create(session, preurl + data.githubUrl)
                        ])
                ]);
            session.endDialog(msg);
        });
        //session.send(getAllInfo(session.userData));
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


//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});
