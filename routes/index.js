const router = require('express').Router();
const User = require('../models/User');

router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});

// add bio to db - Not RESTful
router.post('/addBio', function(req, res, next) {
    // If no user logged in, reject
    if(!req.user) return next();
    User.findById(req.user._id, function(err, user) {
        if(err) return next(err);
        user.set({bio: req.body.bioText});
        user.save(err => {
            if(err) return next(err);
        })
    }) 
    User.findByIdAndUpdate(req.user._id, {bio: req.body.bioText});
    res.redirect('/');
});

module.exports = router;