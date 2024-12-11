var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

//mostar BD recetas
router.get('/', async function (req, res, next) {
    var recetas = await inventarioModel.getRecetas();

    // recetas.forEach(item => {
    //     item.cantidad = item.cantidad.toFixed(3);
    // });

    res.render('admin/recetas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        recetas
    });
});

// agregar receta
router.get('/agregarReceta', (req, res, next) => {
    res.render('admin/agregarReceta', {
        layout: 'admin/layout'
    })
})

router.post('/agregarReceta', async (req, res, next) => {
    try {
        if (req.body.receta_nombre != "" && req.body.ingredientes_cant != "" && req.body.procedimiento != "") {
            fila = {
                receta_nombre: req.body.receta_nombre,
                ingredientes_cant: req.body.ingredientes_cant,
                procedimiento: req.body.procedimiento,
                usuario: req.session.nombre,
                // id: req.params.id
            }
            await inventarioModel.insertReceta(fila);
            res.redirect('/admin/recetario/recetas');
            // res.redirect('/admin/recetario/ingredientesR');
        } else {
            res.render('admin/agregarReceta', {
                layout: 'admin/layout',
                error: true, message: "Todos los campos son requeridos"
            });
        }
    } catch (error) {
        console.log("UPS!!!", error);
        res.render('admin/agregarReceta', {
            layout: 'admin/layout',
            error: true, message: "No se pudo cargar la receta"
        });
    }
});

// para eliminar una fila
router.get('/eliminar/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        var datos = await inventarioModel.getRecetaById(id);
        if (datos.usuario === req.session.nombre) {
            await inventarioModel.deleteRecetaById(id);
            res.redirect('/admin/recetario/recetas');
        } else {
            var recetas = await inventarioModel.getAllRecetasByUsuario(req.session.nombre);
            res.render('admin/recetario/recetas', {
                recetas,
                layout: 'admin/layout',
                error: true,
                message: "Otro usuario cargo esta receta, solo puedes eliminar tus recetas"
            });
        };
    } catch (error) {
        console.log("UPS!!!", error);
        res.render('admin/recetario/recetas', {
            layout: 'admin/layout',
            error: true, message: "Algo salio mal, la receta sigue activa"
        });
    };
});

module.exports = router;