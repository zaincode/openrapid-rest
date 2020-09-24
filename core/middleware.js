const env = require("@config/env");

class Middleware extends require("@core/core"){

	constructor(parameters) {
		super(parameters);
		// Initial middleware status
		this.isMiddlewareSuccess = false;
	}

	next (data = {}) {	
		// Set middleware data if exist
		this.ControllerMiddlewareData = data;
		// set if middleware is successs to continue to the next middleware or controller
		this.isMiddlewareSuccess = true;
	}

	// get middleware status pass or not
	get status(){
		return this.isMiddlewareSuccess;
	}

	// Get middleware data
	get data(){
		return this.ControllerMiddlewareData;
	}

}

module.exports = Middleware;