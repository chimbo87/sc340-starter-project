const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');
const utilities = require('../utilities');

// Inventory classification routes

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Vehicle type routes
router.get("/custom", utilities.handleErrors(invController.buildCustom));
router.get("/sedan", utilities.handleErrors(invController.buildSedan));
router.get("/suv", utilities.handleErrors(invController.buildSUV));
router.get("/truck", utilities.handleErrors(invController.buildTruck));

// Management routes
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

module.exports = router;