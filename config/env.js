module.exports = {
	// Api Version 
	version : '1.0',
	// Json parser configuration
	parser : {
		// Limit of request body size in megabyte
		// This usually helps if you transfering large amout of request
		limit: '30mb', 
		extended: true
	},
	// Defines Server Port, Default port is 8881
	port : 8881,
	// Wether or not the api should use database
	// Change it to true to use database driver
	use_database : true,
	// Database configuration
	// Suports only one database connection
	database : {
		// Database name
		database: "DATABASE_NAME",
		// Database host / ip address
	    host: "DATABASE_HOST",
	    // Database's port number
	    port: "DATABASE_PORT",
	    // Database username access
	    user: "DATABASE_USER",
	    // Database password
	    password: "DATABASE_PASSWORD"
	},
	path : {
		// Controllers path
		controllers : "@controllers/",
		// Models path
		models : "@models/",
		// Middleware path
		middlewares : "@middlewares/",
		// Database Configuration Path
		database : "@core/database",
		// Storage path
		storage : "app/storage/"
	},
	prefix : {
		controller : "controller_",
		model : "model_",
		middleware : "middleware_"
	}
}