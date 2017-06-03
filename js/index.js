//dependenciesvar
var angular = require('angular');
var $ = require('jquery');
var ngAnimate = require('angular-animate');
var ngRoute = require('angular-route');
var app = angular.module('myApp', [ 'signIn','services','ngAnimate','ngRoute', 'auth0', 'angular-storage', 'angular-jwt']);
app.config(function($routeProvider, $locationProvider, $provide, authProvider, $httpProvider, jwtInterceptorProvider, jwtOptionsProvider){ 


jwtOptionsProvider.config({ whiteListedDomains: ['localhost:8080'] });
		//attach authorization header to the request array
		$httpProvider.interceptors.push('jwtInterceptor');

		//authProvider for authentication with lock from Auth0 website
		authProvider.init({
			//from Auth0 profile app
			//make sure you add localhost:8080 to allowed access with Auth0
			domain: 'apps-login.auth0.com',
			clientID: 'tnA7DokUxWcDTSG3Vn85494CkNhuUQCD'
		})

		//allows us to make http requests to private info using a web token
		jwtInterceptorProvider.tokenGetter = function(store){
			return store.get('id_token');
		}

		$routeProvider.when('/', {
			templateUrl: 'home.html'
			})
		.when('/home', {
				templateUrl: 'home.html'
			})	
		.when('/sign-in', {
				templateUrl: 'sign-in.html'
			})
		.when('/profile', {
				templateUrl: 'profile.html'
			})
		.otherwise({
				redirectTo: '/'
			});
			$locationProvider.html5Mode(true);		
	});
	

//angular display and google api callback function
app.controller('ctrl', function($scope, $timeout, GoogleLocation, YelpHobby, Travelers, TripInfo, $location, $http, auth, store){
 	this.heading = "The World Is Yours";
 	this.subheading = "Where would you like to go?";
 	this.subheading2 = "What's one of your favorite activities?";
 	this.resultsHeading = "Here are some of the best locations"; 
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
 	this.locTag = "";
 	this.hobTag = "";

 	//console.log(UserController.userName);

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
 		 if(this.locTag.length > 0){
	 		  var ctrl = this;
	 		  ctrl.locationList = [];
	 			GoogleLocation.getLocation(ctrl.locTag, function(response) { 
	 					if(response.data.status == "ZERO_RESULTS"){
							alert("No results. Please select a new location.")
						}
							else{
					for(var i = 0; i < response.data.predictions.length; i++){
							//let location = response.data.predictions[i];
							var location = response.data.predictions[i].description;
							var types = response.data.predictions[i].types;
							ctrl.locationList.push({location: location});
					}
				}
			});	
 		}
 	}

 	this.submitLocation = function(){
 		 var ctrl3 = this
 			ctrl3.hideLocation = true;
	 		$timeout(function(){ctrl3.hideHobby = false;}, 1000)
 	}
 		//get hobby input from Yelp API
 	this.getHobData = function(){
 		//ctrl2 is scope of getHobData function
 		var ctrl2 = this;
 		$timeout(function(){}, 1000)
 			if(ctrl2.hobTag  == "" || ctrl2.locTag == null){
 		 	alert('Please enter an activity');
 		 	return;
 		 }
 		 else{
 			YelpHobby.getHobby(ctrl2.hobTag, ctrl2.locTag, location, function(output){
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
		//use $scope with $scope.digest
		$scope.getFlights = function(depart, arrive, startDate){
			var flightRequest = {
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
			     var tripData = data.trips.data;
			     var tripOptions = data.trips.tripOption;
	      		 $scope.tripReturn = [];
					    if(tripOptions){
					      for(var i = 0; i < tripOptions.length; i++){
					      		var trip = tripOptions[i];
					      		var tripObject = {};
					      		tripObject.salesTotal = trip.saleTotal;
					      		tripObject.duration = trip.slice[0].duration;
					      		tripObject.segment = [];
					      		for(var l = 0; l < trip.slice[0].segment.length; l++){
					      			var segmentObject = {};
					      			var segment = trip.slice[0].segment[l];
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

					      		TripInfo.storeTripInfo($scope.tripReturn);
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
		 		if(this.start  == "" || this.finish == "" || this.startDate == ""){
		 			alert("please fill in all fields")
 		 	return;
 		 }
 		 else{
 		 	this.hideRow = true;
 		 	this.showFlights = true;
 		 	this.hideNew = true;
 		 	this.backButton = true;
 		 	var ctrl4 = this;
 		 		$scope.getFlights(ctrl4.start, ctrl4.finish, ctrl4.startDate);
		}
	}
	this.getFlightCodes = function(city, callback){
		var g = this;
		g.flightInfoObject = [];
		var request = {
			query: city,
			api_key: 'f35b741a-67a7-4aa5-8890-4e6bf123bab0'
		};
			$http({
				method: "GET",
				url: "https://cors-anywhere.herokuapp.com/iatacodes.org/api/v6/autocomplete",
				params: request
			})
			.then(function(response){
				for(var i = 0; i<response.data.response.airports.length; i++){
					var code = response.data.response.airports[i].code;
					var name = response.data.response.airports[i].name;
					var country = response.data.response.airports[i].country_name;
					g.flightInfoObject.push({name: name, country: country, code: code})
				}
		}, function(response){
			return
		})
	}

	this.getStartCity = function(){
	 		if(this.start.length > 2){
		 		this.getFlightCodes(this.start, function(response){
	 		})
 		}
 	}
 	this.getFinishCity = function(){
 		if(this.finish.length > 0){
	 		this.getFlightCodes(this.finish, function(response){
 			})
 		}
 	}

})