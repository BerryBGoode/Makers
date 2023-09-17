// requerir de los attrs de la conexión para realizar las transacciónes SQL
const { mysql, pg } = require('../db');
// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const jwt = require('jsonwebtoken');
const { encrypt, convertToBase64, } = require('../helpers/encrypt');

const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers');
const md5 = require('md5');
const { getError } = require('../helpers/errors');
/**
 * método para compara claves
 */
/**
 * Método para comprar la clave que front, con la clave de la database
 * @param {*} client clave que ingreso el cliente en el body de la petición
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
    const { dui, correo, clave, alias } = req.body;
    try {
        const CLAVE = await execute('SELECT clave FROM empleados WHERE dui = ? AND correo = ? AND alias = ? AND estado = ?', [dui, correo, alias, 1])
        if (CLAVE) {

            // obtener clave cuando
            for (let i = 0; i < CLAVE.length; i++) {
                // obtener la clave
                clave_db = CLAVE[i]['clave'];
            }

            // compara claves'
            if (clave_db && compare(clave, clave_db)) {

                // reinciar a 0 los intentos
                await execute('UPDATE empleados SET intentos = 0 WHERE dui = ? AND correo = ? AND alias = ? AND estado = ?', [dui, correo, alias, 1])
                // clave correcta
                // obtener los datos del empleado encontrado 
                // crear token
                token = await getToken(dui, correo, clave_db)
                // enviar el estado de la autenticación
                auth = true;
                // setear token a la cookie
                res.cookie('token', token, { httpOnly: true });

            } else {
                // Apartir de aquí empizar los intentos 

                // obteniendo el dui y usuario a partir del dui, para verificar sí existe empleado con esos datos
                const DUI = await execute('SELECT alias FROM empleados WHERE dui = ?', [dui])
                const CORREO = await execute('SELECT alias FROM empleados WHERE correo = ?', [correo])
                const USUARIO = await execute('SELECT alias FROM empleados WHERE alias = ?', [alias])

                // veirficar cuando todos los datos estan agregandos ya a la db
                if (DUI.length > 0 && CORREO.length > 0 && USUARIO.length > 0) {
                    switch (true) {
                        // verficando cuando el alias del correo y dui son iguales
                        // pero el ingresado por el usuario no
                        case DUI[0].alias === CORREO[0].alias && DUI[0].alias !== USUARIO[0].alias:
                            // agregar suplantación
                            agregandoSuplantacionByAlias(alias);
                            // agregar 1 intento por correo y dui
                            agregandoIntentoByNotAlias(correo, dui)
                            // Agregar intento fallido para el usuario con alias DUI[0].alias
                            break;

                        // cuando se puso el correo de un empleado o usuario existente direferente del que se quiere acceder
                        case DUI[0].alias === alias && CORREO[0].alias !== alias:
                            // agregar notificación de suplantación
                            agregandoSuplantacionByCorreo(correo);
                            // agregando 1 intento
                            agregarIntentoByDui(dui, alias);
                            break;

                        // cuando se puso el dui de un empleado existente (suplantación)
                        case CORREO[0].alias === alias && DUI[0].alias !== alias:
                            // agregando notificación de suplantación
                            agregandoSuplantacionByDui(dui);
                            // agregando 1 intento
                            agregarIntentoByCorreo(correo, alias)
                            break;
                        // cuando solamente la contraseña es incorrecta
                        case CORREO[0].alias === alias && DUI[0].alias === alias:
                            // agregar intento
                            agregarIntentoByDui(dui, alias);
                            break;

                        default:
                            console.log('Credenciales de distintos usuarios');
                            break;
                    }

                }
                // verificar sí se encontró usuario por medio del dui
                // cuando el correo no existe
                else if ((DUI.length > 0 && CORREO.length <= 0 && USUARIO.length <= 0) ||
                    (CORREO.length <= 0 && DUI.length > 0 && USUARIO.length > 0)) {
                    // agregar intentos a usuario según dui
                    (DUI[0].alias === alias) ? agregarIntentoByDui(dui, alias) : agregandoSuplantacionByDui(dui);
                }
                // cuando es dui inexistente
                // verificar sí se encontró usuario por medio del correo
                else if ((CORREO.length > 0 && DUI.length <= 0 && USUARIO.length <= 0) ||
                    (DUI.length <= 0 && CORREO.length > 0 && USUARIO.length > 0)) {
                    // agregar intentos a usuario según correo
                    (CORREO[0].alias === alias) ? agregarIntentoByCorreo(correo, alias) : agregandoSuplantacionByCorreo(correo);
                }
                // verificar sí se encontró un usuario por medio del nombre de usuario
                else if (USUARIO.length > 0 && CORREO.length <= 0 && USUARIO.length <= 0) {
                    // agregando intentos a usuario por medio del correo y dui
                    // haciendo referencia que
                    agregandoIntentoByAlias(alias)
                }
                // cuando el usuario no existe
                else if (USUARIO.length <= 0 && CORREO.length > 0 && DUI.length > 0) {
                    // agreando intento
                    agregandoIntentoByNotAlias(correo, dui)
                }


                msg = 'Usuario o contraseña incorrecta';
                auth = false;
                token = '';
            }
            res.status(200).send({ msg, auth, token });
        }
    } catch (error) {
        res.status(500).send(getError(error))
    }
}


/**
 * Método que agrega 1 a los intentos, por correo (UPDATE)
 * @param {*} correo correo del usuario que se agrega un intento
 * @param {*} alias alias del usuario que se agrega un intento
 */
