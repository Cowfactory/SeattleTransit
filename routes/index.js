const router = require('express').Router();

router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});

router.get('/stopSearch', function(req, res, next) {
    res.render('stopSearch', { user: req.user, stops: null });
});

module.exports = router;