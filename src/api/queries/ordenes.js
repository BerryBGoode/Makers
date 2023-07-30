// requiriendo la pool con los attrs de la conexión
const POOL = require('../db');

const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers');
const { getError } = require('../helpers/errors');
const { convertToBin } = require('../helpers/encrypt');

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */

/**
 * Método para obtener las ordenes
 */
const get = async (req, res) => {
    execute('SELECT * FROM ordenes_view ORDER BY fecha DESC')
        .then(filled => {
            // convertir ids a binario
            let _orden = getBinary(filled, 'id_orden');
            let _cliente = getBinary(filled, 'id_cliente');
            for (let i = 0; i < filled.length; i++) {
                // por cada registro crear un objeto con los is convertidos
                let ids = {
                    id_orden: _orden[i],
                    id_cliente: _cliente[i],
                    factura: getBinary(filled, 'factura')[i]

                }
                Object.assign(filled[i], ids);
            }
            if (res.status(200)) res.json(filled);
        })
        .catch(rej => {
            res.status(500).json({ error: getError(rej) })
        })
};

/**
 * Método para obtener el dui de un clientes
 */
const getClienteDui = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await execute('SELECT id_cliente, dui FROM clientes');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES);
    } catch (error) {
        console.error(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}


/**
* Método  para obtener los datos del cliente por su DUI
*/
const getObtenerClientes = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await execute('SELECT nombres, apellidos FROM clientes WHERE id_cliente = $1',);
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES);
    } catch (error) {
        console.error(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}







/**
 * Método para crear una orden
 */
const store = (req, res) => {
    try {
        // obtener los datos del req
        const { fecha, cliente } = req.body;
        let estado = 1
        // realizar query o insert y enviarle los parametros
        execute('INSERT INTO ordenes(id_orden ,fecha, estado, id_cliente) VALUES (UUID(), ?, ?, ?)',
            [fecha, estado, convertToBin(cliente)])
            .then(() => {
                res.status(201).send('Orden agregada')
            }).catch(rej => {console.log(rej); res.status(406).send({ error: getError(rej) });})
    } catch (error) {
        console.log(error)
        res.status(500).send('Surgio un problema en el servidor')
    }
}


/**
 * Método para actualizar los datos de la orden
 */
const change = (req, res) => {
    let e;
    try {
        // obtener id 
        const IDORDEN = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        const { fecha, cliente } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE ordenes SET fecha = $1, id_cliente = $2 WHERE id_orden = $3',
            [fecha, cliente, IDORDEN],
            (err, result) => {
                // verificar sí hubo un error                                
                if (err) {

                    // verificar sí no se puede eliminar porque tiene datos dependientes                
                    (err.code === '23503') ? e = 'No se puede modificar o eliminar debido a empleados asociados' : e = err.message
                    // retornar el error
                    res.json({ error: e });
                    return;

                } else {
                    msg = 'Sucursal eliminada';
                }

                res.status(201).send(msg);
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
    let e;
    try {
        // obtener el idorden
        const IDORDEN = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        await POOL.query('DELETE FROM ordenes WHERE id_orden = $1', [IDORDEN], (err, resul) => {
            // verificar sí hubo un error                                
            if (err) {

                // verificar sí no se puede eliminar porque tiene datos dependientes                
                (err.code === '23503') ? e = 'No se puede modificar o eliminar debido a empleados asociados' : e = err.message
                // retornar el error
                res.json({ error: e });
                return;

            } else {
                msg = 'Orden eliminada';
            }

            res.status(201).send(msg);
        })
    } catch (error) {
        console.log(error);
    }
}


/**
 * Método para obtener los datos de la orden enviada por la url
 */
const one = async (req, res) => {
    try {
        // obtener id
        const ID = parseInt(req.params.id);
        // realizar query
        const ORDEN = await POOL.query('SELECT * FROM ordenes_view WHERE id_orden = $1', [ID]);
        // verificar respuesta esperada
        if (res.status(200)) res.send(ORDEN.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}





// exportación de modulos
module.exports = { get, getClienteDui, getObtenerClientes, change, destroy, store, one }