const express = require('express');
const router = express.Router();


router.use(express.static("public"));
router.use("/css", express.static(__dirname + "/public/css"));
router.use("/js", express.static(__dirname + "/public/js"));
router.use("/images", express.static(__dirname + "/public/images"));


router.get("/", (req, res) => {
  res.render("index", { 
    title: "Welcome to CSE Motors!"
  })
})

module.exports = router;