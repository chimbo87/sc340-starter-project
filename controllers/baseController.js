const utilities = require("../utilities");

exports.buildHome = async function(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("index", {
      title: "Home",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error building home view:", error);
    res.status(500).send("Internal Server Error");
  }
};