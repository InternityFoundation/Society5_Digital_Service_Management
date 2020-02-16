const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/database/user');
const userCtrl = require('../controllers/user/index');
const logger = require('./logger');

passport.use('login', new LocalStrategy({
  passReqToCallback: true,
}, ((req, email, password, done) => {
  userCtrl.validateUser({ email: email.toLowerCase(), password})
    .then((result) => {
      done(null, result);
    }).catch((err) => {
      done(null, false);
    });
})));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
