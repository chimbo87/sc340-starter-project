
/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const reviewRoute = require('./routes/reviewRoute');
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const utilities = require("./utilities");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); 

/* ***********************
 * Middleware
 *************************/
// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static('images'));

// Cookie parser middleware
app.use(cookieParser());

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

// Make flash messages and utilities available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// JWT checking middleware (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(utilities.checkJWTToken);
}

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ***********************
 * Routes
 *************************/
// Home route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Account routes
app.use("/account", accountRoute);

// Inventory routes
app.use("/inv", inventoryRoute);

// Reviews routes
app.use('/reviews', reviewRoute);

// Static routes
app.use(static);

/* ***********************
 * 404 Error Handler
 *************************/
app.use(async (req, res, next) => {
  const nav = await utilities.getNav();
  res.status(404).render('errors/error', {
    title: '404 - Page Not Found',
    nav,
    message: 'Sorry, the page you are looking for does not exist.'
  });
});

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render('errors/error', {
    title: 'Server Error',
    nav,
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
  console.log(`Account management: http://${host}:${port}/account/`);
  console.log(`Inventory management: http://${host}:${port}/inv/`);
});