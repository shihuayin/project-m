const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/notes");
  } else {
    res.render("index", { title: "Learning Notes System", user: null });
  }
});

module.exports = router;
