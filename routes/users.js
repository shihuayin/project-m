const express = require("express");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const expressSanitizer = require("express-sanitizer");
const router = express.Router();

// moddleware
router.use(expressSanitizer());

function redirectLogin(req, res, next) {
  if (!req.session.userId) {
    const isNotesPath = req.originalUrl.endsWith("/notes");

    //Use './users/login" if path is "/notes" otherwise use "../users/login"
    const redirectPath = isNotesPath ? "./users/login" : "../users/login";
    res.redirect(redirectPath);
  } else {
    next();
  }
}

// register
router.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

// deal with register name emial password etc
router.post(
  "/register",
  [
    check("username")
      .matches(/^(?=.{3,15}$)[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/)
      .withMessage(
        "Username must be 3-15 characters long and can include letters, numbers, underscores (_), and dots (.), and cannot start or end with a special character."
      )
      .notEmpty()
      .withMessage("Username is required."),
    check("first_name")
      .isAlpha()
      .withMessage("First name must contain only letters.")
      .notEmpty()
      .withMessage("First name is required."),
    check("last_name")
      .isAlpha()
      .withMessage("Last name must contain only letters.")
      .notEmpty()
      .withMessage("Last name is required."),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .notEmpty()
      .withMessage("Email is required."),
    check("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter."),
  ],
  async (req, res) => {
    req.body.username = req.sanitize(req.body.username);
    req.body.first_name = req.sanitize(req.body.first_name);
    req.body.last_name = req.sanitize(req.body.last_name);
    req.body.email = req.sanitize(req.body.email);
    req.body.password = req.sanitize(req.body.password);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", { errors: errors.array() });
    }

    const { username, first_name, last_name, email, password } = req.body;

    try {
      // hash
      const hashedPassword = await bcrypt.hash(password, 10);

      // inser
      const query =
        "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)";
      global.db.query(
        query,
        [username, first_name, last_name, email, hashedPassword],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.send("Email or username already registered.");
            }
            return res.send("Error registering user: " + err.message);
          }
          res.send(
            `Registration successful. Please <a href='/users/login'>click here to login</a>.`
          );
        }
      );
    } catch (error) {
      res.send("Error during registration: " + error.message);
    }
  }
);

// login
router.get("/login", (req, res) => {
  res.render("login");
});

// deal with login
router.post("/login", async (req, res) => {
  req.body.email = req.sanitize(req.body.email);
  req.body.password = req.sanitize(req.body.password);

  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    global.db.query(query, [email], async (err, results) => {
      if (err) {
        return res.send("Error occurred: " + err.message);
      }

      if (results.length === 0) {
        return res.send(
          "No user found with that email. Please <a href='/users/register'>register</a> first."
        );
      }

      const user = results[0];

      // compare password
      const match = await bcrypt.compare(password, user.hashed_password);
      if (!match) {
        return res.send("Incorrect password. Please try again.");
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      res.redirect("../notes");
    });
  } catch (error) {
    res.send("Error during login: " + error.message);
  }
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out: " + err.message);
    }
    res.redirect("../users/login");
  });
});

module.exports = { router, redirectLogin };
