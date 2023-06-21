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
    let status = '';
    try {
        // obtener los datos del req
        const { fecha, hora } = req.body;
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO ordenes(fecha, estado, id_orden, id_cliente) VALUES ($1,$2, $3, $4)',
            [fecha, hora], (err, result) => {

                // verificar sí hubo un error                                
                if (err) {
                    // sí es ejecuta esto, el status 201 no se enviará
                    res.json({ error: err.message });
                    return;
                }
                res.status(201).send('factura agregada');
                // verificar estado satisfactorio
                // res.status(201).send('Factura agregada')
            })
    } catch (error) {
        console.log(error)
    }
}






/**
 * Método para actualizar los datos de la factura
 */
const change = (req, res) => {
    try {
        // obtener id 
        const IDFACTURA = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        const { fecha, estado, idcliente } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE orden SET fecha = $1, estado = $2, id_cliente = $3, WHERE id_orden = $4',
            [fecha, estado, dui, idcliente, IDFACTURA],
            (err, result) => {
                // verificar sí ha y un error
                if (err) {
                    // enviar mensaje de error
                    res.json({ error: err.message });
                    // retornar
                    return;
                }
                res.status(201).send('factura modificada');
            }
        )
    } catch (error) {
        console.log(error);
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
            // verificar sí hay un error
            if (err) {
                // obtener mensaje
                res.json({ error: err.message });
                // retornar
                return;
            }
            // mandar mensaje sí no hay errores
            res.status(201).send('factura Eliminada');
        })
    } catch (error) {
        console.log(error);
    }
}








// exportación de modulos
module.exports = { get, getDuiEmpleado, getDirección, getObtenerEmpleados, change, destroy, store }