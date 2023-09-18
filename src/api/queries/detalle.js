// requerir de la conexión
const { mysql, pg } = require('../db');

const { compareProductosSucursal } = require('../helpers/validateHelpers');

const { execute } = require('../MySQL');

const { getBinary } = require('../helpers/validateHelpers');
const { getError } = require('../helpers/errors');
const DETALLE = require('../routes/detalles.routes');
/** 
 * Método para obtener los detalles según la orden de la url
 */
const get = async (req, res) => {
    // verificar la autenticación
    if (req.headers.authorization) {
        let data = [];
        let i = 0;
        // obtener el id de la orden para realizar la sentencia 
        const ORDEN = req.params.orden;
        // ejecutar la sentencia SQL para obtener los datos
        execute('SELECT nombre_servicio, tipo_servicio, cantidad, nombre_sucursal, format(precio, 2) as precio, format(subtotal, 2) as subtotal, format(descuento, 2) as descuento, id_detalle  FROM detalle_view WHERE id_orden = ? ORDER BY id_detalle ASC', [ORDEN])
            .then(filled => {
                // convertir a binario los datos id que vienen en formato para poder ser modificado
                let _detalle = getBinary(filled, 'id_detalle');
                // cada dato, cada elemento o registro asignar a un nuevo objeto con el id convertido
                filled.forEach(element => {
                    ids = {
                        id_detalle: _detalle[i],
                    }
                    // unificar objetos, con los datos y retornar un objeto con los ids en binario
                    Object.assign(element, ids);
                    // asinar los datos al arreglo que envia al cliente
                    data.push(element);
                    i++;
                });
                // retornar los datos a la petición
                if (res.status(200)) res.json(data)
            })
            .catch(() => { res.status(500).json('Surgio un problema en el servidor'); })
    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}

/**
 * Método para obtener los servicios según el tipo de servicio
 */
const getServicios = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el tipo de servicio
            const SUCURSAL = req.params.sucursal;
            // realizar query 
            execute('SELECT id_detalle, nombre_servicio, cantidad, tipo_servicio FROM productos_sucursales_view WHERE id_sucursal = ? ORDER BY id_detalle ASC', [SUCURSAL])
                .then(filled => {
                    // convertir a binario el id obtenido
                    let _detalle = getBinary(filled, 'id_detalle');
                    for (let i = 0; i < filled.length; i++) {
                        let id = {
                            id_detalle: _detalle[i]
                        }
                        // unir ambos objetos
                        Object.assign(filled[i], id);
                    }
                    if (res.status(200)) res.json(filled)
                })
                .catch(() => {
                    res.status(500).json('Surgio un problema en servidor');
                })
        } catch (error) {
            res.status(500).json('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }

}

/**
 * Método para agregar un detalle según la orden
 */
const store = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos del frontend
            const { servicio, cantidad, descuento, orden } = req.body;
            // realizar query
            if (await compareProductosSucursal(servicio, cantidad)) {
                execute('INSERT INTO detalles_ordenes(id_detalle, id_detalle_servicio, cantidad, descuento, id_orden) VALUES (UUID(), ?, ?, ?, ?)',
                    [servicio, cantidad, descuento, orden])
                    .then(() => {
                        if (res.status(201)) res.json('Detalle agregado');
                    })
                    .catch(rej => {
                        res.status(500).json(getError(rej['errno']));
                    })
            } else {
                res.send('Cantidad máxima superada')
            }
        } catch (error) {
            res.status(500).json('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}

/**
 * Método para actualizar los datos según registro seleccionado
 */
const change = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id del detalle
            const DETALLE = req.params.id;
            // obtener el cuerpo de datos
            const { servicio, cantidad, descuento, orden } = req.body;
            // comparar la cantidad que el cliente desea comprar con la existencias del producto
            if (await compareProductosSucursal(servicio, cantidad)) {
                // realizar query y enviando parametros
                execute('UPDATE detalles_ordenes SET id_detalle_servicio = ?, cantidad = ?, descuento = ?, id_orden = ? WHERE id_detalle = ?',
                    // aquí envio parametros
                    [servicio, cantidad, descuento, orden, DETALLE])
                    .then(() => {
                        // enviar la respuesta del servidor cuando el proceso se pudo realizar
                        if (res.status(201)) res.json('Detalle modificado');
                    }).catch(rej => {
                        // en caso de que suceda un error enviar un 500 y obtener el código de error y enviar mensaje
                        res.status(500).json(getError(rej['errno']));
                    })
            } else {
                // dado caso la cantidad exceda
                res.send('Cantidad máxima superada');
            }
        } catch (error) {
            // sí llega a pasar un error enviar un 500 más el error
            res.status(500).json('Surgio un problema en el servidor')
        }
    } else {
        // síno se ha iniciado sesión
        res.status(401).json('Debe autenticarse antes')
    }
}

/**
 * Método para obtener los datos del registro selecciondo
 */
const one = async (req, res) => {
    try {
        // obtener detalle
        const ID = req.params.id;
        // realizar consulta
        execute('SELECT nombre_sucursal, id_sucursal, id_detalle_servicio, descuento, cantidad_servicio, cantidad FROM detalle_view WHERE id_detalle = ?', [ID])
            .then(filled => {
                if (res.status(200)) {

                    // verificar respuesta satisfactoria
                    let _sucursal = getBinary(filled, 'id_sucursal');
                    let _detalle_servicio = getBinary(filled, 'id_detalle_servicio')

                    for (let i = 0; i < filled.length; i++) {
                        let id = {
                            id_sucursal: _sucursal[i],
                            id_detalle_servicio: _detalle_servicio[i]
                        }
                        Object.assign(filled[i], id);
                    }
                    res.json(filled)
                }
            })
            .catch(rej => {
                res.status(500).json({ error: getError(rej['errno']) })
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Surgio un problema en el servidor' })
    }
}

/**
 * Método para eliminar el registro seleccionado
 */
const destroy = (req, res) => {
    try {
        // obtener detalle
        const ID = req.params.id;
        // realizar consulta
        execute('DELETE FROM detalles_ordenes WHERE id_detalle = ?', [ID])
            // sí no huviera hubieron errores
            .then(() => {
                res.status(201).json('Detalle eliminado')
            })
            .catch(rej => {
                res.status(500).json(getError(rej))
            })
    } catch (error) {
        res.status(500).json('Surgio un problema en el servidor')
    }
}

// exportar modulos
module.exports = { get, getServicios, store, one, change, destroy };