const pool = require('../database/');

/**
 * Add a new review for a vehicle
 */
async function addReview(account_id, inv_id, review_text, rating) {
  try {
    const sql = `
      INSERT INTO reviews (account_id, inv_id, review_text, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const data = await pool.query(sql, [account_id, inv_id, review_text, rating]);
    return data.rows[0];
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

/**
 * Get all reviews for a specific vehicle
 */
async function getReviewsByVehicle(inv_id) {
    try {
      const sql = `
        SELECT r.*, a.account_firstname, a.account_lastname
        FROM reviews r
        JOIN account a ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC`;
      const data = await pool.query(sql, [inv_id]);
      return data.rows;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }
  
  async function getAverageRating(inv_id) {
    try {
      const sql = 'SELECT AVG(rating) as average FROM reviews WHERE inv_id = $1';
      const data = await pool.query(sql, [inv_id]);

      return parseFloat(data.rows[0].average) || 0;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

/**
 * Calculate average rating for a vehicle
 */
async function getAverageRating(inv_id) {
  try {
    const sql = 'SELECT AVG(rating) as average FROM reviews WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0].average || 0;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw error;
  }
}

module.exports = {
  addReview,
  getReviewsByVehicle,
  getAverageRating
};