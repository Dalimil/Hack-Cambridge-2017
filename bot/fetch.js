
const request = require("request");

function getDevpost(username) {
    return new Promise((resolve, reject) => {
        request('https://iii3mdppm7.execute-api.us-east-1.amazonaws.com/prod/UserPortfolioEndpoint/' + username, function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200) {
                //const data = body.substring(0, 20);
                resolve(JSON.parse(body));
            } else {
                reject(response.statusCode);
            }
        });
    })
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        request('https://cambotweb.localtunnel.me/user-info/' + username, function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200 && body != null) {
                //const data = body.substring(0, 20);
                resolve(JSON.parse(body));
            } else {
                reject(response.statusCode);
            }
        });
    });
}

function getLfTeamPeople() {
    return new Promise((resolve, reject) => {
        request('https://cambotweb.localtunnel.me/lfteam-people/', function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200 && body != null) {
                //const data = body.substring(0, 20);
                resolve(JSON.parse(body));
            } else {
                reject(response.statusCode);
            }
        });
    });
}

function switchTeamFlag(username, flag) {
    return new Promise((resolve, reject) => {
        request.post(`https://cambotweb.localtunnel.me/lfteam/${username}/${(flag?"1":"0")}`, {}, function() {
            resolve("ok");
        });
    });
}

module.exports = {
    getDevpost,
    getUser,
    getLfTeamPeople,
    switchTeamFlag
};
