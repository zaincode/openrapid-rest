// Get the available routes from ./config/route.js file
const routes = require('@config/routes'); 
const env = require("@config/env"); 
const helper = require("@libs/helper"); 
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const CONTROLLER_SEPARATOR = "#";
const packageJsonFile = require('@/package.json');

// Start the routing process
module.exports = async (router, global) => {
	// Logs the console that the routing is already started
	helper.print.log('Starting ' + `${packageJsonFile.name}`.cyan + ' api server on port '.white + `${env.port}` .cyan)
	helper.print.log('Preparing ' + `${Object.keys(routes).length}`.cyan + ' API routes '.white);
	
	// Here's where the magic happens
	// First, we gonna loop through each endpoint in ./config/routes.js file
	Object.keys(routes).forEach(async $route => {
		
		// Get the route method
		let $route_method = routes[$route].method ? routes[$route].method : "GET";
		// defines the route controller
		let $route_controller = routes[$route].controller; 
		// Defines route's middlewares
		let $route_middleware = routes[$route].middleware ? routes[$route].middleware : [];

		// run the controller based on request
		await router[$route_method.toLowerCase()]($route, async function(req, res, next) { 

			// Passed endpoint parameters
			var endpoint_parameters = { Headers : req.headers, Request : req, Response : res, Global : global, MiddlewareData : {} };
			// Identifies if middleware success (if exist)
			var isMiddlewarePassed = true;

			// Loop throught every middleware
			await $route_middleware.forEach(async middleware => {
				// If previous middleware is passed then continue to the next one
				if (isMiddlewarePassed == true) {
					// Import middleware
					const Middleware = require(env.path.middlewares + env.prefix.middleware + middleware);
					// Call middleware
					const CallMiddleware = new Middleware(endpoint_parameters);
					// Find if middleware has run() methods
					if (typeof CallMiddleware.run !== undefined) {
						// Call the middleware and look for run() method
						await CallMiddleware.run();
						// Print accessed Middleware
						helper.print.log(`[${CallMiddleware.status == true ? "SUCCESS" : "FAILED"}]`[CallMiddleware.status == true ? "cyan" : "red"] + ` Running Middleware `.white + `${middleware}`.green);
						// Get middleware status
						isMiddlewarePassed = CallMiddleware.status;
						// Assign middleware data if exist
						Object.assign(endpoint_parameters.MiddlewareData, CallMiddleware.data);
					}else{
						isMiddlewarePassed = false;
						helper.print.log(`Method '${controllerMethodName}' can not be found in ${controllerName} controller `.red);
						res.status(404).end();
					}
				}
			});

			// Continue to controller only if middleware value is true
			if (isMiddlewarePassed == true) {
				if (typeof $route_controller == "string") {
					// Find the separator in controller string
					const controllerSeparatorIndex =  $route_controller.search(CONTROLLER_SEPARATOR);
					// Get the controller name
					const controllerName = controllerSeparatorIndex == -1 ? $route_controller : $route_controller.substr(0, controllerSeparatorIndex);
					// get controller method name
					var controllerMethodName = $route_controller.substr(controllerSeparatorIndex + 1, $route_controller.length);
					controllerSeparatorIndex == -1 ? controllerMethodName = "index" : null;
					try {
						// Import controller
						const controller = require(`@controllers/${env.prefix.controller}${controllerName}`);
						// Check controller method
						const checkControllerMethod = new controller(endpoint_parameters)[controllerMethodName];
						// If method found or exist
						if (checkControllerMethod !== undefined) {
							// Print accessed endpoint
							helper.print.log(`[${$route_method}]`.cyan + ` ${req.path}`.green + " => ".white + `${typeof $route_controller == "function" ? "function_controller" : $route_controller}`.green);
							// Call controller with the method
							const callController = new controller(endpoint_parameters)[controllerMethodName]();
						}else{
							// Returns error when method is not exist
							helper.print.log(`Method '${controllerMethodName}' can not be found in ${controllerName} controller `.red);
							res.status(404).end();
						}
					}catch(e){
						// Something went wrong with the controller
						helper.print.log(`${e.message}`.red);
						res.status(500).end();
					}
				}else{
					// Route controller is a direct function from the route object
					$route_controller(endpoint_parameters);
				}
			}
		});
	});
}

