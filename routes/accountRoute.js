const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');
const validation = require('../middleware/accountValidation');
const utilities = require('../utilities');
// GET routes
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);

// POST routes
router.post('/login', accountController.accountLogin);
router.post('/register', accountController.registerAccount);
// Route definitions
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.post('/register', 
  validation.registrationRules(),
  validation.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
router.post('/login',
  validation.loginRules(),
  validation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
router.get('/logout', accountController.logout);
router.get('/', authMiddleware.isLoggedIn, utilities.handleErrors(accountController.buildManagement));
router.get('/update/:accountId', authMiddleware.isLoggedIn, utilities.handleErrors(accountController.buildUpdate));
router.post('/update', 
  authMiddleware.isLoggedIn, 
  validation.updateRules(), 
  validation.checkUpdateData, 
  utilities.handleErrors(accountController.updateAccount)
);
router.post('/update-password', 
  authMiddleware.isLoggedIn, 
  validation.passwordRules(), 
  validation.checkPasswordData, 
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;