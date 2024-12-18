var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

//mostar BD recetas
router.get('/', async function (req, res, next) {
    var recetas

    if (req.query.q === undefined) {
        recetas = await inventarioModel.getRecetas();
    } else {
        recetas = await inventarioModel.buscarreceta(req.query.q);
    }

    res.render('admin/recetas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        recetas,
        iid_search: req.query.q !== undefined,
        q: req.query.q
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
        var recetas = await inventarioModel.getRecetas();
        var recetaExiste = false;
        for (let receta of recetas) {
            if (req.body.receta_nombre === receta.receta_nombre) {
                recetaExiste = true;
                break;
            }
        }
        if (recetaExiste) {
            res.render('admin/agregarReceta', {
                layout: 'admin/layout',
                error: true, message: "La receta ya se encuentra en el registro"
            });
        }
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

// para eliminar una fila de receta
router.get('/eliminar/:id', async (req, res, next) => {
    const id = req.params.id;
    console.log(req.session.nombre);
    try {
        var datos = await inventarioModel.getRecetaById(id);
        var recetas = await inventarioModel.getAllRecetasByUsuario(req.session.nombre);
        if (datos.usuario === req.session.nombre) {
            await inventarioModel.deleteRecetaById(id);
            res.redirect('/admin/recetario/recetas');
            //ACA NO ME FUNCIONA EL ELSE
            //VERIFICAR
        } else {
            console.log(recetas)
            res.render('admin/recetario/recetas', {
                recetas,
                layout: 'admin/layout',
                error: true,
                message: "Otro usuario cargo esta receta, solo puedes eliminar tus recetas"
            });
        };
    } catch (error) {
        console.log("UPS!!!", error);
        res.render('/admin/recetario/recetas', {
            layout: 'admin/layout',
            error: true, message: "Algo salio mal, la receta sigue activa"
        });
    };
});

//modificar receta
router.get('/modificarR/:id', async (req, res, next) => {
    var id = req.params.id;
    var receta = await inventarioModel.getRecetaById(id);
    // console.log(receta);
    res.render('admin//modificarR', {
        layout: 'admin/layout',
        receta
    });
});

router.post('/modificarR', async (req, res, next) => {
    try {
        var id = req.body.receta_id;
        var receta = await inventarioModel.getRecetaById(id);
        var receta_nombre = req.body.receta_nombre;
        var ingredientes_cant = req.body.ingredientes_cant;
        var procedimiento = req.body.procedimiento;
        console.log(id, receta_nombre, ingredientes_cant, procedimiento);
        if (receta_nombre == "") {
            receta_nombre = receta.receta_nombre;
        }
        if (ingredientes_cant == "") {
            ingredientes_cant = receta.ingredientes_cant;
        }
        if (procedimiento == "") {
            procedimiento = receta.procedimiento;
        }
        console.log(id, receta_nombre, ingredientes_cant, procedimiento)
        // actualizo la BD
        await inventarioModel.modificarReceta(receta.receta_id, receta_nombre, ingredientes_cant, procedimiento);
        res.redirect('/admin/recetario/recetas');
    } catch (error) {
        console.log("UPSS!!!", error);
        res.render('admin/modificarR', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pudo modificar algo salio mal.'
        });
    }
})

// agregar ingrediente en la receta
router.get('/ingredientesR/:id', async (req, res, next) => {
    var id = req.params.id;
    var receta = await inventarioModel.getRecetaById(id);
    var ingredientes = await inventarioModel.getIngredientesByRecetaId(id);

    console.log(receta);
    console.log(ingredientes);
   
    res.render('admin/ingredientesR', {
        layout: 'admin/layout',
        receta,
        ingredientes,
        error: true,
        message: 'No se pudo modificar algo salio mal.'
    });
})

router.post('/ingredientesR/:id', async (req, res, next) => {
    try {
        var id = req.body.receta_id;
        var receta = await inventarioModel.getRecetaById(id);
        var ingredientes = await inventarioModel.getIngredientesByRecetaId(id);
        var receta_item = req.body.item_nombre;
        var receta_cant = req.body.cantidad;
        var entradas = ingredientes.lenght;
        console.log(receta.ingredientes_cant);
        console.log(id, receta_item, receta_cant);
        if (receta_item == "") {
            receta_item = ingredientes.item_nombre;
        }
        if (receta_cant == "") {
            receta_cant = ingredientes.cantidad;
        }
        if (ingredientes.lenght === 0) {
            entradas = receta.ingredientes_cant;
            console.log(entradas)
            ingredientes = Array.from({ lenght: entradas}, () => ({
                item_nombre: "",
                cantidad: ""
            }))
        }
        console.log(receta_item, receta_cant)
        // actualizo la BD
        await inventarioModel.modificarIngredientes(id, receta_item, receta_cant);
        res.redirect('/admin/recetario/recetas');
    } catch (error) {
        console.log("UPSS!!!", error);
        res.render('admin/modificarR', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pudo modificar algo salio mal.'
        });
    }
})


module.exports = router;