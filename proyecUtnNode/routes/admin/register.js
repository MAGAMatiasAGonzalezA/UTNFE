var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');


router.get('/', function(req, res, next) {
    res.render('admin/register', {
        layout: 'admin/layout'
    });
});

router.post('/', async (req, res, next) => {
    try {
        var usuario = req.body.usuario;
        var password = req.body.password;
        var passwordR = req.body.passwordR;

        var data = await usuariosModel.userexist(usuario);

        if (password !== passwordR) {
            console.log('Las contraseñas deben ser iguales para el registro');
            res.render('admin/register', {
                layout: 'admin/layout',
                error: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.'
            });
        } else if (data != undefined){
            res.render('admin/register', {
                layout: 'admin/layout',
                error: 'El usuario ya existe. Prueba con otro nombre de usuario.'
            });
        } else {
            await usuariosModel.register(usuario, password);
            req.session.nombreUsuario = usuario;
            req.session.registerMenssage = 'Registro completado con exito';
            res.redirect('/admin/login');
        };

       
    } catch (error) {
        res.render('admin/register', {
            layout: 'admin/layout',
            error: 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.'
        });
    }
});

module.exports = router;