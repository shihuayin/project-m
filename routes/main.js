const express = require("express");
const router = express.Router();
const { redirectLogin } = require("./users");

router.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/notes");
  } else {
    res.render("index", { title: "Learning Notes System", user: null });
  }
});

//home page add, search and list link
router.get("/notes/add", redirectLogin, (req, res) => {
  res.redirect("/notes/add");
});

router.get("/notes/search", redirectLogin, (req, res) => {
  res.redirect("/notes/search");
});

router.get("/notes", redirectLogin, (req, res) => {
  const userId = req.session.userId;
  const username = req.session.username;

  const query = "SELECT * FROM notes WHERE user_id = ?";
  const queryParams = [userId];

  global.db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Failed to retrieve notes:", err);
      return res.status(500).send("Failed to retrieve notes");
    }

    res.render("notes", {
      username: username,
      notes: results,
    });
  });
});

//about page
router.get("/about", (req, res) => {
  res.render("about", { title: "About Learning Notes System" });
});

module.exports = router;
