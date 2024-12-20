var pool = require('./bd');


async function getInventario() {
    var query = "SELECT * FROM inventario";
    var rows = await pool.query(query);
    return rows;
};

async function getRecetas() {
    var query = "SELECT * FROM recetas";
    var rows = await pool.query(query);
    return rows;
}

async function deleteInventarioById(id) {
    var query = "DELETE FROM inventario WHERE inventario_id = ?";
    var rows = await pool.query(query, [id]);
    return rows;
}

async function deleteRecetaById(id) {
    var query = "DELETE FROM recetas WHERE receta_id = ?";
    var rows = await pool.query(query, [id]);
    return rows;
}

async function insertItem(obj) {
    try {
        var query = 'INSERT INTO inventario SET ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertReceta(obj) {
    try {
        var query = 'INSERT INTO recetas SET ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log("chan!!!", error);
        throw error;
    }
}

async function insertIngredientes(idR) {
    var query = 'SELECT * FROM recetas WHERE id = ?';
    var rows = await pool.query(query, [idR]);
    return rows;
}


async function getArticuloById(id) {
    var query = "SELECT * FROM inventario WHERE inventario_id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function getRecetaById(id) {
    var query = "SELECT * FROM recetas WHERE receta_id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function getAllRecetasByUsuario(usuario) {
    var query = "SELECT * FROM recetas WHERE usuario = ?";
    var rows = await pool.query(query, [usuario]);
    return rows;
}

async function modificarCantidad(id, nuevaCantidad) {
    try {
        const query = "UPDATE inventario SET cantidad = ?, fecha = NOW() WHERE inventario_id = ?";
        const rows = await pool.query(query, [nuevaCantidad, id]);
        return rows;
    } catch (error) {
        console.log("Error al modificar la cantidad:", error);
        throw error;
    }
}

async function modificarReceta(idR, nombre, cant, procedimiento) {
    const query = "UPDATE recetas SET receta_nombre = ?, ingredientes_cant = ?, procedimiento = ? WHERE receta_id = ?";
    const rows = await pool.query(query, [nombre, cant, procedimiento, idR]);
    return rows;
}

async function getIngredientesByRecetaId(id) {
    const query = 'SELECT item_nombre, cantidad FROM ingredientesreceta WHERE receta_id = ?';
    var rows = pool.query(query, [id]);
    return rows;
}

async function getItemNombre(item) {
    var query = "SELECT * FROM inventario WHERE item_nombre = ?";
    var rows = await pool.query(query, [item]);
    return rows[0];
}

async function buscarInventario(buscar) {
    var query = "SELECT * FROM inventario WHERE item_nombre LIKE ?";
    var rows = await pool.query(query, ['%' + buscar + '%']);
    return rows;
}

async function buscarreceta(buscar) {
    var query = "SELECT * FROM recetas WHERE receta_nombre LIKE ?";
    var rows = await pool.query(query, ['%' + buscar + '%']);
    return rows;
}

async function insertImgredienteReceta(ingredientes) {
    try {
        var query = 'INSERT INTO ingredientesreceta (item_nombre, cantidad, receta_id) VALUE (?, ?, ?)';
        var rows = await pool.query(query, [ingredientes.item_nombre, ingredientes.cantidad, ingredientes.receta_id]);
        return rows;
    } catch (error) {
        console.log("chan!!!", error);
        throw error;
    }
}


async function modificarIngredientes(idR, item, cant) {
    const query = "UPDATE ingredientesreceta SET item_nombre = ?, cantidad = ? WHERE receta_id = ?";
    const rows = await pool.query(query, [item, cant, idR]);
    return rows;
}



module.exports = {
    getInventario, deleteInventarioById, insertItem, getArticuloById, modificarCantidad,
    getRecetas, insertReceta, deleteRecetaById, getRecetaById, getAllRecetasByUsuario, insertIngredientes,
    modificarReceta, getIngredientesByRecetaId, getItemNombre, buscarInventario, buscarreceta,
    modificarIngredientes, insertImgredienteReceta
};