const pool = require("../database/");

/* ************************
 * Get all classifications
 ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ************************
 * Get inventory by classification_id
 ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
    return [];
  }
}

/* ************************
 * Get vehicle by inv_id
 ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
    return null;
  }
}

async function getClassificationByName(classification_name) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name = $1",
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getClassificationByName error: " + error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getClassificationByName,
};
