// requerir de los attrs de la conexión para realizar las transacciónes SQL
const { mysql, pg } = require('../db');
// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const jwt = require('jsonwebtoken');
const { encrypt } = require('../helpers/encrypt');

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
        const CLAVE = await mysql.query('SELECT clave FROM empleados WHERE dui = $1 AND correo = $2',
            [dui, correo])

        // obtener la clave de la db
        let clave_db = CLAVE.rows[0];
        // comparar la clave de la db con la ingresada
        // verifiacar existenciar de dui y correo
        if (clave_db && compare(clave, clave_db.clave)) {
            // obtener id del empleado
            const EMPLEADO = await mysql.query('SELECT id_empleado, nombres FROM empleados WHERE dui = $1 AND correo = $2 AND clave = $3', [dui, correo, clave_db.clave])
            // crar token, enviando idempleado y texto secreto encryptado en md5 para mayor seguridad del sistema
            token = jwt.sign(EMPLEADO.rows[0].id_empleado, process.env.secret, { algorithm: 'HS512' })
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

/**
 * Método para obtener los datos del empleado según token para poder modificar
 */
const getConfig = async (req, res) => {
    const TOKEN = req.headers.authorization;
    if (TOKEN) {
        try {
            // obtener id del empleado
            const ID = jwt.decode(TOKEN);
            // realizar query
            const EMPLEADO = await mysql.query('SELECT nombres, apellidos, dui, telefono, correo, alias  FROM empleados_view WHERE id_empleado = $1', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO.rows[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).json({ error: 'Debe iniciar sesión antes' })
    }
}

/**
 * Método para mostrar datos pequeños del usuario
 */
const getInfo = async (req, res) => {
    const TOKEN = req.headers.authorization;
    if (TOKEN) {
        try {
            // obtener id del empleado
            const ID = jwt.decode(TOKEN);
            // realizar query
            const EMPLEADO = mysql.query('SELECT id_empleado, alias FROM empleados_view WHERE id_empleado = $1', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO.rows);

        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).json({ error: 'Debe iniciar sesión antes' })
    }
}

/**
 * Método para modificar los datos en la vista de configuración
 */
const change = async (req, res) => {
    let er, msg;
    // obtener token
    const TOKEN = req.headers.authorization;
    // verificar token
    if (TOKEN) {
        try {
            // obtener usuario
            const ID = jwt.decode(TOKEN);
            // obtener los datos del cuerpo de la petición
            let { nombres, apellidos, dui, telefono, correo, clave, alias } = req.body;
            // verificar no sí viene clave nueva,  asignar la clave no midificada
            if (!clave) {
                mysql.query('UPDATE empleados SET nombres = $1, apellidos = $2, dui = $3, telefono = $4, correo = $5, alias = $6 WHERE id_empleado = $7',
                    [nombres, apellidos, dui, telefono, correo, alias, ID], (err, result) => {
                        // verificar sí ha y un error
                        if (err) {

                            if (err.code === '23505') {
                                // enviar error el cliente
                                er = 'Dato unico ya registrado';
                            } else {
                                // sino el error no es un dato duplicado
                                er = err.message;
                            }
                            // enviar cualquier tipo de error identificado
                            res.json({ error: er });
                            // sí es ejecuta esto, el status 201 no se enviará
                            // return;                    

                        } else {
                            msg = 'Datos modificados';
                        }

                        res.status(201).send(msg);
                    })

            }
            else {
                clave = encrypt(clave);
                // console.log(clave);
                // console.log(await getClave(ID));
                mysql.query('UPDATE empleados SET nombres = $1, apellidos = $2, dui = $3, telefono = $4, correo = $5, clave = $6, alias = $7 WHERE id_empleado = $8',
                    [nombres, apellidos, dui, telefono, correo, clave, alias, ID], (err, result) => {
                        // verificar sí ha y un error
                        if (err) {

                            if (err.code === '23505') {
                                // enviar error el cliente
                                er = 'Dato unico ya registrado';
                            } else {
                                // sino el error no es un dato duplicado
                                er = err.message;
                            }
                            // enviar cualquier tipo de error identificado
                            res.json({ error: er });
                            // sí es ejecuta esto, el status 201 no se enviará
                            // return;                    

                        } else {
                            msg = 'Datos modificados';
                        }

                        res.status(201).send(msg);
                    })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).json({ error: 'Debe iniciar sesión antes' })
    }
}

// exportar modulos
module.exports = { validateUsuario, getInfo, getConfig, change };