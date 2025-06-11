const reviewModel = require('../models/review-model');
const utilities = require('../utilities');

/**
 * Show review form
 */
async function buildReviewForm(req, res) {
  try {
    const inv_id = req.params.invId;
    const nav = await utilities.getNav();
    res.render('reviews/add-review', {
      title: 'Add Review',
      nav,
      inv_id,
      errors: null
    });
  } catch (error) {
    res.status(500).render('errors/error', {
      title: 'Server Error',
      nav: await utilities.getNav(),
      errors: { msg: error.message }
    });
  }
}

/**
 * Handle review submission
 */
async function addReview(req, res) {
  try {
    const { inv_id, review_text, rating } = req.body;
    const account_id = req.accountData.account_id;

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      req.flash('notice', 'Rating must be between 1 and 5');
      return res.redirect(`/reviews/add/${inv_id}`);
    }

    await reviewModel.addReview(account_id, inv_id, review_text, rating);
    req.flash('notice', 'Thank you for your review!');
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    res.status(500).render('errors/error', {
      title: 'Server Error',
      nav: await utilities.getNav(),
      errors: { msg: error.message }
    });
  }
}

/**
 * Show all reviews for a vehicle
 */
async function showReviews(req, res) {
  try {
    const inv_id = req.params.invId;
    const reviews = await reviewModel.getReviewsByVehicle(inv_id);
    const averageRating = await reviewModel.getAverageRating(inv_id);
    const nav = await utilities.getNav();

    res.render('reviews/list-reviews', {
      title: 'Vehicle Reviews',
      nav,
      reviews,
      averageRating,
      inv_id
    });
  } catch (error) {
    res.status(500).render('errors/error', {
      title: 'Server Error',
      nav: await utilities.getNav(),
      errors: { msg: error.message }
    });
  }
}

module.exports = {
  buildReviewForm,
  addReview,
  showReviews
};