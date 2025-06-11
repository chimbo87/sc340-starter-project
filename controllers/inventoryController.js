const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const reviewModel = require('../models/review-model');

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
  try {
    const inv_id = req.params.invId;
    const vehicle = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();
    
    if (!vehicle) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        errors: { msg: "The requested vehicle could not be found." },
      });
    }
    
    // Get reviews and average rating
    const reviews = await reviewModel.getReviewsByVehicle(inv_id);
let averageRating = await reviewModel.getAverageRating(inv_id);
averageRating = parseFloat(averageRating) || 0; 
    
    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      reviews, 
      averageRating, 
      loggedin: res.locals.loggedin || false,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ************************
 * Build classification by name view
 ************************** */
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

/* ************************
 * Build management view
 ************************** */
async function buildManagement(req, res, next) {
  try {
    res.render("inventory/management", {
      title: "Inventory Management",
      message: req.flash('message') || null
    });
  } catch (error) {
    next(error);
  }
}

/* ************************
 * Build add classification view
 ************************** */
async function buildAddClassification(req, res, next) {
  try {
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      message: req.flash('message') || null,
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

/* ************************
 * Process add classification
 ************************** */
/* ************************
 * Process add classification
 ************************** */
async function addClassification(req, res, next) {
  try {
    const { classification_name } = req.body;
    
    // Validation - check if classification_name is provided
    if (!classification_name) {
      req.flash('message', 'Classification name is required');
      return res.redirect('/inv/add-classification');
    }
    
    // Check if classification already exists
    const existingClassification = await invModel.getClassificationByName(classification_name);
    if (existingClassification) {
      req.flash('message', 'Classification already exists');
      return res.redirect('/inv/add-classification');
    }
    
    // Insert into database
    await invModel.addClassification(classification_name);
    
    // Rebuild navigation with new classification
    const nav = await utilities.getNav();
    
    req.flash('message', `Classification "${classification_name}" added successfully!`);
    res.redirect('/inv/add-classification');
  } catch (error) {
    console.error('Error adding classification:', error);
    req.flash('message', 'Failed to add classification');
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      message: req.flash('message'),
      errors: [{ msg: error.message || 'Database error occurred' }]
    });
  }
}

/* ************************
 * Build add inventory view
 ************************** */
async function buildAddInventory(req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList();
    const defaultFormData = {
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
      classification_id: ''
    };

    res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      classificationList,
      message: req.flash('message') || null,
      errors: null,
      formData: defaultFormData
    });
  } catch (error) {
    next(error);
  }
}

/* ************************
 * Process add inventory
 ************************** */

async function addInventory(req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body;

    // Basic validation
    if (!classification_id) {
      req.flash('message', 'Please select a classification');
      return res.redirect('/inv/add-inventory');
    }

    // Create inventory data object
    const invData = {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: inv_image || '/images/vehicles/no-image.png',
      inv_thumbnail: inv_thumbnail || '/images/vehicles/no-image-tn.png',
      inv_price,
      inv_miles,
      inv_color
    };

    // Insert into database
    const result = await invModel.addInventory(invData);
    
    req.flash('message', `Inventory item "${inv_make} ${inv_model}" added successfully!`);
    res.redirect('/inv/add-inventory');
  } catch (error) {
    console.error('Error adding inventory:', error);
    
    const classificationList = await utilities.buildClassificationList(req.body.classification_id);
    
    req.flash('message', 'Failed to add inventory item');
    res.render('inventory/add-inventory', {
      title: 'Add New Inventory',
      classificationList,
      message: req.flash('message'),
      errors: [{ msg: error.message || 'Database error occurred' }],
      formData: req.body
    });
  }
}

/* ************************
 * Classification-specific views
 ************************** */
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
  buildTruck,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
};