const express = require("express");
const router = express.Router();
const { redirectLogin } = require("./users");

// display  notes
router.get("/", redirectLogin, (req, res) => {
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

// search
router.get("/search", redirectLogin, (req, res) => {
  const { category, week } = req.query;

  if (!category && !week) {
    return res.render("search_notes", {
      notes: undefined,
      search: {
        category: "",
        week: "",
      },
    });
  }

  const query = "SELECT * FROM notes WHERE user_id = ?";
  const queryParams = [req.session.userId];

  if (category) {
    query += " AND category = ?";
    queryParams.push(category);
  }

  if (week) {
    query += " AND week = ?";
    queryParams.push(week);
  }

  global.db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Failed to retrieve notes:", err);
      return res.status(500).send("Failed to retrieve notes");
    }

    res.render("search_notes", {
      notes: results,
      search: {
        category: category || "",
        week: week || "",
      },
    });
  });
});

// add note
router.get("/add", redirectLogin, (req, res) => {
  res.render("add_note");
});

// add submit
router.post("/add", redirectLogin, (req, res) => {
  const userId = req.session.userId;
  const { title, content, category, week, latitude, longitude, location_name } =
    req.body;

  const query =
    "INSERT INTO notes (user_id, title, content, category, week,latitude, longitude, location_name) VALUES (?, ?, ?, ?, ?,?,?,?)";
  global.db.query(
    query,
    [
      userId,
      title,
      content,
      category,
      week,
      latitude,
      longitude,
      location_name,
    ],
    (err, result) => {
      if (err) {
        console.error("Failed to add note:", err);
        return res.status(500).send("Failed to add note");
      }

      res.redirect("/notes");
    }
  );
});

// delete
router.post("/delete/:id", redirectLogin, (req, res) => {
  const noteId = req.params.id;

  const query = "DELETE FROM notes WHERE id = ?";
  global.db.query(query, [noteId], (err, result) => {
    if (err) {
      console.error("Failed to delete note:", err);
      return res.status(500).send("Failed to delete note");
    }

    res.redirect("/notes");
  });
});

// edit note
router.get("/edit/:id", redirectLogin, (req, res) => {
  const noteId = req.params.id;

  const query = "SELECT * FROM notes WHERE id = ?";
  global.db.query(query, [noteId], (err, results) => {
    if (err) {
      console.error("Failed to retrieve note:", err);
      return res.status(500).send("Failed to retrieve note");
    }

    if (results.length === 0) {
      return res.status(404).send("Note not found");
    }

    res.render("edit_note", {
      note: results[0],
    });
  });
});

// deit note update
router.post("/edit/:id", redirectLogin, (req, res) => {
  const noteId = req.params.id;
  const { title, content, category, week } = req.body;

  const query =
    "UPDATE notes SET title = ?, content = ?, category = ?, week = ? WHERE id = ?";
  global.db.query(
    query,
    [title, content, category, week, noteId],
    (err, result) => {
      if (err) {
        console.error("Failed to update note:", err);
        return res.status(500).send("Failed to update note");
      }

      res.redirect("/notes");
    }
  );
});

module.exports = router;
