
class User {
	constructor(github, linkedin, devpost, mentor) {
		this.github = github;
		this.linkedin = linkedin; // username
		this.devpost = devpost; 
		this.isMentor = mentor || false;
		this.isLookingForTeam = false;
	}
}

module.exports = User;
