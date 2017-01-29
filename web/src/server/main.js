"use strict";

const express = require('express');
const bodyParser = require('body-parser'); // additional body parsing
const morgan = require('morgan'); // General request logger
const Cookies = require('cookies'); // General cookie handling
const path = require('path');
const pp = s => path.join(__dirname, s);
const app = express();
const server = require('http').createServer(app); // or https
const config = require('./config');
const request = require('request');

// Pug template engine - previously Jade - http://jade-lang.com/
app.set('views', pp('../client/views')); // where templates are located
app.set('view engine', 'pug'); // Express loads the module internally

app.use(Cookies.express());

// Add top-level (could be made route-specific) parsers that will populate request.body
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

app.use(morgan('dev')); // Set up logger

app.get('/', function(req, res) {
	// Standard cookies
	req.cookies.set("my-cookie-key", "my-cookie-string-value");
	req.cookies.get("my-cookie-key");

	// res.json({ user: 'john' }); // Send json response
	// res.sendFile( __dirname + "/" + "index.html" );
	// Now render .pug template with any JSON locals/variables:
	res.render('index', 
		{ title: 'Demo', data: { name: "any json", items: [3, 5, 8] } } 
	); 
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/user', (req, res) => {
	res.render('index', { github: req.cookies.get("github-key")});
});

app.get('/github', (req, res) => {
	const code = req.query().replace("code=", "");
	request.post({
		url: 'https://github.com/login/oauth/access_token',
		form: {
			'client_id': '27e45b929055261d9d6b',
			'client_secret': '6eced93658843dc68958ce03f46551104b111613',
			'code': code
		},
		timeout: 10000,
		headers: {
			'User-Agent': 'request'
		}
	},
	function(err, response, body) {
		const auth = body.split("&").map(x => x.split("=")).find(x => x[0] == "access_token")[1];
		console.log(auth);
		req.cookies.set("github-key", auth);
		res.redirect('/user');
	});
});


/* User management */
const User = require("./User");
const users = [
	new User("a", "b", "c"),
	new User("d", "e", "f")
];

app.post('/save', (req, res) => {
	console.log(req.body);
	const devpost = req.body.devpost;
	const github = req.cookies.get("github-key");
	const linkedin = req.body.linkedin;
	console.log(devpost, github, linkedin);
	//users.push(new User("x", "y", "z"));
	res.send("ok");
});

/* API for CHATBOT */

app.get('/users', (req, res) => {
	res.json({ user: 'john' });
});

module.exports = {
	server: server,
	app: app
};
