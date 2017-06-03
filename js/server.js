var express = require('express')
var app = express();
var path = require('path');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

app.listen(process.env.PORT || 8080);
console.log('server is running');

var dir = path.join(__dirname, '../')

app.use(express.static(dir));

console.log(dir)

mongoose.connect('mongodb://localhost/travelers');
	//once mongoose emits open, run function (must use open keyword)
	mongoose.connection
	.once('open', function(){
		console.log('Good to go')
	})
	.on('error', function(error){
		console.warn("Warning", error)
	})

var TravelerSchema = new Schema({
	email: {
		type: String,
		//requiring that the name be a string with validation
		required: [true, 'email is required.']
		},
	password: String,
	userId: String,
	flight: [] 
})

//declare the actual model
var User = mongoose.model('user', TravelerSchema);

//export to be used in other files
exports.app = app;
exports.User = User;


