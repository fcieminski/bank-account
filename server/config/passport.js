const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

module.exports = passport;
