const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const inventoryValidation = require("../middleware/inventoryValidation");
const classificationValidation = require("../middleware/classificationValidation");

// Inventory browsing routes (public)
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Inventory management routes (protected)
router.get("/manage", utilities.handleErrors(invController.buildManagement));
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  classificationValidation.classificationValidationRules,
  classificationValidation.validateClassification,
  utilities.handleErrors(invController.addClassification)
);
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  inventoryValidation.inventoryValidationRules,
  inventoryValidation.validateInventory,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
