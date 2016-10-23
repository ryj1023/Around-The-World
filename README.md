# Around-The-World


<h1>How Fit Are You?</h1>

Travel and actvity rating application

<h1>Screenshots</h1>

![Screenshot](https://github.com/ryj1023/Around-The-World/blob/master/Sreenshot.png)
![Screenshot](https://github.com/ryj1023/Around-The-World/blob/master/Screenshot2.png)
![Screenshot](https://github.com/ryj1023/Around-The-World/blob/master/Screenshot3.png)



<h1>Overview</h1>

Around The World offers the user a look into virtually any location of their choice and get detailed information on activities they might be interested in, as well as the price of a plane ticket to that destination. This app is useful for the traveler interested in planning a trip and would like to know the best spots for them to do the things they love, and to discover new attracitons they have not see or done yet. This platform allows the user to get a feel of how they will lay out their itinerary for their trip, and how much money they will have to budget. 

<h1>Why Care?</h1>

When it comes to traveling, especially to a location you have never been before, the places you visit, where you stay, and how you get there can play a significant role in getting the best out of your experience. With the help of Yelp's API service, and Google maps, the user has access to the best rated attractions and lowest cost travel options to fit their needs.

<h1>UX</h1>

The UX in this app is designed to be simple and easy to use. The user is prompted to enter a location and activity, then they are shown a list of those activities in order based on a user review rating, this makes selecting the right venue easy and reliable. The flight sarch allows the user to select flights based on exactly when they want to travel, and is not restricted to any particular airline. This will inform the user of the cost of the flight so it is easier for them to estimate their budget. The app is designed with animation and bright colors to add to the exitement of embarking on a new adventure.

You can access a working prototype of the app here:

<h1>Technical</h1>

Around The World is built on the font end using AngularJS, with Angular's aminate, ng-route, and O Authorization. The stylesheet is built using LESS and nodeJS is implemented with npm package manager. The first question is presented using the ng-show and ng-model directives. The user types in a keyword for a location request and the keyword is first passed into a Google Location API to match up the key word with a result most closely correlated. The returned object is stored in a location variable to be used as part of Yelp's API query. The app prompts the user to enter in a second input based on an activity they wish to partake in. The input is used along with the location variable to search Yelp's API and return an object that contains locations of that hobby. Using the ng-repeat directive, the search results are displayed, and when the user selects a location, a new tab is open that displays the yelp page of that location. The flight search functionality uses the ng-change directive to initiate API calls for Google's QPS express API and display all airport codes in a datalist based on the search query if the user does not know the airport codes. When the depart and arrive airport codes entered into the search field, and flight date is selected, an object is displayed containing all of the relevant flights is returned from cheapest to most expensive.   

<h1>Upcoming Features</h1>

Back end features are being developed using the MEAN stack for the user to create an itinerary for multiple events and round trip fight plans. 

