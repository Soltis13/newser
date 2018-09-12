// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// ******************************************************************************


// *** Dependencies
const express = require("express"); // Express Server
const bodyParser = require("body-parser"); // Post Body Request
const logger = require("morgan"); // Logger
const exphbs = require('express-handlebars'); // Templating Engine
var db = require("./models"); // Require all models



// Set Default Port for Express and Heroku
let PORT = process.env.PORT || 3000; 

// Initialize Express
var app = express();

// Configure middleware




// Setup morgan logger for logging requests
app.use(logger("dev"));

// Setup body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Setup access to static assets
app.use(express.static("public"));

// Setup Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure routes
require("./controllers/newsercontroller.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});