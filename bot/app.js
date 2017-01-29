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

function showProfile(session, username) {
    const preurl = 'https://cambotweb.localtunnel.me/uploads/';
    fetch.getUser(username).then(data => {
        //console.log("aaaaaaaaaaaaa", data)
        if (data.error) {
            session.send("No such user.");
            session.endDialog();
        } else {
            const hasTeam =  (data.lfteam == false)?"Yes":"No";
            const isMentor = (data.mentor == true)?"Yes":"No";
            console.log(data.mentor, "hm", isMentor, typeof data.mentor);
            console.log(data.lfteam, "hm", hasTeam, typeof data.lfteam);
            var msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .attachments([{
                        name: "",
                        contentType: "image/png",
                        contentUrl: preurl + data.devpostUrl
                    },
                    new builder.HeroCard(session)
                        .subtitle(`HasTeam: ${hasTeam}  |  Mentor: ${isMentor}  |  GitHub: <https://github.com/${data.github}|@${data.github}>  |  Devpost: <https://devpost.com/${data.devpost}|@${data.devpost}>`)
                        .text("Languages: " + data.langs.join(", "))
                        .images([
                            builder.CardImage.create(session, preurl + data.githubUrl)
                        ])
                ]);
            session.endDialog(msg);
        }
    }).catch(e => {
        session.send("No such user. [" + e + "]");
        session.endDialog();
    });
}

intents.matches(/my.*profile/i, function(session) {
    showProfile(session, session.message.user.name);
});

intents.matches(/who.*is .*@/i, [
    function (session) {
        const candidates = session.message.text.split(" ").filter(m => m.startsWith("@"));
        if (!candidates || candidates.length == 0) {
            session.send("Bad format - did you include the @ sign?");
        } else {
            const username = candidates[0].substr(1);
            console.log(username);
            showProfile(session, username);
        }
    }
]);

intents.matches(/team.*on/i, function(session) {
    fetch.switchTeamFlag(session.message.user.name, true).then(() => {
        session.send("Done. Your Looking-For-Team-Flag is now on.");
    });
});

intents.matches(/team.*off/i, function(session) {
    fetch.switchTeamFlag(session.message.user.name, false).then(() => {
        session.send("Done. Your Looking-For-Team-Flag is now off.");
    });
});


intents.matches(/who.*team/i, function(session) {
    fetch.getLfTeamPeople().then(usernames => {
        const msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .text("These people (" +usernames.users.length+ ") are looking for a team:\n\n" + usernames.users.map(u => `<@${u}|${u}>`).join(" "));
        session.endDialog(msg);
    })
});

intents.matches(/help/i, [
    function (session) {
        const msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .text(
            "<b>who is @username</b> - show user profile\n\n" +
            "<b>who team [filter]</b> - show people looking for a team (optionally filter by skill)\n\n" +
            "<b>who mentor [filter]</b> - show available mentors (optionally filter by skill)\n\n" +
            "<b>my profile</b> - show your profile\n\n" +
            "<b>team on/off</b> - switch your profile flag\n\n" +
            "<b>help</b> - show this help\n\n");
        session.endDialog(msg);
    }
]);

intents.onDefault([
    function (session) {
        if (!session.userData.initialized) {
            const msg = new builder.Message(session)
                .textFormat(builder.TextFormat.xml)
                .text(
                    "Hi... I'm a Hackathon Team Bot.\n\n"+
                    "I'm using the Microsoft Chatbot Platform so I simply work anywhere.\n\n"+
                    "Update your profile here: <https://cambotweb.localtunnel.me|My Profile>\n\n"+
                    "Type <strong>help</strong> to learn more..."
                );
            session.userData.initialized = true;
            session.endDialog(msg);
        } else {
            session.send("I didn't understand that.");
        }
    }
]);
