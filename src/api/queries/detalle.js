// requerir de la conexión
const POOL = require('../db'); 

/**
 * Método para obtener los detalles según la orden de la url
 */
const get = async (req, res) => {
    try {
        // obtener orden
        const ORDEN = parseInt(req.params.orden);
        // realizar consulta
        const DETALLES = await POOL.query('SELECT * FROM detalle_view WHERE id_orden = $1', [ORDEN]);
        // verficar estado existoso
        if (res.status(200)) res.json(DETALLES.rows);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para obtener los servicios según el tipo de servicio
 */
const getServicios = async (req, res) => {
    try {
        // obtener el tipo de servicio
        const SUCURSAL = parseInt(req.params.sucursal);
        // realizar query 
        const PRODUCTO = await POOL.query('SELECT id_detalle, nombre_servicio, existencias, tipo_servicio FROM productos_sucursales_view WHERE id_sucursal = $1 ORDER BY id_detalle ASC', [SUCURSAL]);
        // verificar respuesta satisfactoria
        if (res.status(200)) res.json(PRODUCTO.rows);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para agregar un detalle según la orden
 */
const store = (req, res) => {
    try {
        // obtener los datos del frontend
        const { servicio, cantidad, descuento, orden } = req.body;
        // realizar query
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
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para actualizar los datos según registro seleccionado
 */
const change = (req, res) => {
    try {
        // obtener id del detalle
        const DETALLE = parseInt(req.params.id);
        // obtener el cuerpo de datos
        const { servicio, cantidad, descuento, orden } = req.body;
        // realizar query y enviando parametros
        POOL.query('UPDATE detalle_ordenes SET id_servicio = $1, cantidad = $2, descuento = $3, id_orden = $4 WHERE id_detalle = $5',
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
        const DETALLE = await POOL.query('SELECT * FROM detalle_view WHERE id_detalle = $1', [ID])
        // verificar respuesta satisfactoria
        if(res.status(200)) res.json(DETALLE.rows);
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
                res.json({ error: err.message});
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