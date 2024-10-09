var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Información detallada, por si estas interesado');
});

module.exports = router;