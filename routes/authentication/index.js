const express = require('express');
const passport = require('passport');
require('../../lib/passportAuth');
const router = express.Router();

/* Handle patient Login POST */
router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.send({ status: false, message: 'Your email or password was entered incorrectly' });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ status: true, message: 'Successfully logged in!', url: '/dashboard' });
        });
    })(req, res, next);
});
module.exports = router;