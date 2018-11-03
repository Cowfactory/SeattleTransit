const router = require('express').Router();

router.get('/', function(req, res, next) {
    res.render('index', { user: req.user });
});


module.exports = router;