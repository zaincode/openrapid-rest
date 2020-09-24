// rapid-node-js-v3
// Created by Royan Zain
// Since October 28th, 2019
// And here we go...

// And Oh, Normaly you wouldn't have to edit any of these code below
require('module-alias/register')
var express = require("express"), 
	path = require('path'), 
	app = express(), 
	env = require("@config/env"), 
	bodyParser = require("body-parser"), 
	router = express.Router(),
	multer = require('multer'),
	upload = multer(),
	core_router = require('@core/router'); 

// Use the JSON body parser
app.use(bodyParser.json(env.parser));

// Use parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded(env.parser)); 

// Use Form-Data Parser
app.use(upload.any());

// Use Express.Js router
app.use("/", router);

// Takes every request comes in and forward it to core router
core_router(router, require('./global'));

// Start the server
app.listen(env.port);
