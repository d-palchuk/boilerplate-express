const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

console.log("Hello World");

// MIDDLEWARES
app.use((req, res, next) => {
  console.log(req.method, req.path, " - ", req.ip);

  next();
});

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
  let response = "Hello json";

  if (process.env.MESSAGE_STYLE === "uppercase") {
    response = "Hello json".toUpperCase();
  }

  res.send({ message: response });
});

app.get("/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res, next) => {
    res.send({ time: req.time });
  }
);

app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

app.route("/name")
  .get((req, res, next) => {
    res.json({ name: `${req.query.first} ${req.query.last}` });
  })
  .post((req, res, next) => {
    res.json({ name: `${req.body.first} ${req.body.last}` });
  });

module.exports = app;
