var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Vamos todos juntos');
});

module.exports = router;