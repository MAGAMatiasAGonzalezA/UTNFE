var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');


router.get('/', function (req, res, next) {
    res.render('admin/register', {
        layout: 'admin/layout'
    });
});

router.post('/', async (req, res, next) => {
    try {
        var usuario = req.body.usuario;
        var password = req.body.password;
        var passwordR = req.body.passwordR;

        if (!usuario || !password || !passwordR) {
            res.render('admin/register', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos deben completarce'
            });
            return
        }
        if (password !== passwordR) {
            res.render('admin/register', {
                layout: 'admin/layout',
                error: true,
                message: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.'
            });
            return
        } 
        
        var data = await usuariosModel.userexist(usuario);
        
        if (data != undefined) {
            res.render('admin/register', {
                layout: 'admin/layout',
                error: true,
                message: 'El usuario ya existe. Prueba con otro nombre de usuario.'
            });
            return
        } else {
            await usuariosModel.register(usuario, password);
            req.session.registerMenssage = 'Registro completado con exito, inicia secion aqui';
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