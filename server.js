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
const inventoryRoute = require("./routes/inventoryRoute"); // Fixed: Using correct inventory route file
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

/* ***********************
 * View Engine and Templates (moved before middleware)
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 

/* ***********************
 * Middleware
 *************************/
// Static files (moved to top of middleware)
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static('images'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 3600000 // 1 hour session
  }
}));

// Flash messages middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************
 * Routes (Order matters!)
 *************************/
// Home route (should be first and most specific)
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

// Other static routes (if needed)
app.use(static);

/* ***********************
 * 404 Error Handler (should be after all routes)
 *************************/
app.use((req, res, next) => {
  res.status(404).render('errors/error', {
    title: '404 - Page Not Found',
    nav: require('./utilities').getNav(),
    message: 'Sorry, the page you are looking for does not exist.'
  });
});

/* ***********************
 * Error Handling Middleware
 *************************/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/error', {
    title: 'Server Error',
    nav: require('./utilities').getNav(),
    errors: { msg: err.message }
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
  console.log(`Home page: http://${host}:${port}/`);
  console.log(`Inventory management: http://${host}:${port}/inv/`);
});