var express = require('express');
var router = express.Router();
const middleware = require('../lib/middleware/index');

const checkSessionExist = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user || req.session) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } else {
    next();
  }
};

/* GET home page. */
router.get('/', checkSessionExist, (req, res, next) => {
  res.render('login', { layout: 'default' });
});

router.get('/dashboard', middleware.isAuthenticated, (req, res, next) => {
  res.render('user/dashboard', { isLogin: true, user: req.user });
});

/* Logout Function */
router.get('/logout', (req, res) => {
  res.redirect('/');
  req.logout();
  req.session.destroy();
});
module.exports = router;
