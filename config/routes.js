// This file contains api routes
// Each object properties defines a single route  

// All defined routes should be inside of this object
module.exports = {
	// Root Path
	// This is simple route using a GET method
	// You can actually call your controller inside a route object like below
	// Without having to create a controller file
	"/" : {
		controller : ({ Headers, Request, Response, Global }) => {
			console.log("Hello, World!")
		}
	},
	// a Route, represents a single endpoint
	// For example route "/test" is the api path with method, controller and other parameters
	"/test" : {
		// Request method
		method : 'GET', 
		// Name of the controller file in ./app/controllers/
		// Note that every controller file needs to have a prefix controller_ 
		// You can also change the prefix in ./config/env
		// There are two things to mention in order to call this request
		// First is the controller name and second is the method name, this is separated by '#' sign
	    controller : 'test#login',
	    // Includes middleware in the request, you can have multiple middlewares and note that
	    // System will execute the middleware in sequence based on the array index below
	    middleware : ["user_auth", "example"]
	}
};
