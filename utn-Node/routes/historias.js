var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Contadas por sus propios protagonistas');
});

module.exports = router;