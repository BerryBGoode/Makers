// requiriendo la pool con los attrs de la conexión
const POOL = require('../db');

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */


/**
 * Método para obtener la factura
 */
const get = async (req, res) => {
    try {
        // realizar consulta
        const FACTURAS = await POOL.query('SELECT * FROM facturas');
        // verificar el estado satisfactorio para retornar los datos
        if (res.status(200)) res.json(FACTURAS.rows);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Método para obtener el dui del empleado
 */
const getDuiEmpleado = async (req, res) => {
    try {
        // realizar consulta
        const EMPLEADOS = await POOL.query('SELECT dui FROM empleados');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(EMPLEADOS.rows);
    } catch (error) {
        console.error(error);
    }
}



/**
 * Método para obtener la Dirección de la sucursal
 */
const getDirección = async (req, res) => {
    try {
        // realizar consulta
        const SUCURSALES = await POOL.query('SELECT id_sucursal, direccion FROM sucursales');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(SUCURSALES.rows);
    } catch (error) {
        console.error(error);
    }
}



/**
* Método  para obtener los datos del Empleado por su DUI
*/
const getObtenerEmpleados = async (req, res) => {
    try {
        // realizar consulta
        const EMPLEADOS = await POOL.query('SELECT nombres, apellidos FROM Empleados WHERE dui = ?');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(EMPLEADOS.rows);
    } catch (error) {
        console.error(error);
    }
}




/**
 * Método para crear una factura
 */
const store = (req, res) => {
    let msg = '';
    try {
        // obtener los datos del req
        const { orden, empleado, sucursal, estado } = req.body;
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO facturas(id_orden, id_empleado, id_sucursal, estado) VALUES ($1, $2, $3, $4)',
            [orden, empleado, sucursal, estado], (err, result) => {

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
                    msg = 'Factura agregada';
                }

                res.status(201).send(msg);
            })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Método para actualizar los datos de la factura
 */
const change = (req, res) => {
    let msg;
    try {
        // obtener id 
        const IDFACTURA = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        // obtener los datos del req
        const {  empleado, sucursal, estado } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE facturas SET id_sucursal = $1, id_empleado = $2, estado = $3 WHERE id_factura = $4',
            [sucursal, empleado, estado, IDFACTURA],
            (err, result) => {
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
                    msg = 'Factura modificada';
                }

                res.status(201).send(msg);
            }
        )
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para obtener los datos de una factura
 */
const one = async (req, res) => {
    try {
        // obtener id de parametro de la petición
        const ID = parseInt(req.params.id);
        // realizar query
        const FACTURA = await POOL.query('SELECT f.id_factura, f.id_sucursal, f.id_empleado, f.estado, f.id_orden, e.nombres, e.apellidos FROM facturas f INNER JOIN empleados e ON e.id_empleado = f.id_empleado WHERE id_factura = $1', [ID])
        // verificar sí el resultado es el esperado
        if (res.status(200)) res.send(FACTURA.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}
/**
 * Método para eliminar la factura seleccionada
 */
const destroy = async (req, res) => {
    try {
        // obtener el idFacturas
        const IDFACTURA = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        await POOL.query('DELETE FROM facturas WHERE id_factura = $1', [IDFACTURA], (err, resul) => {
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
                msg = 'Factura eliminada';
            }

            // mandar mensaje sí no hay errores
            res.status(201).send(msg);
        })
    } catch (error) {
        console.log(error);
    }
}








// exportación de modulos
module.exports = { get, getDuiEmpleado, getDirección, getObtenerEmpleados, change, destroy, store, one }