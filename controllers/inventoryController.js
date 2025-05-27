const utilities = require("../utilities");
const invModel = require("../models/inventory-model");

/* ************************
 * Build inventory by classification view
 ************************** */
async function buildByClassificationId(req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Vehicles";
  const grid = await utilities.buildVehicleCards(data);
  
  res.render("inventory/classification", {
    title: className,
    nav,
    grid,
    errors: null,
  });
}

/* ************************
 * Build vehicle detail view
 ************************** */

async function buildByInventoryId(req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();
    
    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        errors: { msg: "The requested vehicle could not be found." },
      });
    }
    
    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data, 
      errors: null,
    });
  }
async function buildClassificationByName(req, res, classificationName) {
    try {
      const classification = await invModel.getClassificationByName(classificationName);
      if (!classification) {
        throw new Error("Classification not found");
      }
      
      const vehicles = await invModel.getInventoryByClassificationId(classification.classification_id);
      const nav = await utilities.getNav();
      const grid = await utilities.buildVehicleCards(vehicles);
      
      res.render(classificationName.toLowerCase(), {
        title: `${classificationName} Vehicles`,
        nav,
        grid,
        errors: null,
      });
    } catch (error) {
      res.status(500).render("errors/error", {
        title: "Server Error",
        nav: await utilities.getNav(),
        errors: { msg: error.message },
      });
    }
  }
  
 
  async function buildCustom(req, res) {
    await buildClassificationByName(req, res, "Custom");
  }
  
  async function buildSedan(req, res) {
    await buildClassificationByName(req, res, "Sedan");
  }
  
  async function buildSUV(req, res) {
    await buildClassificationByName(req, res, "SUV");
  }
  
  async function buildTruck(req, res) {
    await buildClassificationByName(req, res, "Truck");
  }

module.exports = { 
  buildByClassificationId, 
  buildByInventoryId,
  buildCustom,
  buildSedan,
  buildSUV,
  buildTruck
};