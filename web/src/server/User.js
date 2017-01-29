
const request = require("request");
const path = require('path');
const pp = s => path.join(__dirname, "../client/public/uploads/" + s);

function getGithubLangs(atoken, username) {
	return new Promise((resolve, reject) => {
		request({ url: `https://api.github.com/users/${username}/repos?access_token=${atoken}`,headers: {
			'User-Agent': 'request'
		}}, function(error, response, body) {
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
				console.log("rejected githubLangs");
                reject(response.statusCode);
            }
        });
	});
}

function getUserInfo(atoken) {
	console.log(`https://api.github.com/user?access_token=${atoken}`);
	return new Promise((resolve, reject) => {
		request({ url: `https://api.github.com/user?access_token=${atoken}`, headers: {
			'User-Agent': 'request'
		}}, function(error, response, body) {
            // Callback function
			console.log(body);
            if (!error) {
                resolve(JSON.parse(body));
            } else {
				console.log("rejected userinfo", error);
                reject(response.statusCode);
            }
        });
	});
}

var webshot = require('webshot');

var options = {
	windowSize: {
		width: '1024',
		height: '840'
	},

	shotSize: {
		width: 'all',
		height: 'window'
	},

	shotOffset: {
		left: 0,
		right: 0,
		top: 80,
		bottom: 0
	}
};

var options2 = {
	windowSize: {
		width: '1024',
		height: '950'
	},

	shotSize: {
		width: 'all',
		height: 'window'
	},

	shotOffset: {
		left: 0,
		right: 0,
		top: 150,
		bottom: 0
	}
};

class User {
	constructor(github, linkedin, devpost, mentor) {
		this.github = github;
		this.linkedin = linkedin; // username
		this.devpost = devpost; 
		this.isMentor = mentor || false;
		this.isLookingForTeam = false;
		getUserInfo(github).then(userData => {
			this.ghUserData = userData;
			this.ghUsername = userData.url.split("/").reverse()[0];
			console.log(this.ghUsername);
			return this.ghUsername;
		})
		.then(username => getGithubLangs(github, username))
		.then(langs => {
			console.log(langs);
			this.githubLangs = langs;
		}).then(() => {
			console.log(this.ghUsername);
			if (this.ghUsername) {
				const url = pp(this.ghUsername + '-github.png');
				webshot('github.com/' + this.ghUsername, url, options, function(err) {
					// screenshot now saved
				});
				this.ghUrl = this.ghUsername + '-github.png';
			}
		}).catch(e =>{
			console.log(e);
		});

		if (this.devpost) {
			const url = pp(this.devpost + '-devpost.png');
			console.log(url);
			webshot('devpost.com/' + this.devpost, url, options2, function(err) {
				// screenshot now saved
			});
			this.devpostUrl = this.devpost + '-devpost.png';
		}
	}

	toJSON() {
		return JSON.stringify({
			linkedin: this.linkedin,
			devpost: this.devpost,
			mentor: this.isMentor,
			lfteam: this.isLookingForTeam,
			github: this.ghUsername,
			langs: this.githubLangs,
			githubUrl: this.ghUrl,
			devpostUrl: this.devpostUrl
		});
	}
}

module.exports = User;
