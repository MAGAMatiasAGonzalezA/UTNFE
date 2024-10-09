var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Esta es la primer prueba')
})

module.exports = router;