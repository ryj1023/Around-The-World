//dependencies

let angular = require('angular');
let $ = require('jquery');
let ngAnimate = require('angular-animate');
let ngRoute = require('angular-route');
//let datePicker = require('angular-datepicker');
//import * as dir from '../js/directives'
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
app.controller('ctrl', function($scope, $timeout, GoogleLocation, YelpHobby, $location, $http){
 	this.heading = "The World Is Yours";
 	this.subheading = "Where would you like to go?";
 	this.subheading2 = "What's one of your favorite activities?";
 	this.resultsHeading = "Here are some of the best locations"; 
 	this.footer = "Check out some of the best locations based on your interests";
 	this.hideLocation = false;
 	this.hideHobby = true;
 	this.showResults = false;
 	this.showFlights = false;
 	this.hideRow = false;
 	this.hideNew = false;
 	this.start = "";
 	this.backButton = false;
 	this.cityModel = "";
 	this.flightInfoObject = [];
 	//get the start and end location, date, and pass through flight codes function
 	this.getStartCity = function(){
	 		if(this.start.length > 2){
		 		this.getFlightCodes(this.start, function(response){
	 		})
 		}
 	}
 	this.getFinishCity = function(){
 		if(this.finish.length > 2){
	 		this.getFlightCodes(this.finish, function(response){
 			})
 		}
 	}
	this.getDate = function() {
	    this.startDate = document.getElementById("startDate").value;
	    	if(this.startDate == "2016-09-09"){
		    	alert('please select a valid travel date')
		    	return;
	    	}
		    else{
			    	this.getFlightId();
		    }
	}

	this.goBack = function(){
		this.hideRow = false;
		 	this.showFlights = false;
		 	this.hideNew = true;
		 	this.backButton = false;
	}
 	this.getPath = function(){
 		location.reload();
 	}
 	//get location from Google API
 	this.getLocData = function(){
 		let locTag = $('#query').val();
 		 if(locTag  == ""){
 		 	alert('Please enter a location');
 		 	return;
 		 }
 		 else{
 	 			let ctrl = this;
	 			GoogleLocation.getLocation(locTag, function(response) {
	 					if(response.data.status == "ZERO_RESULTS"){
							alert("No results. Please select a new location.")
						}
							else{
		 				ctrl.hideLocation = true;
	 		 			$timeout(function(){ctrl.hideHobby = false;}, 1000)
					for(let i = 0; i < response.data.predictions.length; i++){
							let location = response.data.predictions[i];
							let types = response.data.predictions[i].types;
						for(let j = 0; j < types.length; j++){
							let singleType = types[j]				
						if(singleType == "political"){
							ctrl.apiLocation = location.description;
							}
						}
					}
				}	
	 		});	
 		}
 	}
 	//get hobby input from Yelp API
 	this.getHobData = function(){
 		let ctrl2 = this;
 		$timeout(function(){}, 1000)
 		let hobTag = $('#query2').val();
 			if(hobTag  == ""){
 		 	alert('Please enter an activity');
 		 	return;
 		 }
 		 else{
 			YelpHobby.getHobby(hobTag, this.apiLocation, function(output){
 				if(output.businesses.length == 0){
 					alert('No results found!')
 					ctrl2.getPath();
 					return
 				}
 					ctrl2.hideHobby = true;
		 		 	$timeout(function(){ctrl2.showResults = true;}, 1000)
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
	this.getFlightCodes = function(city, callback){
		let g = this;
		g.flightInfoObject = [];
		let request = {
			term: city,
			limit: 7,
			size: 0,
			key: '7bd887c51a'
		};
			$http({
				method: "GET",
				url: "https://www.air-port-codes.com/api/v1/multi",
				params: request
			})
			.then(function(response){
				for(let i = 0; i<response.data.airports.length; i++){
					let codes = response.data.airports[i].iata;
					let name = response.data.airports[i].name;
					let city = response.data.airports[i].city;
					g.flightInfoObject.push({name: name, city: city, code: codes})
					console.log(g.flightInfoObject)
				}
		})
	}
		//use $scope with $scope.digest
		$scope.getFlights = function(depart, arrive, startDate){
			let flightRequest = {
		      "request": {
		        "slice": [
		          {
		            "origin": depart,
		            "destination": arrive,
		            "date": startDate,
		           	"maxStops": 1
		          }
		        ],
		        "passengers": {
		          "adultCount": 1,
		          "infantInLapCount": 0,
		          "infantInSeatCount": 0,
		          "childCount": 0,
		          "seniorCount": 0
		        },
		        "solutions": 20,
		        "refundable": false
		      }
			};		
			$.ajax({
			     type: "POST",
			     url: "https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyDbNoJSTeFYq-jmPsQX51d9IppintX76Ng", 
			     contentType: 'application/json', 
			     dataType: 'json',
			     data: JSON.stringify(flightRequest),
			     success: function (data) {
			     let tripData = data.trips.data;
			     let tripOptions = data.trips.tripOption;
	      		 $scope.tripReturn = [];
					    if(tripOptions){
					      for(var i = 0; i < tripOptions.length; i++){
					      		let trip = tripOptions[i];
					      		let tripObject = {};
					      		tripObject.salesTotal = trip.saleTotal;
					      		tripObject.duration = trip.slice[0].duration;
					      		tripObject.segment = [];
					      		for(let l = 0; l < trip.slice[0].segment.length; l++){

					      			let segmentObject = {};
					      			let segment = trip.slice[0].segment[l];
					      			segmentObject.carrier = segment.flight.carrier;
					      			segmentObject.flightNumber = segment.flight.number;
					      			segmentObject.aircraft = segment.leg[0].aircraft;
					      			segmentObject.origin = segment.leg[0].origin;
					      			segmentObject.destination = segment.leg[0].destination;
					      			segmentObject.departureTime = segment.leg[0].departureTime;
					      			segmentObject.arrivalTime = segment.leg[0].arrivalTime;
					      			tripObject.segment.push(segmentObject);
					      		}
					      			$scope.tripReturn.push(tripObject);
					      			$scope.$digest();
					      		}
					  		}
					  	else{
					  		alert('There were no flights found. Please search again!')
					  		return
					  	}	
			    },
			      error: function(){
			       //Error Handling for our request
			       alert("No flight information was available. Please search again.");
			     }
	    	});
		}
		 this.getFlightId = function(){
		 		if(this.start  == "" || this.finish == "" || this.startDate == "" || this.endDate == ""){
		 			alert("please fill in all fields")
 		 	return;
 		 }
 		 else{
 		 	this.hideRow = true;
 		 	this.showFlights = true;
 		 	this.hideNew = true;
 		 	this.backButton = true;
 		 	let ctrl4 = this;
 		 		$scope.getFlights(ctrl4.start, ctrl4.finish, ctrl4.startDate);
		}
	}
})
//Google API service
app.service("GoogleLocation", function($http) {
	this.getLocation = function(tag, callBack) {
		console.log(tag);
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
		}, function(response){
			alert("Something went wrong! please Search again.")
			return
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