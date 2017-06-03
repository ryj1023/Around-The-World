var UserController = function ($scope, auth, store, Travelers, TripInfo, $location, $http){
	
	var ctrl = this;
	ctrl.userName = "ryan";
 	ctrl.password = "focusssss";
 	ctrl.showLogout = false;
 	ctrl.getMessage = getMessage;
 	ctrl.getSecretMessage = getSecretMessage;
 	ctrl.message;
 	ctrl.pr
 	//ctrl.profile = store.get('profile');

 	function getMessage(){
 		$http.get('/api/public', {skipAuthorization: true})
 		.then(function(response){
 			console.log(response.data.message)
 			ctrl.message = response.data.message;
 		});

 	}
 	function getSecretMessage(){
 		$http.get('/api/private')
 		.then(function(response){
 			console.log(response.data.message)
 			ctrl.message = response.data.message;
 		});
 	}

 		ctrl.login = function(){
 			console.log(auth.isAuthenticated)
 			auth.signin({}, function(profile, token){
 				store.set('profile', profile)
 				store.set('id_token', token)
 				$location.path('/')

 			if(auth.isAuthenticated){
 				console.log(auth.isAuthenticated)
 				ctrl.showLogout = true;
 			}
 			else{
 				ctrl.showLogout = false;
 			}
 				ctrl.user = profile;
 				//ctrl.userInfo(ctrl.user)
				}, function(error){
 				console.log(error);
 			})
 	

 		ctrl.logout = function(){
 			store.remove('profile');
 			store.remove('id_token')
 			auth.signout();
 		if(!auth.isAuthenticated){
 			ctrl.showLogout = false;
 		}
 		else{
 			ctrl.showLogout = true;
 			}
 		$location.path('/')

		}
	}

 	ctrl.userInfo = function(user){
 		console.log(user)
 		// Travelers.getTravelers(user, function(response){
 		// 	console.log(response)
 			// response.data.forEach(function(user, index){
 			// 	console.log(user.email, user.password)
 			// })
 		
 		//})
 	}





 	//ctrl.userInfo(ctrl.user);
 	

 	ctrl.addTraveler = function(userName, password){	
 		Travelers.addTraveler(userName, password, function(response){
 			console.log(response)
 		})

 	}

 	ctrl.saveFlights = function(user){
 		ctrl.flights = TripInfo.getTripInfo();
 		TripInfo.saveTrip(user, ctrl.flights);
 	}

 	//ctrl.addTraveler(ctrl.userName, ctrl.password)
}

angular.module('signIn', []).component('userList', {
	templateUrl: 'sign-in.html',
	controller: UserController
})

