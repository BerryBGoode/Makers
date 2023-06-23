// requerir del pool con los attrs de la conexión
const POOL = require('../db');

/**
 * Método para obtener las sucursales
 */
const get = async (req, res) => {
    try {
        // realizar query
        const SUCURSALES = await POOL.query('SELECT * FROM sucursales')
        // retornar los datos sí el estado es el esperado
        if (res.status(200)) res.send(SUCURSALES.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get }