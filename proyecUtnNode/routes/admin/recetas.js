var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

//mostar BD recetas
router.get('/', async function (req, res, next) {
    var recetas
    // var ingredientes
    // var items

    if (req.query.q === undefined) {
        recetas = await inventarioModel.getRecetas();
    } else {
        recetas = await inventarioModel.buscarreceta(req.query.q);
    }
    // for (let i = 0; i < recetas.length; i++) {
    //     ingredientes = await inventarioModel.getIngredientesByRecetaId(recetas[i].receta_id);
    //     items.push({item_nombre: ingredientes.item_nombre})
    // }
    // console.log(items);

    res.render('admin/recetas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        recetas,
        id_search: req.query.q !== undefined,
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
        // if (datos.usuario === req.session.nombre) {
            await inventarioModel.deleteRecetaById(id);
            res.redirect('/admin/recetario/recetas');
            //ACA NO ME FUNCIONA EL ELSE
            //VERIFICAR
        // } else {
        //     console.log(recetas)
        //     res.render('admin/recetario/recetas', {
        //         recetas,
        //         layout: 'admin/layout',
        //         error: true,
        //         message: "Otro usuario cargo esta receta, solo puedes eliminar tus recetas"
        //     });
        //};
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
        console.log("cantidad de ingredientes: ", ingredientes_cant);
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
    req.session.receta_id =  req.params.id;
    var receta = await inventarioModel.getRecetaById(req.session.receta_id);
    var ingredientes = await inventarioModel.getIngredientesByRecetaId(req.session.receta_id);
    

    if (receta.ingredientes_cant !== ingredientes.length) {
        for (let i = 0; i < receta.ingredientes_cant; i++) {
            if (!ingredientes[i]) {
                ingredientes[i] = {
                    item_nombre: "",
                    cantidad: "",
                    receta_id: req.session.receta_id
                };
            }
        }
    }
    // if (ingredientes.length < 1) {
    //     ingredientes = [];
    //     for (let i = 0; i < receta.ingredientes_cant; i++) {
    //         ingredientes.push({
    //             item_nombre: "",
    //             cantidad: "",
    //             receta_id: id
    //         })
    //     }
  

    // console.log(receta.ingredientes_cant);
    // console.log(ingredientes);

    res.render('admin/ingredientesR', {
        layout: 'admin/layout',
        receta,
        ingredientes,
        // error: true,
        // message: 'No se pudo modificar algo salio mal.'
    });
})

router.post('/ingredientesR', async (req, res, next) => {
    try {
        var id = req.session.receta_id
        var receta = await inventarioModel.getRecetaById(id);
        var ingredientes = await inventarioModel.getIngredientesByRecetaId(id);
        // console.log(id);
        

        console.log(receta.ingredientes_cant);
        // if (receta.ingredientes_cant !== ingredientes.length) {
            for (let i = 0; i < receta.ingredientes_cant; i++) {
                if (!ingredientes[i]) {
                    ingredientes[i] = {
                        item_nombre: "",
                        cantidad: "",
                        receta_id: id
                    };
                } else {
                    ingredientes[i].receta_id = id;
                }
                if (req.body.item_nombre[i] !== undefined) {
                    ingredientes[i].item_nombre = req.body.item_nombre[i];
                } else {
                    ingredientes[i].item_nombre = ingredientes[i].item_nombre;
                }
                if (req.body.cantidad[i] !== undefined) {
                    ingredientes[i].cantidad = req.body.cantidad[i];
                } else {
                    ingredientes[i].cantidad = ingredientes[i].cantidad;
                }
            }
        
        console.log(ingredientes);
        // if (ingredientes.length < 1) {
        //     ingredientes = [];
        // console.log("entrada de usuario", ingredientes);
        for (let i = 0; i < ingredientes.length; i++) {
            await inventarioModel.modificarIngredientes(ingredientes[i]);
            // console.log("ingredientes insertados", ingredientes[i]);
        }
        //}

        // if (receta_item == "") {
        //     receta_item = ingredientes.item_nombre;
        // }
        // if (receta_cant == "") {
        //     receta_cant = ingredientes.cantidad;
        // }

        // console.log("");
        req.session.receta_id = null;
        // actualizo la BD
        // try {
        // await inventarioModel.insertImgredienteReceta()
        // }
        //await inventarioModel.modificarIngredientes(id, receta_item, receta_cant);
        res.redirect('/admin/recetario/recetas');
    } catch (error) {
        req.session.receta_id = null;
        console.log("UPSS!!! Error al insertar ingredientes:", error);
        res.redirect('/admin/recetario/recetas');
        // res.render('admin/modificarR', {
        //     layout: 'admin/layout',
        //     error: true,
        //     message: 'No se pudo modificar algo salio mal.'
        // });
    }
})


module.exports = router;