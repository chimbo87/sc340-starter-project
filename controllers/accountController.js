const accountModel = require('../models/account-model');
const utilities = require('../utilities');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/* ****************************************
*  Deliver registration view
* ************************************ */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname: '',
      account_lastname: '',
      account_email: '',
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Deliver login view
* ************************************ */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: '',
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process Registration
* ************************************ */
async function registerAccount(req, res) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;


    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount) {
      req.flash("notice", "Account with this email already exists.");
      return res.status(400).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        messages: req.flash()
      });
    }

  
    console.log("Password received:", account_password);
    console.log("Password length:", account_password.length);
    

    if (!isValidPassword(account_password)) {
      console.log("Password validation failed for:", account_password);
      req.flash("notice", "Password must be at least 12 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*()_+-=[]{}|;':\",./<>?).");
      return res.status(400).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        messages: req.flash()
      });
    }
    
    console.log("Password validation passed!");

   
    let hashedPassword = await bcrypt.hash(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash()
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        messages: req.flash()
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    req.flash("notice", "An error occurred during registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav: await utilities.getNav(),
      errors: null,
      messages: req.flash()
    });
  }
}

/* ****************************************
*  Process login request
* ************************************ */
async function accountLogin(req, res) {
  try {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash()
      });
    }
    
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password);
    if (passwordMatch) {
  
      const accountDataForToken = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      };
      
      // Sign token with correct secret
      const accessToken = jwt.sign(
        accountDataForToken, 
        process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET, 
        { expiresIn: 3600 * 1000 }
      );
      
      // Set cookie
      res.cookie("jwt", accessToken, { 
        httpOnly: true, 
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV === 'production'
      });
      
      // Redirect to account management
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash()
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash("notice", "An error occurred during login.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav: await utilities.getNav(),
      errors: null,
      account_email: req.body.account_email || "",
      messages: req.flash()
    });
  }
}

/* ****************************************
*  Deliver account management view
* ************************************ */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    if (!res.locals.accountData) {
      req.flash("notice", "Please log in to access your account.");
      return res.redirect('/account/login');
    }

    const accountData = await accountModel.getAccountById(res.locals.accountData.account_id);
    
    res.render('account/management', {
      title: 'Account Management',
      nav,
      accountData,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
}


async function buildUpdate(req, res, next) {
  try {
    let nav = await utilities.getNav();
    

    const accountId = req.params.accountId;
    if (!accountId) {
      req.flash("notice", "Invalid account ID.");
      return res.redirect('/account/');
    }
    
    // Ensure user can only update their own account
    if (res.locals.accountData && res.locals.accountData.account_id != accountId) {
      req.flash("notice", "Access denied.");
      return res.redirect('/account/');
    }
    
    const accountData = await accountModel.getAccountById(accountId);
    
    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect('/account/');
    }
    
    res.render('account/update', {
      title: 'Update Account',
      nav,
      accountData,
      errors: null,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error in buildUpdate:', error);
    req.flash("notice", "An error occurred loading the update page.");
    res.redirect('/account/');
  }
}

/* ****************************************
*  Process account update
* ************************************ */
async function updateAccount(req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount && existingAccount.account_id != account_id) {
      req.flash('notice', 'Email already exists. Please use a different email.');
      return res.redirect(`/account/update/${account_id}`);
    }
    
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    
    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      delete accountData.account_password;
      
      const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600 * 1000 });
      
      req.flash('notice', 'Account updated successfully!');
      return res.redirect('/account/');
    }
    
    req.flash('notice', 'Failed to update account.');
    res.redirect(`/account/update/${account_id}`);
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process password update
* ************************************ */
async function updatePassword(req, res, next) {
  try {
    const { account_id, account_password } = req.body;
    
    if (!isValidPassword(account_password)) {
      req.flash('notice', 'Password must be at least 12 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return res.redirect(`/account/update/${account_id}`);
    }
    
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    
    if (updateResult) {
      req.flash('notice', 'Password updated successfully!');
      return res.redirect('/account/');
    }
    
    req.flash('notice', 'Failed to update password.');
    res.redirect(`/account/update/${account_id}`);
  } catch (error) {
    next(error);
  }
}

/* ****************************************
*  Process logout
* ************************************ */
function logout(req, res) {
  res.clearCookie('jwt');
  req.flash('notice', 'You have been logged out.');
  res.redirect('/');
}

/* ****************************************
*  Password validation helper - Updated with more special chars
* ************************************ */
function isValidPassword(password) {
  // Check minimum length
  if (password.length < 12) {
    console.log("Password too short:", password.length);
    return false;
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    console.log("No lowercase letter found");
    return false;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    console.log("No uppercase letter found");
    return false;
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    console.log("No number found");
    return false;
  }
  
  // Check for at least one special character (expanded list)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    console.log("No special character found");
    return false;
  }
  
  console.log("Password validation passed all checks");
  return true;
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildManagement,
  buildUpdate,
  updateAccount,
  updatePassword,
  logout 
};