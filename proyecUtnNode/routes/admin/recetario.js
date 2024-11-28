var express = require('express');
var router = express.Router();
var inventarioRouter = require('./inventario');

router.get('/', function(req, res, next) {
    res.render('admin/recetario', {
        layout: 'admin/layout',
        usuario: req.session.nombre
    });
});

router.use('/inventario', inventarioRouter);

module.exports = router;