// creating our server
const http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// mock database that will hold our log-in information
const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

// create a get method route that will send our HTML file to the browser
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

// create an Express POST route to '/login' that will handle forms submitted to html login form. 
// set username and password values to scoped variables within our post callback function
app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
//  username and password used to create a SQL query to check their validity
    var query = "SELECT title FROM user where username = '" + password + "'";

// console logs to see SQL injection working
    console.log("username: " + username);
    console.log("password: " + password);
    console.log('query: ' + query);

// run sqlite method to verify login and to handle errors of invalid login
	db.get(query, function (err, row) {

		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
		}
	});

});

app.listen(3000);