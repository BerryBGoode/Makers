// requerir la pool con los datos de la conexión
const { execute } = require('../MySQL');
const { getError } = require('../helpers/errors');

const { compareProductos, getBinary } = require('../helpers/validateHelpers');
/**
 * req: los datos que trae del lado del cliente al hacer la petición
 * res: la respuesta del servidor
 */

/** ! Siempre debe ir el req primero */
const get = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id de la sucursal
            const SUCURSAL = req.params.id;
            // realizar query 
            await execute('SELECT cantidad, nombre_servicio, id_detalle, id_servicio, id_sucursal FROM productos_sucursales_view WHERE id_sucursal = ? ORDER BY id_sucursal ASC', [SUCURSAL])
                // validar el resultado satisfactorio
                .then(productos => {
                    for (let i = 0; i < productos.length; i++) {
                        let id = {
                            id_detalle: getBinary(productos, 'id_detalle')[i],
                            id_servicio: getBinary(productos, 'id_servicio')[i],
                            id_sucursal: getBinary(productos, 'id_sucursal')[i]
                        }
                        Object.assign(productos[i], id);
                    }
                    res.status(200).send(productos)
                }).catch(rej => { res.status(500).send({ error: getError(rej) }) });

        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para obtener el nombre los productos disponibles
 */
const getProductos = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta
            await execute('SELECT s.id_servicio, tp.tipo_servicio, s.nombre_servicio, s.existencias FROM servicios s INNER JOIN tipos_servicios tp ON tp.id_tipo_servicio = s.id_tipo_servicio WHERE existencias >= 1')
                // verificar estado satisfactorio
                .then(productos => {
                    for (let i = 0; i < productos.length; i++) {
                        let id = {
                            id_servicio: getBinary(productos, 'id_servicio')[i],
                        }
                        Object.assign(productos[i], id);
                    }
                    res.status(200).send(productos)
                }).catch(rej => res.status(500).send(getError(rej)))
        } catch (error) {
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para agregar producto a una sucursal
 */
const store = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos del frontend
            const { sucursal, servicio, cantidad } = req.body;
            // verificar cantidad con respecto al servicio        
            if (await compareProductos(servicio, cantidad) === true) {
                // realizar transacción SQL
                execute('INSERT INTO detalles_servicios_sucursales(id_detalle, id_sucursal, id_servicio, cantidad) VALUES (UUID(), ?, ?, ?)',
                    [sucursal, servicio, cantidad])
                    .then(() => {
                        res.status(201).send('Producto agregado')
                    }).catch(rej => { res.status(406).send(getError(rej)) })
            } else {
                res.json('Cantidad máxima superada')
                return
            }
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}


/**
 * Método para obtener los datos del registro del producto en la sucursal
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el del detalle de la url
            const DETALLE = req.params.id;
            // realizar query
            await execute('SELECT * FROM detalles_servicios_sucursales WHERE id_detalle = ?', [DETALLE])
                // vefificar respuesta satisfactoria
                .then(productos => {

                    for (let i = 0; i < productos.length; i++) {
                        let id = {
                            id_detalle: getBinary(productos, 'id_detalle')[i],
                            id_sucursal: getBinary(productos, 'id_sucursal')[i],
                            id_servicio: getBinary(productos, 'id_servicio')[i]
                        }
                        Object.assign(productos[i], id);
                    }
                    if (res.status(200)) res.json(productos[0]);
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para actualizar datos según el registro seleccionado
 */
const change = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener detalle de la url
            const DETALLE = req.params.id;
            // enviando los datos nuevos
            const { servicio, cantidad } = req.body;

            // realizar transacción sql,
            if (await compareProductos(servicio, cantidad)) {
                execute('UPDATE detalles_servicios_sucursales SET id_servicio = ?, cantidad = ? WHERE id_detalle = ?', [servicio, cantidad, DETALLE])
                    .then(() => {
                        res.status(201).send('Producto modificado')
                    }).catch(rej => { res.status(406).send(getError(rej)) })
            } else {
                res.json('Cantidad máxima superada');
                return
            }
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para eliminar el detalle seleccionado
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el registro según id enviando al route 
            const DETALLE = req.params.id;
            // realizar sentencia sql
            execute('DELETE FROM detalles_servicios_sucursales WHERE id_detalle = ?', [DETALLE])
                .then(() => {
                    res.status(201).send('Producto eliminado');
                }).catch(rej => {
                    res.status(406).send(getError(rej))
                })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

// exportar modulos con los queries
module.exports = { get, getProductos, store, one, change, destroy };