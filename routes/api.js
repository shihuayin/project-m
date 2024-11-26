const express = require("express");
const router = express.Router();

router.get("/notes", (req, res, next) => {
  // select all notes
  const sqlquery = "SELECT * FROM notes";

  // query
  global.db.query(sqlquery, (err, result) => {
    if (err) {
      res.json({ error: "Failed to retrieve notes data", details: err });
      next(err);
    } else {
      // return json format
      res.json(result);
    }
  });
});

module.exports = router;
