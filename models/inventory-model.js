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

/* ************************
 * Get classification by name
 ************************** */
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

/* ************************
 * Add new classification
 ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    throw error;
  }
}

/* ************************
 * Add new inventory item
 ************************** */
async function addInventory(inventoryData) {
  try {
    const sql = `INSERT INTO inventory (
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price,
      inv_miles, inv_color
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const values = [
      inventoryData.classification_id,
      inventoryData.inv_make,
      inventoryData.inv_model,
      inventoryData.inv_year,
      inventoryData.inv_description,
      inventoryData.inv_image,
      inventoryData.inv_thumbnail,
      inventoryData.inv_price,
      inventoryData.inv_miles,
      inventoryData.inv_color
    ];
    
    return await pool.query(sql, values);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getClassificationByName,
  addClassification,
  addInventory
};