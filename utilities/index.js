const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {  
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* ************************
 * Build classification select list
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let classificationList = 
        '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"';
        if (classification_id != null && row.classification_id == classification_id) {
            classificationList += " selected ";
        }
        classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
};

/* ************************
 * Build vehicle cards HTML
 ************************** */
Util.buildVehicleCards = async function (vehicles) {
  let grid = '<div class="inventory-section"><h2>Our Vehicles</h2></div>';
  grid += '<div class="vehicle-grid">';
  
  if (!vehicles || vehicles.length === 0) {
    grid += '<p>No vehicles found in this classification.</p>';
  } else {
    vehicles.forEach(vehicle => {
      grid += `
        <div class="vehicle-card">
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <div class="vehicle-info">
              <h3>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h3>
              <p class="price">$${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
            </div>
          </a>
        </div>
      `;
    });
  }
  
  grid += '</div>';
  return grid;
};

/* ************************
 * Error handling utilities
 ************************** */
Util.handleError = function(res, error) {
  console.error(error);
  return res.status(500).render("errors/error", {
    title: "Server Error",
    nav: this.getNav(),
    errors: { msg: error.message },
  });
};

Util.handleErrors = function(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(err => {
      this.handleError(res, err);
    });
  }.bind(this);
};

module.exports = Util;