//dependencies

let angular = require('angular');
let $ = require('jquery');
let ngAnimate = require('angular-animate');
let ngRoute = require('angular-route');


let app = angular.module('myApp', ['ngAnimate','ngRoute']);

app.config(function($routeProvider, $locationProvider){ 
		$routeProvider.when('/', {
			templateUrl: 'home.html'
			})	
			.otherwise({
				redirectTo: '/'
			});

			$locationProvider.html5Mode(true);		
	});

//angular display and google api callback function

app.controller('ctrl', function($timeout, GoogleLocation, YelpHobby, $location){
	
  
 	this.heading = "The World Is Yours";
 	this.subheading = "Where would you like to go?";
 	this.subheading2 = "What's one of your favorite hobbies?";
 	this.resultsHeading = "Here are some of the best locations"; 
 	this.footer = "Check out some of the best locations based on your interests";
 	this.hideLocation = false;
 	this.hideHobby = true;
 	this.showResults = false;

 	//get location from Google API

 	this.getLocData = function(){
 		 
 		 let locTag = $('#query').val();
 		 if(locTag  == ""){
 		 	alert('Please enter a location');
 		 	return;
 		 }
 		 else{
 		 	this.hideLocation = true;
 		 	
 		 	let ctrl = this;
 		 	
 		 	$timeout(function(){ctrl.hideHobby = false;}, 1000)


 			GoogleLocation.getLocation(locTag, function(response) {
				ctrl.location = response;
				ctrl.apiLocation = response.data.predictions[0].description
					
 			});	
 		}
 			
 	}

 	//get hobby input from Yelp API

 	this.getHobData = function(){

 		 let hobTag = $('#query2').val();
 			
 			if(hobTag  == ""){
 		 	alert('Please enter a hobby');
 		 	return;
 		 }
 		 else{
 		 	this.hideHobby = true;
 		 	let ctrl2 = this;
 		 	$timeout(function(){ctrl2.showResults = true;}, 1000)

 			
 			YelpHobby.getHobby(hobTag, this.apiLocation, function(output){
 				console.log(output);
 				ctrl2.destination = output;
 				ctrl2.placesArray = output.businesses;

 			});
 			
 		}
	};

	//clear results and forms

	this.newSearch = function(locTag, hobTag, placesArray, addressArray){
		let ctrl3 = this;
		ctrl3.showResults = false;
		ctrl3.hideHobby = true;
		$timeout(function(){ctrl3.hideLocation = false;}, 700)
		hobTag = $('#query2').val('');
		locTag = $('#query').val('');
		ctrl3.placesArray = null;
		ctrl3.addressArray = null;

	}

})

//Google API service
 
app.service("GoogleLocation", function($http) {
	this.getLocation = function(tag, callBack) {
		
		let request = {
			input: tag,
			key: 'AIzaSyBhK4afPGeIOKro6PUWxOKvcTDXUqD-upY'
		};
		
		$http({
			method: "GET",
			url: "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=" + tag + "&key=AIzaSyBhK4afPGeIOKro6PUWxOKvcTDXUqD-upY",
			params: request
		}).then(function(response) {

			let x2js = new X2JS()
			callBack(response);
		})	 

	}
});

//Yelp API service

app.service("YelpHobby", function($http){

	this.getHobby = function(hobby, location, callback){

		let method = "GET";
		let url = "https://api.yelp.com/v2/search";

		let params = {
			callback: "angular.callbacks._0",
			oauth_consumer_key: "HRokaNQY63hf_M_pVay83Q",
			oauth_token: "tUvHggPMn5epOhWeqG5ILVRYcl9DgTiu",
			oauth_signature_method: "HMAC-SHA1",
			oauth_timestamp: Math.floor(new Date().getTime()/1000),
			oauth_nonce: "PLAINTEXT",
			term: hobby,
			location: location,
			limit: 10
		};

		//oauth signiture info

		let consumerSecret = 'DcRCyGutJxmDNqjy5Cxvdbg7itE';
		let tokenSecret = 'KxVMZbqVXvuTTHY-4MCX1HOdJzw';
		let encodedSignature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
		params["oauth_signature"] = encodedSignature;	
		$http.jsonp(url, {params: params}).success(callback);	
		
		}

	});


