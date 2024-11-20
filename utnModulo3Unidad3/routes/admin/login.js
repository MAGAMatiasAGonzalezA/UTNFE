var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');


router.get('/', function(req, res, next) {
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

// para destruir la variable de sesion
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.render('admin/login', {
        layout: 'admin/layout'
    });
});

router.post('/', async (req, res, next) => {
    try {
        var usuario = req.body.usuario;
        var password = req.body.password;

        var data = await usuariosModel.getUserAndPassword(usuario, password);

        if (data != undefined) {
            req.session.id_usuario = data.id; // nombre de la columna
            req.session.nombre = data.usuario; // nombre de la fila
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            });
        } //cierra else
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;