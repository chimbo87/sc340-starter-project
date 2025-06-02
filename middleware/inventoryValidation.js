const { check, validationResult } = require('express-validator');

exports.inventoryValidationRules = [
    check('classification_id')
        .notEmpty()
        .withMessage('Classification is required'),
    check('inv_make')
        .trim()
        .notEmpty()
        .withMessage('Make is required'),
    check('inv_model')
        .trim()
        .notEmpty()
        .withMessage('Model is required'),
    check('inv_year')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Year must be valid'),
    check('inv_description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('inv_price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    check('inv_miles')
        .isInt({ min: 0 })
        .withMessage('Miles must be a positive number'),
    check('inv_color')
        .trim()
        .notEmpty()
        .withMessage('Color is required')
];

exports.validateInventory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('inventory/add-inventory', {
            title: 'Add New Inventory',
            errors: errors.array(),
            formData: req.body,
            message: null
        });
    }
    next();
};