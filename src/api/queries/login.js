// requerir de los attrs de la conexión para realizar las transacciónes SQL
const POOL = require('../db');

/**
 * Método para validar sí los datos que se envian del login existen
 */
const validateUsuario = async (req, res) => {
    try {
        // obtener los datos
        const { dui, correo, clave } = req.body;
        // realizar consulta y enviando parametros
        const USUARIO = await POOL.query('SELECT id_empleado FROM empleados WHERE dui = $1 AND correo = $2 AND clave = $3',
            [dui, correo, clave])
    } catch (error) {

    }
}