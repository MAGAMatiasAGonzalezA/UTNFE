var express = require('express');
var router = express.Router();
var inventarioModel = require('./../../models/inventarioModel');

// mostrar BD
router.get('/', async function (req, res, next) {
    var inventario = await inventarioModel.getInventario();

    inventario = inventario.map(function (invent) {
        // console.log(inventario);
        var fechaObj = new Date(invent.fecha); //creo el objeto fecha
        var fecha = `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()} ${fechaObj.getHours()}:${fechaObj.getMinutes()}`
        return { ...invent, fecha }
    })
    //agrego 3 decimal a la columna cantidad
    inventario.forEach(item => {
        item.cantidad = item.cantidad.toFixed(3);
    })

    // console.log(inventario);
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

// agregar item
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    })
})

router.post('/agregar', async (req, res, next) => {
    try {
        if (req.body.item_nombre != "" && req.body.cantidad != "") {
            fila = {
                item_nombre: req.body.item_nombre,
                cantidad: req.body.cantidad,
                usuario: req.session.nombre
            }
            await inventarioModel.insertItem(fila);
            res.redirect('/admin/recetario/inventario');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true, message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true, message: 'No se cargo nada'
        });
    }
});

// modificar cantidad
router.get('/modificar/:id', async (req, res, next) => {
    let id = req.params.id;
    let item = await inventarioModel.getArticuloById(id);
    console.log(item)
    res.render('admin/modificar', {
        layout: 'admin/layout',
        item
    });
});

router.post('/modificar', async (req, res, next) => {
    try {
        if (req.body.cantidad_nueva != "") {

            const inventario_id = req.body.inventario_id;
            const cantidadNueva = parseFloat(req.body.cantidad_nueva); // convierto a decimal el número
            const operacion = req.body.operacion;
            console.log(cantidadNueva)
            // Obtengo el item actual para calcular la nueva cantidad
            const articulo = await inventarioModel.getArticuloById(inventario_id);
           
            // verifico que la cantidad no sea negativa
            if (cantidadNueva < 0) {
                return res.render('admin/modificar', {
                    layout: 'admin/layout',
                    error: true,
                    message: 'La cantidad no puede ser negativa.'
                });
            }

            // Calculo la nueva cantidad
            let nuevaCantidad = articulo.cantidad;
            if (operacion === "sumar") {
                nuevaCantidad += cantidadNueva;
            } else if (operacion === "restar") {
                nuevaCantidad -= cantidadNueva;
            }

            // Actualizo en la base de datos
            await inventarioModel.modificarCantidad(inventario_id, nuevaCantidad);

            res.redirect('/admin/recetario/inventario');

        } else {
            res.render('admin/modificar', {
                layout: 'admin/layout',
                error: true, message: 'La cantidad es requerida requeridos'
            });
        }

    } catch (error) {
        console.error(error);
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se pudo modificar la cantidad.'
        });
    }
});

module.exports = router;