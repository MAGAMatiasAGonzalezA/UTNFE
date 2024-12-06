var pool = require('./bd');


async function getInventario() {
    var query = "SELECT * FROM inventario";
    var rows = await pool.query(query);
    return rows;
};

async function deleteInventarioById(id) {
    var query = "DELETE FROM inventario WHERE inventario_id = ?";
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

async function getArticuloById(id) {
    var query = "SELECT * FROM inventario WHERE inventario_id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

// async function modificarCantArticuloById(obj, id) {
//     try {
//         var query = "UPDATE inventario SET cantidad = ? WHERE inventario_id = ?";
//         var rows = await pool.query(query, [obj.cantidad, id]);
//         return rows;
//     } catch (error) {
//         console.log("algo anda mal");
//         throw error;
//     };
// };

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

module.exports = { getInventario, deleteInventarioById, insertItem, getArticuloById, modificarCantidad };