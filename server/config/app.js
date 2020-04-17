const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const app = express();

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