const agregarIntentoByCorreo = async (correo, alias) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE correo = ? AND alias = ?', [correo, alias]);
        let origin = {
            correo: correo,
            alias: alias,
            case: 1
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE correo = ? AND alias = ?', [correo, alias]);
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Método para agregar intentos por medio del dui
 * @param {*} dui dui del usuario a agregar inteto
 * @param {*} alias alias del usuario a agregar inteto
 */
const agregarIntentoByDui = async (dui, alias) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE dui = ? AND alias = ?', [dui, alias]);
        let origin = {
            alias: alias,
            dui: dui,
            case: 2
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE dui = ? AND alias = ?', [dui, alias]);
        }
    } catch (error) {
        throw error;
    }
}
/**
 * Método para agregar 1 intento cuando el alias sea el incorrecto
 * @param {*} correo correo del usuario
 * @param {*} dui dui del usuario
 */
const agregandoIntentoByNotAlias = async (correo, dui) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE correo = ? AND dui = ?', [correo, dui]);
        let origin = {
            correo: correo,
            dui: dui,
            case: 3
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE correo = ? AND dui = ?', [correo, dui]);
        }
    } catch (error) {
        throw error;
    }
}
/**
 * Método para agregar intento solamente por el alias
 * @param {*} alias alias del usuario
 */
const agregandoIntentoByAlias = async (alias) => {
    try {
        await execute('UPDATE empledos SET intentos = intentos + 1 WHERE alias = ?', [alias]);
        let origin = {
            alias: alias,
            case: 4
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE alias = ?', [alias]);
        }
    } catch (error) {
        throw error;
    }
}

const getIntentos = async (origin) => {
    let intentos;
    switch (origin.case) {
        case 1:
            intentos = await execute('SELECT intentos FROM empleados WHERE correo = ? AND alias = ?',
                [origin.correo, origin.alias]);
            break;
        case 2:
            intentos = await execute('SELECT intentos FROM empleados WHERE dui = ? AND alias = ?',
                [origin.dui, origin.alias]);
            break;
        case 3:
            intentos = await execute('SELECT intentos FROM empleados WHERE correo = ? AND dui = ?',
                [origin.correo, origin.dui]);
            break;

        case 4:
            intentos = await execute('SELECT intentos FROM empleados WHERE alias = ?', [origin.alias])
            break;
        default:
            intentos = 0;
            break;
    }
    return intentos[0].intentos;
}


const agregandoSuplantacionByAlias = async (alias) => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE alias = ?', [alias])
    } catch (error) {
        throw error;
    }
}

/**
 * Método para agregar uno a la cantidad de veces que se ha intentado ingresar a una cuenta
 * y casualmente puso el correo de un usuario existente
 * @param {*} correo 
 */
const agregandoSuplantacionByCorreo = async (correo) => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE correo = ?', [correo]);
    } catch (error) {
        throw error;
    }
}
/**
 * Método para agregar 1 a la cantidad de veces que se ha probado un dato existente diferente a la credencia
 * @param {*} dui 
 */
