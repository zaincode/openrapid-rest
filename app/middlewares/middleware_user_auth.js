// This file represents a single middleware
// This code will execute as soon as api requested and before accessing the controller

class UserMiddleware extends require("@core/middleware"){
	
	// This contstructor is important
	// Every middleware should have this method
	constructor(parameters) {
	  	super(parameters);
	}

	// The initial function middleware will look for
	// this method should contains all of your codes about middleware
	run() {
		this.next({ passedSomeData : "yes!" });	
	}

}

module.exports = UserMiddleware;