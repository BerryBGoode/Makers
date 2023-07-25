// requiriendo la pool con los attrs de la conexión
const jwt = require('jsonwebtoken');
// requerir de ecryptador
const encrypt = require('../helpers/encrypt');

const { getError } = require('../helpers/errors');
const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers');
let msg;

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
        const HORARIOS = await execute('SELECT * FROM horarios_view'); // con * tardo .118 mls
        // verificar respuesta satisfeca
        if (HORARIOS) {
            let _horario = getBinary(HORARIOS, 'id_horario');
            for (let i = 0; i < HORARIOS.length; i++) {
                id = {
                    id_horario: _horario[i]
                }
                Object.assign(HORARIOS[i], id);
            }
            if(res.status(200)) res.json(HORARIOS)
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
        const CARGOS = await POOL.query('SELECT * FROM cargos');
        // verificar el estado de la respuesta para retornar datos
        if (res.status(200)) res.json(CARGOS.rows);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Método para crear un empleado
 */
const store = (req, res) => {
    let msg, er = '';
    try {
        // obtener los datos del req
        const { nombres, apellidos, dui, clave, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO empleados(nombres, apellidos, dui, clave, planilla, telefono, correo,id_sucursal, id_horario, id_cargo, alias) VALUES ($1,$2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [nombres, apellidos, dui, encrypt(clave), planilla, telefono, correo, sucursal, horario, cargo, alias], (err, result) => {

                // verificar sí hubo un error                                
                if (err) {

                    if (err.code === '23505') {
                        // enviar error el cliente
                        er = 'Dato unico ya registrado';
                    } else {
                        er = err.message;
                    }
                    res.json({ error: er });
                    // sí es ejecuta esto, el status 201 no se enviará
                    // return;                    

                } else {
                    msg = 'Empleado agregado';
                }

                res.status(201).send(msg);

                // verificar estado satisfactorio
                // res.status(201).send('Empleado agregado')
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
        const EMPLEADO = await POOL.query('SELECT * FROM empleados_view WHERE id_empleado = $1', [IDEMPLEADO]);
        // verificar si no existe
        // verificar sí el estado es el esperado
        if (res.status(201)) { res.json(EMPLEADO.rows) };

    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para actualizar los datos del empleado seleccionado
 */
const change = (req, res) => {
    let msg, er = '';
    try {
        // obtener id 
        const IDEMPLEADO = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        const { nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE empleados SET nombres = $1, apellidos = $2, dui = $3, planilla = $4, telefono = $5, correo = $6 ,id_sucursal = $7, id_horario = $8, id_cargo = $9, alias = $10 WHERE id_empleado = $11',
            [nombres, apellidos, dui, planilla, telefono, correo, sucursal, horario, cargo, alias, IDEMPLEADO],
            (err, result) => {
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
                    msg = 'Empleado agregado';
                }

                res.status(201).send(msg);
            }
        )
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
        const IDEMPLEADO = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        POOL.query('DELETE FROM empleados WHERE id_empleado = $1', [IDEMPLEADO], (err, resul) => {
            // veficar errores
            if (err) {
                if (err.code) msg = getError(err.code);
                res.json({ error: msg });
            }
            // verificar sí existe error
            // sino enviar estado exitoso
            else { msg = 'Empleado eliminado'; }
            if (!err) {
                res.status(201).send(msg);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// exportación de modulos
module.exports = { get, getSucursales, getHorarios, getCargos, store, one, change, destroy }