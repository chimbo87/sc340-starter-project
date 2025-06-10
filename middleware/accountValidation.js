const { check, validationResult } = require('express-validator');
const accountModel = require('../models/account-model');

/* **********************
 * Registration Data Validation Rules
 ********************* */
exports.registrationRules = () => [
  // firstname is required and must be string
  check('account_firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1 })
    .withMessage('First name must be at least 1 character'),

  // lastname is required and must be string
  check('account_lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1 })
    .withMessage('Last name must be at least 1 character'),

  // valid email is required and cannot already exist in the database
  check('account_email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if (emailExists) {
        throw new Error('Email exists. Please log in or use different email');
      }
    }),

  // password is required and must be strong password
  check('account_password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/, 'i')
    .withMessage('Password must include at least one uppercase, one lowercase, one number, and one special character')
];

/* **********************
 * Login Data Validation Rules
 ********************* */
exports.loginRules = () => [
  // valid email is required
  check('account_email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  // password is required
  check('account_password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

/* **********************
 * Update Account Data Validation Rules
 ********************* */
exports.updateRules = () => [
  check('account_firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1 })
    .withMessage('First name must be at least 1 character'),
  
  check('account_lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1 })
    .withMessage('Last name must be at least 1 character'),
  
  check('account_email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

/* **********************
 * Password Update Validation Rules
 ********************* */
exports.passwordRules = () => [
  check('account_password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/, 'i')
    .withMessage('Password must include at least one uppercase, one lowercase, one number, and one special character')
];

/* **********************
 * Check data and return errors or continue to registration
 ********************* */
exports.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await require('../utilities').getNav();
    res.render('account/register', {
      errors,
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************
 * Check data and return errors or continue to login
 ********************* */
exports.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await require('../utilities').getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* **********************
 * Check update data and return errors or continue
 ********************* */
exports.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require('../utilities').getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render('account/update', {
      errors,
      title: 'Update Account',
      nav,
      accountData,
    });
    return;
  }
  next();
};

/* **********************
 * Check password data and return errors or continue
 ********************* */
exports.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require('../utilities').getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render('account/update', {
      errors,
      title: 'Update Account',
      nav,
      accountData,
    });
    return;
  }
  next();
};