const agregandoSuplantacionByDui = async (dui) => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE dui = ? ', [dui])
    } catch (error) {
        throw error;
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
        id = EMPLEADO[0]['id_empleado'];
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
            const ID = jwt.decode(TOKEN);
            // realizar query
            const EMPLEADO = await execute('SELECT nombres, apellidos, dui, telefono, correo, alias  FROM empleados_view WHERE id_empleado = ?', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes')
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
            const ID = jwt.decode(TOKEN);
            // realizar query
            execute('SELECT alias FROM empleados_view WHERE id_empleado = ?', [ID])
                // retornar los datos sí la respuesta es la esperada
                .then(rows => { res.send(rows[0]); })
                .catch(rej => { console.log(rej); res.send(getError(rej)) })

        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes')
    }
}

/**
 * Método para obtener la contraseña anterior para validar que la nueva sea diferente que la antiguaß
 */
const getClaveDB = async (id_empleado) => {
    // obtener la clave de la db cuando el id_empleado sea al que se decea actualizar
    const CLAVE = await execute(`SELECT clave FROM empleados WHERE id_empleado = ?`, [id_empleado]);
    // retornar la clave   
    return CLAVE[0].clave;
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
            const ID = jwt.decode(TOKEN);
            // obtener los datos del cuerpo de la petición
            let { nombres, apellidos, dui, telefono, correo, clave, alias } = req.body;
            // verificar no sí viene clave nueva,  asignar la clave no midificada
            if (!clave) {
                execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, alias = ? WHERE id_empleado = ?',
                    [nombres, apellidos, dui, telefono, correo, alias, ID])
                    .then(() => {
                        res.status(201).send('Datos modificados')
                    }).catch(rej => {
                        console.log(rej); res.status(500).send(getError(rej));
                    })

            }
            else {
                if (!compareSync(clave, await getClaveDB(ID))) {
                    clave = encrypt(clave);
                    execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, clave = ?, alias = ? WHERE id_empleado = ?',
                        [nombres, apellidos, dui, telefono, correo, clave, alias, ID])
                        .then(() => {
                            res.status(201).send('Datos modificados');
                        }).catch(rej => {
                            res.status(500).send(getError(rej));
                        })
                } else {
                    res.status(500).send('La nueva contraseña debe ser diferente a la actual');
                }

            }
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método asincrono para verificar sí hay Sucursales registradas para verificar el primer uso
 * @param {*} req datos de la petición (vienen de la del cliente
 * @param {*} res respuesta del servidor
 */
const verificarSucursales = async (req, res) => {
    try {
        // obtener las Sucursales para verificar sí existen registradas
        let sucursales = await execute(` SELECT count(nombre_sucursal) as '$2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC' FROM sucursales`);
        // retornar en la respuesta las sucursales encontradas

        res.status(200).json(sucursales[0]['$2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC']);
    } catch (error) {
        res.status(500).send(getError(error));
    }
}

/**
 * Método ascricrono para verificar sí hay empleados registrados para el método de primer uso
 * @param {*} req datos de la petición
 * @param {*} res respuesta del servidor
 */
const verificarEmpleados = async (req, res) => {
    try {
        // obtener los empleados registrados
        let empleados = await execute(`SELECT count(id_empleado) as '$2a$10$23bWlWgaHrD/uBy4p6Sj/eC0U73vpDJXkOs7KLmtpQxdF5nrasgdK' FROM empleados`);
        // retornar los empleados registrados
        res.status(200).json(empleados[0]['$2a$10$23bWlWgaHrD/uBy4p6Sj/eC0U73vpDJXkOs7KLmtpQxdF5nrasgdK'])
    } catch (error) {
        res.status(500).send(getError(error));
    }
}

/**
 * Método para obtener la primera sucursal, el primer horario y el primer cargo para asignar al primer empleado
 * @param {*} req datos que se envia de la petición
 * @param {*} res respues del servidor o (return de este método)
 */
const getDataPrimerEmpleado = async (req, res) => {
    try {
        // obtener los cargos, horarios y sucursal para despues formatear 
        let cargo = await execute('SELECT id_cargo FROM cargos');
        let horario = await execute('SELECT id_horario FROM horarios');
        let sucursal = await execute('SELECT id_sucursal FROM sucursales');

        // declarar un objeto para retornar al cliente un objetos con los ids
        let id = {
            cargo: getBinary(cargo, 'id_cargo')[0],
            horario: getBinary(horario, 'id_horario')[0],
            sucursal: getBinary(sucursal, 'id_sucursal')[0]
        }

        res.status(200).json(id);
    } catch (error) {
        res.status(500).send(getError(error));
    }
}
// exportar modulos
module.exports = {
    validateUsuario, getInfo, getConfig, change, verificarSucursales, verificarEmpleados, getDataPrimerEmpleado
};