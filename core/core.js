const env = require("@config/env");

class Core {

	constructor({ Request, Response, Global, MiddlewareData }) {
		// Set controller request,
		// This global variable contains all of the things requested from router
		this.ControllerRequest = Request;
		// Set controller response,
		// This global variable contains methods to use to send a response to client
		this.ControllerResponse = Response;
		// Stores all data passed on middleware
		this.ControllerMiddlewareData = MiddlewareData;
		// Store all missing parameters from user request
		this.ControllerRequestMissingParameters = [];
		// Get all global variable
		this.global = Global;
		// Get environment variables
		this.env = env;
	}

	// Get request from endpoint
	get request(){
		return {
			// Required parameters method to Validate if body request 
			// includes spesific parameter before continue Making further request
			requires : this.handleRequestRequiredParams.bind(this),
			// Cathes all missing parameters after validation
			missingParameters : this.ControllerRequestMissingParameters,
			// Validate body request
			validate : this.handleValidateBodyRequest.bind(this),
			// Concat all of raw parameters
			...this.ControllerRequest
		};
	}

	// Get response
	get response(){	
		var self = this;
		return {
			status : (status = 200) => {
				return {
					send : (response) => {
						self.ControllerResponse.status(status).json(response);
					}
				}
			}, 
			send : (response) => {
				self.ControllerResponse.status(200).json(response);
			}
		}
	}

	// Get middleware data
	get middleware(){
		return this.ControllerMiddlewareData;
	}

	// Model Factory
	async model(modelName, modelArguments = {}){
		// Return the model file with some arguments
		return require(env.path.models + env.prefix.model + modelName)({
			// A model instance passed on as parameter into a model file
			// this makes calling another model inside a model possible
			Model : this.model.bind(this),
			// A database connection to call inside model to access database and query some stuff
			Database : env.use_database == true ? await require(env.path.database)() : null, 
			// Arguments object passed from the controller
			Arguments : modelArguments
		});
	}

	// Event Handlers
	// Handle validate required paramaters from the body request
	handleRequestRequiredParams(requireParameters){
		// Loop each body request 
		requireParameters.map((param, index) => {
			// Check if body request includes all of required parameters
			// if some or one of em missing, store the param to missing parameters variable
			typeof this.ControllerRequest.body[param] === "undefined" ? this.ControllerRequestMissingParameters.push(param) : false
		})
		// // Returns true if there are no missing parameters
		return this.ControllerRequestMissingParameters.length === 0 ? true : false;
	}

	// Handle validate body request
	handleValidateBodyRequest(validationType, validateValue){
		// Email Validation
		if(validationType == "email")  { return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(validateValue) }
		// Boolean Validation
		if (validationType == "boolean") { return typeof validateValue === "boolean" }
		// String Validation
		if (validationType == "string") { return typeof validateValue === "string" }
		// Integer Validation
		if (validationType == "integer") { return typeof validateValue === "integer" }
		// Return false if validation failed
		return false;
	}
}

module.exports = Core;