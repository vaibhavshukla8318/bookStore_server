/* 1. Router

      Definition: A router is responsible for handling incoming requests and directing them to the appropriate controller or middleware. It defines the routes (URLs) of your application and what should happen when a request hits those routes.

      Functionality:

      It listens for HTTP requests (GET, POST, PUT, DELETE) on specific endpoints.

      It can group related routes together, making the codebase cleaner and more maintainable.

*/



const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/controllers.auth");
const signupSchema = require('../validators/validator.auth');
const validate = require("../middlewares/middleware.validate");
const authMiddleware = require('../middlewares/middleware.auth')

// home routers
router.route("/").get(authControllers.home);

// register routers
router.route("/register").post(validate(signupSchema) ,authControllers.register);

// login routers
router.route("/login").post(authControllers.login);

// user Router
router.route("/user").get(authMiddleware, authControllers.user)
module.exports = router;