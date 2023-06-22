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
        const CLAVE = await POOL.query('SELECT clave FROM empleados WHERE dui = $1 AND correo = $2',
            [dui, correo])
        // obtener la clave de la db
        let clave_db = CLAVE.rows[0];
        // método para compara claves
        const compare = (client, db) => {
            return (compareSync(client, db))
        }
        // comparar la clave de la db con la ingresada
        (compare(clave, clave_db.clave)) ? console.log('Usuario loggeado') : console.log('Usuario o contraseña incorrecta')
        
        console.log(clave_db.clave)
    } catch (error) {
        console.log(error)
    }
}

// exportar modulos
module.exports = { validateUsuario };