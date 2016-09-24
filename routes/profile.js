var express = require('express');
var passport = require('passport');
var router = express.Router();


router.get('/querys', isLoggedIn, function(req, res) {
    res.render('querys.ejs', {
        user: req.user,
        querys : req.user.local.querys,
    });
});

router.get('/find', isLoggedIn, function(req, res) {

    res.render('find.ejs', {
        user: req.user,
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};