// requiriendo la pool con los attrs de la conexión
const jwt = require('jsonwebtoken');
// requerir de ecryptador
const encrypt = require('../helpers/encrypt');

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
        const ID = encrypt.decodeBase64(jwt.decode(TOKEN))
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
            .catch(rej => res.status(500).json({ error: rej }))
    } else {
        res.status(401).json({ error: 'Debe iniciar sesión antes' })
    }
}

/**
 * Método para obtener las sucursales
 */
const getSucursales = async (req, res) => {
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
}

/**
 * Método para obtener los horarios que puede tener un empleado
 */
const getHorarios = async (req, res) => {
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
        console.error(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener los cargos 
 */

const getCargos = async (req, res) => {
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
        console.error(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para crear un empleado
 */
const store = (req, res) => {
    try {
        // obtener los datos del req
        const { nombres, apellidos, dui, clave, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
        // realizar query o insert y enviarle los parametros
        execute('INSERT INTO empleados(nombres, apellidos, dui, clave, planilla, telefono, correo,id_sucursal, id_horario, id_cargo, alias) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [nombres, apellidos, dui, encrypt(clave), planilla, telefono, correo, sucursal, horario, cargo, alias])
            .then(() => {
                res.status(201).send('Empleado agregado')
            })
            .catch(rej => {
                res.status(406).send({ error: getError(rej['errno']) })
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e });
    }
}

/**
 * Método para obtener los datos del empleado según el cliente requiera
 */
const one = async (req, res) => {
    try {
        // obtener del parametro de la url el id
        const IDEMPLEADO = parseInt(req.params.id);
        // convertirlo a entero, por sí el cliente modifica dato

        // esperar la respuesta cuando se haga la consulta
        const EMPLEADO = await execute('SELECT * FROM empleados_view WHERE id_empleado = ?', [IDEMPLEADO]);
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
        console.log(error);
        res.status(500).send('Surgio un error en el servidor');
    }
}

/**
 * Método para actualizar los datos del empleado seleccionado
 */
const change = (req, res) => {
    try {
        // obtener id 
        const IDEMPLEADO = req.params.id;
        // obtener los datos enviados del frontend
        const { nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
        // realizar transacción sql
        execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, planilla = ?, telefono = ?, correo = ?, id_sucursal = ?, id_horario = ?, id_cargo = ?, alias = ? WHERE id_empleado = ?',
            [nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias, IDEMPLEADO])
            .then(() => {
                res.status(201).send('Empleado modificado');
            }).catch(rej => {
                console.log(rej)
                res.status(406).send({ error: getError(rej['errno']) })
            })
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para eliminar el empleado seleccionado
 */
const destroy = (req, res) => {
    try {
        // obtener el idempleado
        const IDEMPLEADO = req.params.id;
        // realizar transferencia sql o delete en este caso
        execute('DELETE FROM empleados WHERE id_empleado = ?', [IDEMPLEADO])
            .then(() => {
                res.status(201).send('Empleado eliminado');
            }).catch(rej => {
                res.status(406).send({ error: getError(rej['errno']) })
            })

    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

// exportación de modulos
module.exports = { get, getSucursales, getHorarios, getCargos, store, one, change, destroy }