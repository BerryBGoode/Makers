// requerir de los attrs de la conexión para realizar las transacciónes SQL
const POOL = require('../db');
// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const token = require('jsonwebtoken');

/**
 * Método para validar sí los datos que se envian del login existen
 */
const validateUsuario = async (req, res) => {
    try {
        // obtener los datos
        const { dui, correo, clave } = req.body;
        // realizar consulta y enviando parametros
        const USUARIO = await POOL.query('SELECT clave FROM empleados WHERE dui = $1 AND correo = $2',
            [dui, correo, compareSync()])
    } catch (error) {

    }
}