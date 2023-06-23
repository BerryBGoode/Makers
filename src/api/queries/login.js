// requerir de los attrs de la conexión para realizar las transacciónes SQL
const POOL = require('../db');
// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const jwt = require('jsonwebtoken');

/**
 * método para compara claves
 */
const compare = (client, db) => {
    return (compareSync(client, db))
}

/**
 * Método para validar sí los datos que se envian del login existen
 */
const validateUsuario = async (req, res) => {
    // variables para enviar 1 mensaje al hacer la petición 
    let auth = false, msg, token, status = '';
    try {
        // obtener los datos
        const { dui, correo, clave } = req.body;
        // realizar consulta y enviando parametros
        const CLAVE = await POOL.query('SELECT clave FROM empleados WHERE dui = $1 AND correo = $2',
            [dui, correo])

        // obtener la clave de la db
        let clave_db = CLAVE.rows[0];
        // comparar la clave de la db con la ingresada
        // verifiacar existenciar de dui y correo
        if (clave_db && compare(clave, clave_db.clave)) {
            // obtener id del empleado
            const EMPLEADO = await POOL.query('SELECT id_empleado, nombres FROM empleados WHERE dui = $1 AND correo = $2 AND clave = $3', [dui, correo, clave_db.clave])
            // crar token, enviando idempleado y texto secreto encryptado en md5 para mayor seguridad del sistema
            token = jwt.sign(EMPLEADO.rows[0].id_empleado, process.env.secret, {algorithm: 'HS512'})
            // retornar estado d{e autenticación
            auth = true;
            // retornar mensaje
            msg = 'Bienvenido ' + EMPLEADO.rows[0].nombres;
            // setear token a la cookie
            res.cookie('token', token, { httpOnly: true });
        }
        else {
            // retornar mensaje
            msg = 'Datos o contraseña incorrecta'
            // retornar estado de autencicación
            auth = false;
            // token vacío
            token = '';
        }
        // enviar respuesta al cliente    
        res.status(200).send({ msg, auth, token });
    } catch (error) {
        console.log(error);
    }
}

// exportar modulos
module.exports = { validateUsuario };