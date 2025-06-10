const { body, validationResult } = require("express-validator");

/* *****************************
 * Validation Rules
 * ***************************** */
const registationRules = () => {
  return [
    // Existing registration rules
  ];
};

const updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name.")
      .isAlpha()
      .withMessage("First name must contain only letters."),
    
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name.")
      .isAlpha()
      .withMessage("Last name must contain only letters."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* *****************************
 * Check Data
 * ***************************** */
const checkRegData = async (req, res, next) => {
  // Existing registration check
};

const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array();
    return res.render("account/update", {
      title: "Update Account",
      accountData: req.body,
      errors: message,
    });
  }
  next();
};

const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    return res.render("account/update", {
      title: "Update Account",
      accountData,
      errors: message,
    });
  }
  next();
};

module.exports = {
  registationRules,
  updateRules,
  passwordRules,
  checkRegData,
  checkUpdateData,
  checkPasswordData,
};