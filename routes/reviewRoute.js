const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Review routes
router.get('/add/:invId', authMiddleware.isLoggedIn, reviewController.buildReviewForm);
router.post('/add', authMiddleware.isLoggedIn, reviewController.addReview);
router.get('/list/:invId', reviewController.showReviews);

module.exports = router;