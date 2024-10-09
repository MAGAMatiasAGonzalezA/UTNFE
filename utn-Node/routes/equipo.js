var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Trabajar en cojunto, llegar a meta juntos');
});

module.exports = router;