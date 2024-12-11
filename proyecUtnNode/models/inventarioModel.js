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

module.exports = {
    getInventario, deleteInventarioById, insertItem, getArticuloById, modificarCantidad,
    getRecetas, insertReceta, deleteRecetaById, getRecetaById, getAllRecetasByUsuario, insertIngredientes
};