const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2");
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");
const app = express();
const port = 8000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(expressSanitizer());

app.use(
  session({
    secret: "gold",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "shiyin",
  password: "shiyin",
  database: "daw_learn_notes",
});

//connect to database
db.connect((err) => {
  if (err) {
    console.error("Unable to connect to the database:", err.message);
    return;
  }
  console.log("Successfully connected to the database");
});
global.db = db;

const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

//user route
const { router: usersRoutes } = require("./routes/users");
app.use("/users", usersRoutes);

//note route
const notesRoutes = require("./routes/notes");
app.use("/notes", notesRoutes);

//api route
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// weather route
const weatherRoutes = require("./routes/weather");
app.use("/weather", weatherRoutes);

// start
app.listen(port, () => {
  console.log(`Node app listening on port ${port}!`);
});
