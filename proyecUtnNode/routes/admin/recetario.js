var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin/recetario', {
        layout: 'admin/layout',
        usuario: req.session.nombre
    });
});




module.exports = router;