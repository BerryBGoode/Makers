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
    let data = [];
    let i = 0;
    const ORDEN = req.params.orden;
    execute('SELECT nombre_servicio, tipo_servicio, cantidad, nombre_sucursal, format(precio, 2) as precio, format(subtotal, 2) as subtotal, format(descuento, 2) as descuento, id_detalle  FROM detalle_view WHERE id_orden = ? ORDER BY id_detalle ASC', [ORDEN])
        .then(filled => {
            let _detalle = getBinary(filled, 'id_detalle');
            filled.forEach(element => {
                ids = {
                    id_detalle: _detalle[i],
                }
                Object.assign(element, ids),
                    data.push(element);
                i++;
            });
            if (res.status(200)) res.json(data)
        })
        .catch(rej => { res.status(500).json({ error: rej }); })

}

/**
 * Método para obtener los servicios según el tipo de servicio
 */
const getServicios = async (req, res) => {
    try {
        // obtener el tipo de servicio
        const SUCURSAL = req.params.sucursal;
        // realizar query 
        execute('SELECT id_detalle, nombre_servicio, cantidad, tipo_servicio FROM productos_sucursales_view WHERE id_sucursal = ? ORDER BY id_detalle ASC', [SUCURSAL])
            .then(filled => {
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
            .catch(rej => {
                res.status(500).send(rej);
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Surgio un problema en el servidor' })
    }
}

/**
 * Método para agregar un detalle según la orden
 */
const store = async (req, res) => {
    try {
        // obtener los datos del frontend
        const { servicio, cantidad, descuento, orden } = req.body;
        // realizar query
        if (await compareProductosSucursal(servicio, cantidad)) {
            execute('INSERT INTO detalles_ordenes(id_detalle, id_detalle_servicio, cantidad, descuento, id_orden) VALUES (UUID(), ?, ?, ?, ?)',
                [servicio, cantidad, descuento, orden])
                .then(() => {
                    if (res.status(201)) res.send('Detalle agregado');
                })
                .catch(rej => {
                    console.log(rej)
                    res.status(406).send({ error: getError(rej['errno']) });
                })
        } else {
            res.json({ error: 'Cantidad máxima superada' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Surgio un problema en el servidor' });
    }
}

/**
 * Método para actualizar los datos según registro seleccionado
 */
const change = async (req, res) => {
    try {
        // obtener id del detalle
        const DETALLE = req.params.id;
        // obtener el cuerpo de datos
        const { servicio, cantidad, descuento, orden } = req.body;
        // realizar query y enviando parametros
        if (await compareProductosSucursal(servicio, cantidad)) {
            execute('UPDATE detalles_ordenes SET id_detalle_servicio = ?, cantidad = ?, descuento = ?, id_orden = ? WHERE id_detalle = ?',
                // aquí envio parametros
                [servicio, cantidad, descuento, orden, DETALLE])
                .then(() => {
                    if (res.status(201)) res.send('Detalle modificado');
                }).catch(rej => {
                    res.status(406).send({ error: getError(rej['errno']) });
                })
        } else {
            res.json({ error: 'Cantidad máxima superada' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
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
        res.status(500).send({ error: 'Surgio un problema en el servidor' })
    }
}

/**
 * Método para eliminar el registro seleccionado
 */
const destroy = (req, res) => {
    try {
        // obtener detalle
        const ID = parseInt(req.params.id);
        // realizar consulta
        POOL.query('DELETE FROM detalle_ordenes WHERE id_detalle = ?', [ID], (err, result) => {
            // verifiacar sí hubo un error
            if (err) {
                // retornar error
                res.json({ error: err.message });
                // retornar
                return;
            }
            // sí no huviera hubieron errores
            res.status(201).send('Pedido eliminado');
        })
    } catch (error) {
        console.log(error);
    }
}

// exportar modulos
module.exports = { get, getServicios, store, one, change, destroy };