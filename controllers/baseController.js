const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function (req, res) {
  try {
    const nav = await utilities.getNav(); // Now matches updated function
    res.render("index", { title: "Home", nav });
  } catch (error) {
    console.error("buildHome error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = baseController