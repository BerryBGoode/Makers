// requerir de la conexión
const { mysql, pg } = require('../db');

const { compareProductosSucursal } = require('../helpers/validateHelpers');

const { execute } = require('../MySQL');

const { getBinary } = require('../helpers/validateHelpers')
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
        const SUCURSAL = parseInt(req.params.sucursal);
        // realizar query 
        const PRODUCTO = await POOL.query('SELECT id_detalle, nombre_servicio, cantidad, tipo_servicio FROM productos_sucursales_view WHERE id_sucursal = $1 ORDER BY id_detalle ASC', [SUCURSAL]);
        // verificar respuesta satisfactoria
        if (res.status(200)) res.json(PRODUCTO.rows);
    } catch (error) {
        console.log(error);
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
            POOL.query('INSERT INTO detalle_ordenes(id_detalle_servicio, cantidad, descuento, id_orden) VALUES ($1, $2, $3, $4)',
                [servicio, cantidad, descuento, orden],
                (err, result) => {
                    // verificar sí hubo un error
                    if (err) {
                        // enviar mensaje de error
                        res.json({ error: err.message });
                        // retornar
                        return;
                    }
                    res.status(201).send('Detalle agregado');
                }
            )
        } else {
            res.json({ error: 'Cantidad máxima superada' })
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para actualizar los datos según registro seleccionado
 */
const change = async (req, res) => {
    try {
        // obtener id del detalle
        const DETALLE = parseInt(req.params.id);
        // obtener el cuerpo de datos
        const { servicio, cantidad, descuento, orden } = req.body;
        // realizar query y enviando parametros
        if (await compareProductosSucursal(servicio, cantidad)) {
            POOL.query('UPDATE detalle_ordenes SET id_detalle_servicio = $1, cantidad = $2, descuento = $3, id_orden = $4 WHERE id_detalle = $5',
                // aquí envio parametros
                [servicio, cantidad, descuento, orden, DETALLE],
                (err, result) => {
                    // verificar error
                    if (err) {
                        // enviar mensaje de error
                        res.json({ error: err.message });
                        // retornar 
                        return;
                    }
                    res.status(201).send('Detalle modificado')
                }
            )
        } else {
            res.json({ error: 'Cantidad máxima superada' });
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para obtener los datos del registro selecciondo
 */
const one = async (req, res) => {
    try {
        // obtener detalle
        const ID = parseInt(req.params.id);
        // realizar consulta
        const DETALLE = await POOL.query('SELECT nombre_sucursal, id_sucursal, id_detalle_servicio, descuento, cantidad_servicio, cantidad FROM detalle_view WHERE id_detalle = $1', [ID])
        // verificar respuesta satisfactoria
        if (res.status(200)) res.json(DETALLE.rows);
    } catch (error) {
        console.log(error)
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
        POOL.query('DELETE FROM detalle_ordenes WHERE id_detalle = $1', [ID], (err, result) => {
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