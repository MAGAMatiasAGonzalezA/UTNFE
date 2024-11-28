var express = require('express');
var router = express.Router();
var novedadesModel = require('./../../models/novedadesModel');

// para mostrar la BD
router.get('/', async function(req, res, next) {
    
    var novedades = await novedadesModel.getNovedades();
    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        novedades
    });
});


// para eliminar una fila
router.get('/eliminar/:id', async (req, res, next) => {
    const id = req.params.id;
    await novedadesModel.deleteNovedadById(id);
    res.redirect('/admin/novedades');
});


module.exports = router;