/******* RUN SERVER FROM TRAVELERS.JS INSTEAD OF SERVER.JS (NODE TRAVELERS.JS)**/

//declare the actual model
var User = require('./server.js');
var bodyParser = require('body-parser')
User.app.use(bodyParser.json())
var jwt = require('express-jwt');
var cors = require('cors');
// var expressValidator = require('express-validator')
// var expressSession = require('express-session')
// var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy;

//for cross origin domain requests
User.app.use(cors());

var authCheck = jwt({
	//configuration object
	//user secret and client id from Auth0
	secret: new Buffer('Ozly-_S5AgepzqZlCAQeHXlRPe4aLK-sIcN29qjwwm5DU3wbxTNTcka51-vTJWJL'//,'base64'
		),
	audience: 'tnA7DokUxWcDTSG3Vn85494CkNhuUQCD'
})

User.app.get('/api/public', function(req,res){
	res.json({message: 'You don\'t need to be authenticated'})
})

//authCheck is middle ware that requires authorization headers to 
// allow content with secret and client id
User.app.get('/api/private', authCheck, function(req,res){
	res.json({message: 'You need to be authenticated'})
})
.on('error', function(err) {
    console.log('this is the error: ' + err)
  })

User.app.get('/travelers', function(req,res){
	console.log(req.query.user);
	User.User.find({userId: req.query.user}).then(function(user){
		console.log(user)
		res.json(user);
	})
})

User.app.post('/travelers', function (req, res, next) {
	var userId = req.body.userId;
	var flights = req.body.flights
  // var user = new User.User({
  //   email: req.body.email,
  //   password: req.body.password
  // })
  User.User.update({userId: userId},
	{$set: {flight: flights}}, function (err, post) {
    if (err) { return next(err) }
    	console.log(post)
    res.status(201).json(post)
  })
})

function remove(){

	User.User.remove({})
			.then(function(user){
				console.log(user)
			})
}

function create(){
	var newUser = new User.User({
			email: 'ryj1023',
			password: "password",
			userId: "auth0|58e6e10a54941844b507d32a",
			flight: null
		})
	newUser.save();
	console.log(newUser)
}

//remove();

//create();





