const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/notes");
  } else {
    res.render("index", { title: "Learning Notes System", user: null });
  }
});

//about page
router.get("/about", (req, res) => {
  res.render("about", { title: "About Learning Notes System" });
});

module.exports = router;
