var pool = require('./bd');


async function getInventario () {
    var query = "SELECT * FROM inventario";
    var rows = await pool.query(query);
    return rows;
};

async function deleteInventarioById(id) {
    var query = "DELETE FROM inventario WHERE inventario_id = ?";
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getInventario, deleteInventarioById };