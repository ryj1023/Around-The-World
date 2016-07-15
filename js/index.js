let angular = require('angular');
let $ = require('jquery');
let ngAnimate = require('angular-animate');
let ngRoute = require('angular-route');

let app = angular.module('myApp', ['ngAnimate','ngRoute']);

/*app.config(function($routeProvider){ 
	$routeProvider.when('/', {
		template: 'Welcome!'
	})
	.when('/anotherPage', {
		template: 'Welcome, again!'
	})
	.otherwise({
		redirectTo: '/'
	});


});*/

app.controller('ctrl', function($timeout, GoogleLocation, YelpHobby){
  
 	this.heading = "The World Is Yours";
 	this.subheading = "Where would you like to go?";
 	this.subheading2 = "What's one of your favorite hobbies?";
 	this.footer = "Check out some of the best locations based on your interests";
 	this.hideLocation = false;
 	this.hideHobby = true;

 	this.getLocData = function(){
 		 
 		 let locTag = $('#query').val();
 		 if(locTag  == ""){
 		 	alert('Please enter a location');
 		 	return;
 		 }
 		 else{
 		 	this.hideLocation = true;
 		 	let ctrl = this;
 		 	$timeout(function(){ctrl.hideHobby = false;} ,1000)
 			console.log(locTag); 
 			GoogleLocation.getLocation(locTag, function(response){

				ctrl.location = response;
				ctrl.apiLocation = response.data.predictions[0].description;
				console.log(ctrl.apiLocation);
				
				return ctrl.apiLocation;

 			});
 		}

 	}




 	this.getHobData = function(apiLocation){
 		 
 		 let hobTag = $('#query2').val();
 			
 			if(hobTag  == ""){
 		 	alert('Please enter a hobby');
 		 	return;
 		 }
 		 else{
 		 	this.hideHobby = true;
 			
 			YelpHobby.getHobby(hobTag, apiLocation, function(output){
 				let ctrl2 = this;
 				ctrl2.destination = output;
 				console.log(output);

 			});
 			console.log(hobTag); 
 		}
	};
})
 
app.service("GoogleLocation", function($http){

	this.getLocation = function(tag, callBack){
		let request = {
			input: tag,
			key: 'AIzaSyBhK4afPGeIOKro6PUWxOKvcTDXUqD-upY',
			//format: 'jsonp'
		};

		$http({
			url: "https://maps.googleapis.com/maps/api/place/autocomplete/json?",
			params: request
		})

		.then(function(response){
			callBack(response);
			console.log(response);
		})	
	}
});

app.service("YelpHobby", function($http){

	this.getHobby = function(tag, apiLocation, callBack){

		let request = {
			oauth_consumer_key: "HRokaNQY63hf_M_pVay83Q",
			oauth_token: "tUvHggPMn5epOhWeqG5ILVRYcl9DgTiu",
			oauth_signature_method: "HMAC-SHA1",
			oauth_signature: "KxVMZbqVXvuTTHY-4MCX1HOdJzw",
			oauth_timestamp: Math.floor(new Date().getTime()/1000),
			oauth_nonce: "PLAINTEXT",
			term: tag,
			location: "texas",
		};

		$http({
			url: "https://api.yelp.com/v2/search?",
			params: request
		})

		.then(function(output){
			callBack(output);
			console.log(output);
		})
	}

});

	
// Consumer Key	HRokaNQY63hf_M_pVay83Q
// Consumer Secret	DcRCyGutJxmDNqjy5Cxvdbg7itE
// Token	Q2mzAU1qpqURrJ5F_u0wzi4ZMQWEzVVl
// Token Secret	YL6uzoXHWE8Am239cWQ77OZLHVU


// Consumer Key	HRokaNQY63hf_M_pVay83Q
// Consumer Secret	DcRCyGutJxmDNqjy5Cxvdbg7itE
// Token	tUvHggPMn5epOhWeqG5ILVRYcl9DgTiu
//  Token Secret	KxVMZbqVXvuTTHY-4MCX1HOdJzw

