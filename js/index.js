let angular = require('angular');
let $ = require('jquery');

let app = angular.module('myApp', ['ngAnimate']);

app.controller('ctrl', function(){
  
 	this.heading = "The World Is Yours";
 	this.subheading = "Where would you like to go?";
 	this.footer = "Check out some of the best locations based on your interests"
 
});

