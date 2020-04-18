const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const session = require("express-session");
const history = require("connect-history-api-fallback");
const app = express();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60 * 60 * 1000,
        },
    })
);
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));
app.use(history());

app.use(passport.initialize());
app.use(passport.session());

module.exports = app;
