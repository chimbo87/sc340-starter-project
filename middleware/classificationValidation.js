const { check, validationResult } = require('express-validator');

exports.classificationValidationRules = [
    check('classification_name')
        .trim()
        .notEmpty()
        .withMessage('Classification name is required')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('Classification name cannot contain spaces or special characters')
];

exports.validateClassification = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('inventory/add-classification', {
            title: 'Add New Classification',
            errors: errors.array(),
            message: null
        });
    }
    next();
};