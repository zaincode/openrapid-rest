// This file represents a single middleware
// This code will execute as soon as api requested and before accessing the controller

class ExampleMiddleware extends require("@core/middleware"){
	
	// This contstructor is important
	// Every middleware should have this method
	constructor(parameters) {
	  	super(parameters);
	}

	// The initial function middleware will look for
	// this method should contains all of your codes about middleware
	run() {
		// Get passed data from another middleware
		// console.log(this.middleware.data);
		// Continue to controller if its the last middleware
		this.next();		
	}
}

module.exports = ExampleMiddleware;