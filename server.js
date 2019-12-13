const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const withAuth = require("./middleware");
const jwtSecret = require("./jwtSecret");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongo_uri = "mongodb://localhost/react-auth";
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/home", function(req, res) {
  res.send("Welcome!");
});

app.get("/api/cokeFormula", withAuth, function(req, res) {
  res.send("The recipe for Coca Cola is Pepsi.");
});

app.post("/api/register", function(req, res) {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering new user please try again.");
    } else {
      res
        .status(200)
        .send(`User added: username=${username} password=${password}`);
    }
  });
});

app.get("/logout", function(req, res) {
  res.clearCookie("token").sendStatus(200);
});

app.post("/api/authenticate", function(req, res) {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect username or password"
      });
    } else {
      user.isCorrectPassword(password, function(correctPassword) {
        if (!correctPassword) {
          res.status(401).json({
            error: "Incorrect username or password"
          });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, jwtSecret, {
            expiresIn: "1h"
          });
          res.cookie("token", token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

app.listen(12345);
