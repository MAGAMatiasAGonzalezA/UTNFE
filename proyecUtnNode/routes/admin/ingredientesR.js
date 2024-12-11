var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

router.get('/', async function (req, res, next) {
    var ingred = await inventarioModel.insertIngredientes(req.body.receta_id);
    res.render('admin/recetas/ingredientesR', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        ingred
    });
})






module.exports = router;