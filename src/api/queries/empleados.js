// requiriendo la pool con los attrs de la conexión
const jwt = require('jsonwebtoken');
const POOL = require('../db');
// requerir de ecryptador
const encrypt = require('../helpers/encrypt');

const { getError } = require('../helpers/errors')
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
        try {
            // obtener id
            const ID = jwt.decode(TOKEN)
            // obtener todos los empleado excepto el loggeados
            const EMPLEADOS = await POOL.query('SELECT id_empleado, nombres, apellidos, dui, telefono, correo, planilla, nombre_sucursal, id_sucursal, horario, id_cargo, cargo, alias FROM empleados_view WHERE NOT id_empleado = $1', [ID]);
            // verificar el estado satisfactorio para retornar los datos
            if (res.status(200)) res.json(EMPLEADOS.rows);
        } catch (error) {
            console.error(error);
        }
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
        const SUCURSALES = await POOL.query('SELECT id_sucursal, nombre_sucursal FROM sucursales');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(SUCURSALES.rows);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Método para obtener los horarios que puede tener un empleado
 */
const getHorarios = async (req, res) => {
    try {
        // formato de hora HH12:mm
        let formato = 'HH12:MI';
        // realizar consulta
        const HORARIOS = await POOL.query('SELECT id_horario, to_char(hora_apertura, $1) as inicio, to_char(hora_cierre, $1) as cierre FROM horarios', [formato]); // con * tardo .118 mls
        // verificar respuesta satisfeca
        if (res.status(200)) res.json(HORARIOS.rows);
    } catch (error) {
        console.error(error);
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