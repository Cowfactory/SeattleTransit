const router = require('express').Router();
const User = require('../../models/User');

// Get all Users
router.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
        if(err) return next(err);
        res.status(200).json(users);
    })
})

// Get a User
router.get('/:id', function(req, res, next) {
    User.find({_id: req.params.id}, function(err, user) {
        if(err) return next(err);
        res.status(200).json(user);
    })
})


module.exports = router;