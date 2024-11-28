var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

// mostrar BD
router.get('/', async function(req, res, next) {
    var inventario = await inventarioModel.getInventario();
    res.render('admin/inventario', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        inventario
    });
});

// para eliminar una fila
router.get('/eliminar/:id', async (req, res, next) => {
    const id = req.params.id;
    await inventarioModel.deleteInventarioById(id);
    res.redirect('/admin/recetario/inventario');
});




module.exports = router;