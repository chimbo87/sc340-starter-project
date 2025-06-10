const jwt = require('jsonwebtoken');
require('dotenv').config();

/* Check if user is logged in */
exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    res.locals.loggedin = false;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );
    
    res.locals.loggedin = true;
    res.locals.accountData = decoded;
    req.accountData = decoded;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.clearCookie('jwt');
    res.locals.loggedin = false;
    next();
  }
};

/* Check if user is employee or admin */
exports.isEmployeeOrAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    req.flash('notice', 'Please log in to access this page.');
    return res.redirect('/account/login');
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET
    );
    
    if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
      res.locals.accountData = decoded;
      req.accountData = decoded;
      return next();
    }
    
    req.flash('notice', 'You must be an employee or admin to access this page.');
    return res.redirect('/account/');
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.clearCookie('jwt');
    req.flash('notice', 'Session expired. Please log in again.');
    return res.redirect('/account/login');
  }
};