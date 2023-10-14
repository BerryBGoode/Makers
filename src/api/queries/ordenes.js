// requiriendo la pool con los attrs de la conexión

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
    if (req.headers.authorization) {
        execute('SELECT * FROM ordenes_view WHERE estado = ? ORDER BY fecha DESC', [1])
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
                res.status(500).json(getError(rej))
            })

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
};

/**
 * Método para obtener el dui de un clientes
 */
const getClienteDui = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta
            const CLIENTES = await execute('SELECT id_cliente, dui FROM clientes');
            // verificar respuesta satisfactoria, para enviar los datos
            for (let i = 0; i < CLIENTES.length; i++) {
                id = {
                    id_cliente: getBinary(CLIENTES, 'id_cliente')[i]
                }
                Object.assign(CLIENTES[i], id);

            }
            if (res.status(200)) res.json(CLIENTES);
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe auntenticarse antes');
    }
}


/**
* Método  para obtener los datos del cliente por su DUI
*/
const getObtenerClientes = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta
            const CLIENTES = await execute('SELECT nombres, apellidos FROM clientes WHERE id_cliente = $1',);
            // verificar respuesta satisfactoria, para enviar los datos
            if (res.status(200)) res.json(CLIENTES);
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para crear una orden
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos del req
            const { cliente } = req.body;
            let estado = 1
            // realizar query o insert y enviarle los parametros
            execute('INSERT INTO ordenes(id_orden ,fecha, hora, estado, id_cliente) VALUES (UUID(), CURRENT_DATE, CURRENT_TIME, ?, ?)',
                [estado, convertToBin(cliente)])
                .then(() => {
                    res.status(201).send('Orden agregada')
                }).catch(rej => { console.log(rej); res.status(500).send(getError(rej)); })
        } catch (error) {
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}


/**
 * Método para actualizar los datos de la orden
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id 
            const IDORDEN = req.params.id;
            // obtener los datos enviados del frontend
            const { fecha, cliente } = req.body;
            // realizar transacción sql
            execute('UPDATE ordenes SET fecha = ?, id_cliente = ? WHERE id_orden = ?',
                [fecha, cliente, IDORDEN])
                .then(() => {
                    res.status(201).send('Orden modificada');
                }).catch(rej => {
                    res.status(500).send(getError(rej))
                })
        } catch (error) {
            res.status(401).send(getError(error))
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}




/**
 * Método para eliminar la orden seleccionada
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el idorden
            const IDORDEN = req.params.id;
            // realizar transferencia sql o delete en este caso
            execute('UPDATE ordenes SET estado = ? WHERE id_orden = ?', [2, IDORDEN])
                .then(() => {
                    res.status(201).send('Orden eliminada');
                }).catch(rej => {
                    res.status(500).send(getError(rej))
                })
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}


/**
 * Método para obtener los datos de la orden enviada por la url
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id
            const ID = req.params.id;
            // realizar query
            const ORDEN = await execute('SELECT dui, nombres, apellidos, fecha, id_cliente FROM ordenes_view WHERE id_orden = ?', [ID]);
            // verificar respuesta esperada
            for (let i = 0; i < ORDEN.length; i++) {
                let id = {
                    id_cliente: getBinary(ORDEN, 'id_cliente')[i]
                }
                Object.assign(ORDEN[i], id);
            }
            if (res.status(200)) res.send(ORDEN[0]);
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

// exportación de modulos
module.exports = { get, getClienteDui, getObtenerClientes, change, destroy, store, one }