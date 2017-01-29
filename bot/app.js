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

intents.matches(/who.*is/i, [
    function (session) {
        const username = session.message.user.name;
        const preurl = 'https://cambotweb.localtunnel.me/uploads/';
        fetch.getUser(username).then(data => {
            console.log(data);
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachments([{
                        name: "",
                        contentType: "image/png",
                        contentUrl: preurl + data.devpostUrl
                    },
                    new builder.HeroCard(session)
                        .subtitle(`Mentor: ${data.mentor}  |  LFTeam: ${data.lfteam}  |  GitHub: <https://github.com/${data.github}|@${data.github}>  |  Devpost: <https://devpost.com/${data.devpost}|@${data.devpost}>`)
                        .text("Languages: " + data.langs.join(", "))
                        .images([
                            builder.CardImage.create(session, preurl + data.githubUrl)
                        ])
                ]);
            session.endDialog(msg);
        }).catch(e => {
            session.send("No such user." + e);
            session.endDialog();
        });
    }
]);

intents.matches(/help/i, [
    function (session) {
        session.send("todo help");
    }
]);

intents.onDefault([
    function (session, args, next) {
        // console.log(session);
        if (!session.userData.username) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(
            "Hi... I'm a Hackathon Team Bot.\n\n"+
            "I'm using the Microsoft Chatbot Platform so I simply work anywhere.\n\n"+
            "Update your profile here: <https://cambotweb.localtunnel.me|My Profile>\n\n"+
            "Type <b>help</b> to learn more..."
        );
    }
]);


bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! Are you looking for a team?');
    },
    function (session, results) {
        const info = results.response;
        session.userData.username = info;
        console.log("Finished /profile", results.response, data);
        session.endDialog();
    }
]);


