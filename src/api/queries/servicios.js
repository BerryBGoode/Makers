// requerir la pool con los datos de la conexión
const POOL = require('../db');
// requerir de unos métodos de los queries de productos
const { producto } = require('./productos')


/**
 * Método para obtener los tipos de servicios 
 */
const getServicios = async (req, res) => {
    try {
        // declarar valor diferente al que se espera
        let producto = 'Producto';
        // realizar query
        const TIPOS = await POOL.query('SELECT * FROM tipos_servicios WHERE NOT tipo_servicio = $1', [producto])
        // verificar sí la respuesta es la esperada
        if(res.status(200)) res.send(TIPOS.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener todos los servicios
 */
const get = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = { get, getServicios}