/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute"); // Add this line
const path = require("path");

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 

app.use(express.static('public'));
app.use('/images', express.static('images'));

/* ***********************
 * Routes
 *************************/
app.use(static);
app.use(inventoryRoute); 
app.get("/", baseController.buildHome);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});