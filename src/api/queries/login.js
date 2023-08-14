// requerir de los attrs de la conexión para realizar las transacciónes SQL
const { mysql, pg } = require('../db');
// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const jwt = require('jsonwebtoken');
const { encrypt, convertToBase64, decodeBase64 } = require('../helpers/encrypt');

const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers');
const md5 = require('md5');
const { getError } = require('../helpers/errors');
/**
 * método para compara claves
 */
/**
 * Método para comprar la clave que front, con la clave de la database
 * @param {*} client clave que ingreso el cliente en el login
 * @param {*} db clave obtenida de la database
 * @returns 
 */
const compare = (client, db) => {
    return (compareSync(client, db))
}

/**
 * Método para validar sí los datos que se envian del login existen
 */
const validateUsuario = async (req, res) => {
    // variables para enviar 1 mensaje al hacer la petición 
    let auth = false, msg, token, status = '', clave_db;
    // obtener los datos
    const { dui, correo, clave } = req.body;
    try {
        const CLAVE = await execute('SELECT clave FROM empleados WHERE dui = ? AND correo = ?', [dui, correo])
        if (CLAVE) {

            // obtener clave cuando
            for (let i = 0; i < CLAVE.length; i++) {
                // obtener la clave
                clave_db = CLAVE[i]['clave'];
            }

            // compara claves'
            if (clave_db && compare(clave, clave_db)) {
                // clave correcta
                // obtener los datos del empleado encontrado

                // crear token
                token = await getToken(dui, correo, clave_db)
                // enviar el estado de la autenticación
                auth = true;
                // setear token a la cookie
                res.cookie('token', token, { httpOnly: true });

            } else {
                msg = 'Usuario o contraseña incorrecta';
                auth = false;
                token = '';
            }
            console.log('a')
            res.status(200).send({ msg, auth, token });
        }
    } catch (error) {
        console.log('error')
        console.log(error)
        res.status(500).send({error: getError(error)})
    }
}

/**
 * Método para obtener el cliente según los parametros especificados por el método
 * @param {*} dui dui del empleado a buscar
 * @param {*} correo correo del empleado a buscar
 * @param {*} clave clave del empleado a buscar
 * @returns retornar un arreglo de obj con los datos del cliente
 */
const getToken = async (dui, correo, clave) => {
    // realizar consulta
    let token, id;
    const EMPLEADO = await execute('SELECT id_empleado, nombres FROM empleados WHERE dui = ? AND correo = ? AND clave = ?', [dui, correo, clave])
    if (EMPLEADO) {
        // obtener binario del id
        let _empleado = getBinary(EMPLEADO, 'id_empleado');
        // recorrer los registros encontrados
        for (let i = 0; i < EMPLEADO.length; i++) {
            // crear obj con el nuevo id
            let id = {
                id_empleado: _empleado[i]
            }
            // funsionar obj con los datos recuperados con el de los ids limpiados
            Object.assign(EMPLEADO[i], id)
            // obtener id del empleado encontrado
        }
        // convertir id a base 64
        id = convertToBase64(EMPLEADO[0]['id_empleado']);
        token = jwt.sign(id, process.env.SECRET, { algorithm: 'HS512' })
        return token
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
            const ID = decodeBase64(jwt.decode(TOKEN));
            // realizar query
            const EMPLEADO = await execute('SELECT nombres, apellidos, dui, telefono, correo, alias  FROM empleados_view WHERE id_empleado = ?', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO[0]);
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
            // obtener id del empleado (deficando base64)
            const ID = decodeBase64(jwt.decode(TOKEN));
            // realizar query
            execute('SELECT alias FROM empleados_view WHERE id_empleado = ?', [ID])
                // retornar los datos sí la respuesta es la esperada
                .then(rows => { res.send(rows[0]); })
                .catch(rej => { console.log(rej); res.send({ error: getError(rej) }) })

        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Surgio un problema en el servidor' });
        }

    } else {
        res.status(401).send({ error: 'Debe iniciar sesión antes' })
    }
}

/**
 * Método para modificar los datos en la vista de configuración
 */
const change = async (req, res) => {
    // obtener token
    const TOKEN = req.headers.authorization;
    // verificar token
    if (TOKEN) {
        try {
            // obtener usuario
            const ID = decodeBase64(jwt.decode(TOKEN));
            // obtener los datos del cuerpo de la petición
            let { nombres, apellidos, dui, telefono, correo, clave, alias } = req.body;
            // verificar no sí viene clave nueva,  asignar la clave no midificada
            if (!clave) {
                execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, alias = ? WHERE id_empleado = ?',
                    [nombres, apellidos, dui, telefono, correo, alias, ID])
                    .then(() => {
                        res.status(201).send('Datos modificados')
                    }).catch(rej => {
                        console.log(rej); res.status(406).send({ error: getError(rej['errno']) });
                    })

            }
            else {
                clave = encrypt(clave);
                // console.log(clave);
                // console.log(await getClave(ID));
                execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, clave = ?, alias = ? WHERE id_empleado = ?',
                    [nombres, apellidos, dui, telefono, correo, clave, alias, ID])
                    .then(() => {
                        res.status(201).send("Datos modificados")
                    }).catch(rej => {
                        res.status(406).send({ error: getError(rej['errno']) });
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