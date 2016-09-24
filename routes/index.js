var express = require('express');
var passport = require('passport');
var router = express.Router();
var session = require('express-session');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user: req.user });
});

router.get('/querys', isLoggedIn, function(req, res) {
    res.render('querys.ejs', { user: req.user });
});

router.get('/find', isLoggedIn, function(req, res) {
    res.render('find.ejs', { user: req.user });
});

router.get('/logout', function(req, res){
    req.logOut();
    res.clearCookie('connect.sid');
    req.session= null;
    /*req.session.destroy(function (err) {
        if(err)console.log(err.name);*/
        res.redirect('/'); //Inside a callback… bulletproof!
   /* });*/
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};