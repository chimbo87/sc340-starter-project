const pool = require("../database/");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'client') RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("registerAccount error: " + error);
    return null;
  }
}

/* *****************************
* Get account by email (MISSING FUNCTION)
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0]; 
  } catch (error) {
    console.error("getAccountByEmail error: " + error);
    return null;
  }
}

/* Get account by ID */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error: " + error);
    return null;
  }
}

/* Update account information */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING account_id",
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("updateAccount error: " + error);
    return false;
  }
}

/* Update password */
async function updatePassword(account_id, account_password) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING account_id",
      [account_password, account_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("updatePassword error: " + error);
    return false;
  }
}

module.exports = {
  registerAccount, 
  getAccountByEmail,  
  getAccountById, 
  updateAccount, 
  updatePassword 
};