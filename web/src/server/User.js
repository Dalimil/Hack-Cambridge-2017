
const request = require("request");

function getGithubLangs(atoken, username) {
	return new Promise((resolve, reject) => {
		request(`https://api.github.com/users/${username}/repos?access_token=${atoken}`, function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200) {
                //const data = body.substring(0, 20);
				const repos = JSON.parse(body);
				const language=[]
				for (i in repos) {
					language.push(repos[i]['language']);
				}

				const unique = language
					.filter(function(item, i, ar) { return ar.indexOf(item) === i; })
					.filter(function(val) { return val !== null; });
                resolve(unique);
            } else {
                reject(response.statusCode);
            }
        });
	});
}

function getUserInfo(atoken) {
	return new Promise((resolve, reject) => {
		request(`https://api.github.com/user?access_token=${atoken}`, function(error, response, body) {
            // Callback function
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            } else {
                reject(response.statusCode);
            }
        });
	});
}

class User {
	constructor(github, linkedin, devpost, mentor) {
		this.github = github;
		this.linkedin = linkedin; // username
		this.devpost = devpost; 
		this.isMentor = mentor || false;
		this.isLookingForTeam = false;
		getUserInfo(github).then(userData => {
			this.ghUserData = userData;
			return userData.url.split("/").reverse()[0];
		})
		.then(username => getGithubLangs(github, username))
		.then(langs => {
			this.githubLangs = langs;
		});
	}
}

module.exports = User;
