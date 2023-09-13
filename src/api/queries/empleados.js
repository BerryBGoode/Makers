// requiriendo la pool con los attrs de la conexión
const jwt = require('jsonwebtoken');
// requerir de ecryptador
const { encrypt, decodeBase64, convertToBase64 } = require('../helpers/encrypt');

const { getError } = require('../helpers/errors');
const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers');

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */


/**
 * Método para obtener los empleados
 */
const get = async (req, res) => {
    // obtener el empleado loggeado
    const TOKEN = req.headers.authorization;
    if (TOKEN) {

        // obtener id
        const ID = decodeBase64(jwt.decode(TOKEN))
        // guardar los datos recuperados            
        let data = [];
        let i = 0;
        // realizar consulta
        execute('SELECT id_empleado, nombres, apellidos, dui, telefono, correo, planilla, nombre_sucursal, id_sucursal, horario, id_cargo, cargo, alias FROM empleados_view WHERE id_empleado NOT LIKE ?', [ID])
            .then(filled => {
                // convertir ids a binario
                let id = getBinary(filled, 'id_empleado');
                let id_sucursal_bin = getBinary(filled, 'id_sucursal');
                let id_cargo_bin = getBinary(filled, 'id_cargo');
                // recorrer los datos encontrados
                filled.forEach(element => {
                    // asignar nuevos valor al objeto
                    element = {
                        id_empleado: id[i],
                        nombres: element.nombres,
                        apellidos: element.apellidos,
                        dui: element.dui,
                        telefono: element.telefono,
                        alias: element.alias,
                        cargo: element.cargo,
                        id_cargo: id_cargo_bin[i],
                        nombre_sucursal: element.nombre_sucursal,
                        id_sucursal: id_sucursal_bin[i],
                        correo: element.correo,
                        planilla: element.planilla,
                        horario: element.horario
                    }
                    data.push(element);
                    i++;
                });
                if (res.status(200)) res.json(data);
            })
            .catch(rej => res.status(500).send(getError(rej)))
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener las sucursales
 */
const getSucursales = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta 
            const SUCURSALES = await execute('SELECT id_sucursal, nombre_sucursal FROM sucursales');
            // verificar respuesta satisfactoria, para enviar los datos
            let _sucursal = getBinary(SUCURSALES, 'id_sucursal')
            for (let i = 0; i < SUCURSALES.length; i++) {
                let id = {
                    id_sucursal: _sucursal[i]
                }
                Object.assign(SUCURSALES[i], id)
            }
            if (res.status(200)) res.json(SUCURSALES);
        } catch (error) {
            console.error(error);
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para obtener los horarios que puede tener un empleado
 */
const getHorarios = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta
            const HORARIOS = await execute(`SELECT id_horario, time_format(inicio, '%l:%i') as inicio, time_format(cierre, '%l:%i') as cierre FROM horarios_view`);
            // verificar respuesta satisfeca
            if (HORARIOS) {
                let _horario = getBinary(HORARIOS, 'id_horario');
                for (let i = 0; i < HORARIOS.length; i++) {
                    id = {
                        id_horario: _horario[i]
                    }
                    Object.assign(HORARIOS[i], id);
                }
                if (res.status(200)) res.json(HORARIOS)
            }

        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para obtener los cargos 
 */

const getCargos = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consultar
            const CARGOS = await execute('SELECT * FROM cargos');
            if (CARGOS) {
                let _cargo = getBinary(CARGOS, 'id_cargo');
                for (let i = 0; i < CARGOS.length; i++) {
                    let id = {
                        id_cargo: _cargo[i]
                    }
                    Object.assign(CARGOS[i], id);
                }
                if (res.status(200)) res.json(CARGOS);
            }
        } catch (error) {
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para crear un empleado
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos del req
            const { nombres, apellidos, dui, clave, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
            let password = encrypt(clave)
            // realizar query o insert y enviarle los parametros
            execute('INSERT INTO empleados(id_empleado, nombres, apellidos, dui, clave, planilla, telefono, correo,id_sucursal, id_horario, id_cargo, alias) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nombres, apellidos, dui, password, planilla, telefono, correo, sucursal, horario, cargo, alias])
                .then(() => {
                    res.status(201).send('Empleado agregado');
                })
                .catch(rej => {
                    res.status(500).send(getError(rej));
                })
        } catch (e) {
            res.status(500).send(getError(e));
        }
    } else {
        res.status(401).send('Debe autenticarse antes')
    }

}

/**
 * Método para obtener los datos del empleado según el cliente requiera
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del que esta logeado
            const ID = decodeBase64(jwt.decode(req.headers.authorization))
            // obtener del parametro de la url el id
            const IDEMPLEADO = req.params.id;
            // esperar la respuesta cuando se haga la consulta
            const EMPLEADO = await execute('SELECT * FROM empleados_view WHERE id_empleado = ? AND id_empleado NOT LIKE ?', [IDEMPLEADO, ID]);
            // verificar si no existe
            // verificar sí el estado es el esperado
            for (let i = 0; i < EMPLEADO.length; i++) {
                let id = {
                    id_empleado: getBinary(EMPLEADO, 'id_empleado')[i],
                    id_sucursal: getBinary(EMPLEADO, 'id_sucursal')[i],
                    id_cargo: getBinary(EMPLEADO, 'id_cargo')[i],
                    id_horario: getBinary(EMPLEADO, 'id_horario')[i]
                }
                Object.assign(EMPLEADO[i], id);
            }
            if (res.status(201)) { res.json(EMPLEADO[0]) };

        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para actualizar los datos del empleado seleccionado
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del empleado loggeado
            const ID = decodeBase64(jwt.decode(req.headers.authorization))
            // obtener id 
            const IDEMPLEADO = req.params.id;
            // obtener los datos enviados del frontend
            const { nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
            // realizar transacción sql
            execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, planilla = ?, telefono = ?, correo = ?, id_sucursal = ?, id_horario = ?, id_cargo = ?, alias = ? WHERE id_empleado = ? AND id_empleado NOT LIKE ?',
                [nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias, IDEMPLEADO, ID])
                .then(() => {
                    res.status(201).send('Empleado modificado');
                }).catch(rej => {
                    res.status(500).send(getError(rej));
                })
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para eliminar el empleado seleccionado
 */
const destroy = (req, res) => {
    // verificar sí hay autenticación
    if (req.headers.authorization) {
        try {
            // obtener el empleado logeado
            const ID = decodeBase64(jwt.decode(req.headers.authorization))
            // obtener el idempleado
            const IDEMPLEADO = req.params.id;
            // realizar transferencia sql o delete en este caso
            execute('DELETE FROM empleados WHERE id_empleado NOT LIKE ? AND id_empleado = ?', [ID, IDEMPLEADO])
                .then(() => {
                    res.status(201).send('Empleado eliminado');
                }).catch(rej => {
                    res.status(500).send(getError(rej))
                })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

const validatePassword = async (req, res) => {
    // variables para enviar 1 mensaje al hacer la petición 
    let auth = false, msg, token, status = '', clave_db;
    // obtener los datos
    const { clave } = req.body;
    try {
        const CLAVE = await execute('SELECT clave, cambio_contraseña FROM empleados WHERE clave = ?', [ clave ])
        if (CLAVE) {
            // obtener clave y cambio_contraseña
            for (let i = 0; i < CLAVE.length; i++) {
                // obtener la clave
                clave_db = CLAVE[i]['clave'];
                cambio_contraseña = CLAVE[i]['cambio_contraseña'];
            }
            // compara claves'
            if (clave_db && compare(clave, clave_db)) {
                // clave correcta
                // obtener los datos del empleado encontrado

                // calcular la diferencia entre la fecha actual y cambio_contraseña
                const diffTime = Math.abs(new Date() - cambio_contraseña);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                if (diffDays > 85) {
                    msg = 'Debe cambiar su contraseña';
                    auth = false;
                    token = '';
                } else {
                    // crear token
                    token = await getToken(dui, correo, clave_db)
                    // enviar el estado de la autenticación
                    auth = true;
                    // setear token a la cookie
                    res.cookie('token', token, { httpOnly: true });
                }
            } else {
                msg = 'Contraseña incorrecta';
                auth = false;
                token = '';
            }
            res.status(200).send({ msg, auth, token });
        }
    } catch (error) {
        console.log('error')
        console.log(error)
        res.status(500).send({ error: getError(error) })
    }
}



// exportación de modulos
module.exports = { get, getSucursales, validatePassword, getHorarios, getCargos, store, one, change, destroy }