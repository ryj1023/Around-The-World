angular.module('services', [])
//Google API Service
.service("GoogleLocation", function($http) {
	this.getLocation = function(tag, callBack) {
		let request = {
			input: tag,
			key: 'AIzaSyADmm4nPlGxj7URXxMnT-PQYzFgR8CVQpg',
			dataType: 'json'
		};
		$http({
			method: "GET",
			url: "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=" + tag + "&key=AIzaSyADmm4nPlGxj7URXxMnT-PQYzFgR8CVQpg",
			params: request
		}).then(function(response) {
			let x2js = new X2JS()
			callBack(response);
		}, function(response){
			return
		})
	}
})
//Yelp API Service
.service("YelpHobby", function($http){
	this.getHobby = function(hobby, destination, location, callback){
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
			location: destination,
			limit: 10
		};
		//oauth signiture info
		let consumerSecret = 'DcRCyGutJxmDNqjy5Cxvdbg7itE';
		let tokenSecret = 'KxVMZbqVXvuTTHY-4MCX1HOdJzw';
		let encodedSignature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {encodeSignature: false});
		params["oauth_signature"] = encodedSignature;	
		$http.jsonp(url, {params: params}).success(callback)
		.catch(function (err) {
				alert('No results found, Please select a different location or activity');
				location.reload();
    		})
	
		}
	})
.service("Travelers", function($http){
		this.getTravelers = function(user, callback){
			console.log(user)
			$http({
					method: "GET",
					url: '/travelers',
					params: {user: user.user_id}
				}).then(function(response) {
					callback(response);
				}, function(response){
					return
			})
		}

		this.addTraveler = function(email, password, callback){	
				$http({
						url: '/travelers',
						method: "POST",
						data: {'email' : email, 'password': password}
					})
					.then(function(response){
					console.log(response)
					})
				}	
		})
.service("TripInfo", function($http){
	this.storeTripInfo = function(flights){
		console.log('flights', flights)
		return this.flights = flights;
	}
	this.getTripInfo = function(){
		return this.flights
	}
	this.saveTrip = function(user, flights){
		var userId = user.user_id;
		// console.log('user:' + user)
		// console.log(flights)
		// console.log(userId);
		$http({
				url: '/travelers',
				method: "POST",
				data: {'userId' : userId, 'flights': flights}
			})
			.then(function(response){
			console.log(response)
			})
	}
})





