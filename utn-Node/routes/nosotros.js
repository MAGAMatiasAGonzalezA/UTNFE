var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Nosotros un lugar donde nos conozcas');
});

module.exports = router;