const express = require("express");
const router = express.Router();
const invController = require("../controllers/inventoryController");

// Classification route
router.get("/inv/type/:classificationId", invController.buildByClassificationId);

// Detail route
router.get("/inv/detail/:invId", invController.buildByInventoryId);

module.exports = router;