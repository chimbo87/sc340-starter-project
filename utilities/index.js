const invModel = require("../models/inventory-model");
const Util = {}

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
 * Build vehicle cards HTML
 ************************** */

Util.buildVehicleCards = async function (vehicles) {
  let grid = '<div class="inventory-section"><h2>Our Vehicles</h2></div>';
  grid += '<div class="vehicle-grid">';
  
  if (vehicles.length === 0) {
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
 * Build vehicle detail HTML
 ************************** */
Util.buildVehicleDetail = async function (vehicle) {
  return `
    <div class="vehicle-detail">
<img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      
      <div class="detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p class="price">$${new Intl.NumberFormat().format(vehicle.inv_price)}</p>
        
        <div class="specs">
          <p><strong>Mileage:</strong> ${new Intl.NumberFormat().format(vehicle.inv_miles)} miles</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        </div>
        
        <div class="description">
          <h3>Description</h3>
          <p>${vehicle.inv_description}</p>
        </div>
      </div>
    </div>
  `;
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