var pool = require('./bd');
var md5 = require('md5');


async function getUserAndPassword(user, password) {
    try {
        var query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ? LIMIT 1';
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function userexist(user) {
    try {
        var query =  'SELECT * FROM usuarios WHERE usuario = ? LIMIT 1';
        var rows = await pool.query(query, [user]);
        return rows[0];
    } catch (error) {
        console.log('Usuario no existe');
        throw error;
    }
};

async function register(user, password) {
    try {
        var query = 'INSERT INTO usuarios (usuario, password) VALUES (?, ?)';
        var rows = await pool.query(query, [user, md5(password)]);
        return userexist(user);
    } catch (error) {
        console.log('Ingreso no funciono');
        throw error;
    }
};


module.exports = { getUserAndPassword,  userexist, register}