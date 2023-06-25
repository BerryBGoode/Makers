// requiriendo la pool con los attrs de la conexión
const POOL = require('../db');

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */

/**
 * Método para obtener las ordenes
 */
const get = async (req, res) => {
    try {
        // realizar consulta
        const ORDENES = await POOL.query('SELECT * FROM ordenes');
        // verificar el estado satisfactorio para retornar los datos
        if (res.status(200)) res.json(ORDENES.rows);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Método para obtener el dui de un clientes
 */
const getClienteDui = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await POOL.query('SELECT dui FROM clientes');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES.rows);
    } catch (error) {
        console.error(error);
    }
}


  /**
 * Método  para obtener los datos del cliente por su DUI
 */
const getObtenerClientes = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await POOL.query('SELECT nombres, apellidos FROM clientes WHERE dui = ?');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES.rows);
    } catch (error) {
        console.error(error);
    }
}







/**
 * Método para crear una orden
 */
const store = (req, res) => {
    let msg = '';
    let status = '';
    try {
        // obtener los datos del req
        const { fecha, hora  } = req.body;
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO ordenes(fecha, estado, id_orden, id_cliente) VALUES ($1,$2, $3, $4)',
            [ fecha, hora], (err, result) => {

                // verificar sí hubo un error                                
                if (err) {
                    // sí es ejecuta esto, el status 201 no se enviará
                    res.json({ error: err.message });
                    return;
                }
                res.status(201).send('orden agregada');
                // verificar estado satisfactorio
                // res.status(201).send('Orden agregada')
            })
    } catch (error) {
        console.log(error)
    }
}


/**
 * Método para actualizar los datos de la orden
 */
const change = (req, res) => {
    try {
        // obtener id 
        const IDORDEN = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        const { fecha, estado } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE orden SET fecha = $1, estado = $2, id_cliente = $3, WHERE id_orden = $4',
            [fecha, estado, dui, planilla, IDORDEN],
            (err, result) => {
                // verificar sí ha y un error
                if (err) {
                    // enviar mensaje de error
                    res.json({ error: err.message });
                    // retornar
                    return;
                }
                res.status(201).send('Orden modificada');
            }
        )
    } catch (error) {
        console.log(error);
    }
}




/**
 * Método para eliminar la orden seleccionada
 */
const destroy = async (req, res) => {
    try {
        // obtener el idorden
        const IDORDEN = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        await POOL.query('DELETE FROM ordenes WHERE id_orden = $1', [IDORDEN], (err, resul) => {
            // verificar sí hay un error
            if (err) {
                // obtener mensaje
                res.json({ error: err.message });
                // retornar
                return;
            }
            // mandar mensaje sí no hay errores
            res.status(201).send('Orden Eliminada');
        })
    } catch (error) {
        console.log(error);
    }
}








// exportación de modulos
module.exports = { get, getClienteDui, getObtenerClientes, change, destroy, store }