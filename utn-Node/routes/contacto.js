var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Aca nos contactamos');
});

module.exports = router;
