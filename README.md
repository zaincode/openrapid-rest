# openrapid.js

openrapid.js is a modular API Framework built over NodeJS and ExpressJS. openrapid uses popular MC workflow such as laravel (in PHP). it is lightweight and easy to get started with.

## Installation

openrapid.js requires latest version of [Node.js](https://nodejs.org/).

Clone repository from https://github.com/zaincode/openrapidjs.git or download manualy source code


## Prefixes
openrapid.js uses prefix to name some of it files in `controllers`, `models` and `middlewares`
- controllers uses **controller_**
- models uses **model_**
- middleware uses **middleware_**

you can also change the prefix name in `config/env.js`, you dont have to use prefix when you want to call model, defining middleware or controller in your route. just name the file with these prefix.
 
## How To Use It

There are 2 main thing that you need to focus on to get started


### 1. config/routes.js
This is where you store your routes, a route is an object containing 3 properties. **method**, **controller** and **middleware**.
A controller property contains a string of the controller name (without prefix) and the method name separated by **#** symbol. 

```javascript
module.exports = {
  // The API path
  "api/user/get" : {
    // Api method (POST, GET, PUT, DELETE etc)
    "method" : "POST",
    // Controller name followed with method name
    "controller" : "user#get_user"
  }
}
```

**Note**: If you don't include method name in the controller property, for example `"controller" : "user"` system will automatically look for `index()` method in your controller. so make sure you got that cover.
### 2. app/controllers
Controllers directory is where you supposed to save all of your controller files. a controller is where your api path refers to. this is the file where you do your api thing, handling request body, validate some stuff, calling model and sending response back to user.

```javascript
class UserController extends require("@core/controller"){
	
  // Constructor has be present in every controller
  constructor(params) {
   super(params);
  }
     
  // controller method that is gonna be called
  async get_user() {
   // do some stuff here
  }
}

// Dont forget to export the controller
module.exports = UserController;
```
in controller you can access almost to every feature such as calling model, getting request, sending response and etc. using `this` pointer.
```javascript 
async get_user() {
   // to get the request body
   console.log(this.request.body);
   // to validate request requirements
   this.request.requires(["user_id"]) // returns true if request body validated
   const UserModel = await this.model("user_authentication");
   // to send response
   this.response.send({
       status : 200,
       message : "That was cool!"
   })
}
```
### How to use model?
a model is a file contains your controller business model or when you need to querying database which we use MySQL database. normally we urge you to use only one business logic per one model, but you can also return object of methods in the model, here is what a model file should look like

```javascript
module.exports = async ({Database, Model, Arguments}) => {
 // Do some business logic stuff or query to database etc. and returns something to controller
}
```
### How about middleware?
it is relatively easy to use middleware in each of your request, a middleware we run before accessing the controller, middleware is not mandatory. to add middleware see this code below

```javascript
module.exports = {
  "api/user/get" : {
   "method" : "POST",
   "controller" : "user#get_user",
    // add middleware to your request
    // should be an array of string refering to middleware file in app/middlewares/
    "middleware" : ["check_user_request"]
  }
}
```
your middleware file should look like this :
```javascript 
class UserMiddleware extends require("@core/middleware"){
  // This contstructor is important
  // Every middleware should have this method
  constructor(params) {
    super(params);
  }

  // The initial function middleware will look for
  // this method should contains all of your codes about middleware
  run() {
    // do your middleware stuff here	
  }
}

module.exports = UserMiddleware;
```
if a middleware success or you want to proceed the request to controller use `this.next()` method. this method will tell the system that everything you do in your middleware is success or nothing is wrong. so that the middleware can continue to pass the request to controller
```javascript 
run() {
  // continue to controller
  this.next();
  // or if you want to pass some data from middleware to the controller
  this.next({ hello : "World" });
}
```
if there are some situation where middleware fails to proccess something you can just send response back to client using `this.response.send()`

### Run 
```npm
nodemon start
```

### Error Fixes
feel free to contact me if there is some error or any advice in zainroyan.personal@gmail.com or DM me on insta https://www.instagram.com/zain_royan/?hl=id :)
