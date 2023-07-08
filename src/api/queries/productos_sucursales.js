// requerir la pool con los datos de la conexión
const POOL = require('../db');

const { compareProductos } = require('../helpers/validateHelpers');
/**
 * req: los datos que trae del lado del cliente al hacer la petición
 * res: la respuesta del servidor
 */

/** ! Siempre debe ir el req primero */
const get = async (req, res) => {
    try {
        // obtener el id de la sucursal
        const SUCURSAL = parseInt(req.params.id);
        // realizar query 
        const PRODUCTOS = await POOL.query('SELECT cantidad, nombre_servicio, id_detalle, id_servicio, id_sucursal FROM productos_sucursales_view WHERE id_sucursal = $1 ORDER BY id_sucursal ASC', [SUCURSAL])
        // validar el resultado satisfactorio
        if (res.status(200)) res.json(PRODUCTOS.rows);

    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para obtener el nombre los productos disponibles
 */
const getProductos = async (req, res) => {
    try {
        // realizar consulta
        const PRODUCTOS = await POOL.query('SELECT s.id_servicio, tp.tipo_servicio, s.nombre_servicio, s.existencias FROM servicios s INNER JOIN tipos_servicios tp ON tp.id_tipo_servicio = s.id_tipo_servicio WHERE existencias >= 1')
        // verificar estado satisfactorio
        // console.log(res)
        if (res.status(200)) res.json(PRODUCTOS.rows);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para agregar producto a una sucursal
 */
const store = async (req, res) => {
    try {
        // obtener los datos del frontend
        const { sucursal, servicio, cantidad } = req.body;
        // verificar cantidad con respecto al servicio        
        if (await compareProductos(servicio, cantidad) === true) {
            // realizar transacción SQL
            POOL.query('INSERT INTO detalles_servicios_sucursales(id_sucursal, id_servicio, cantidad) VALUES ($1, $2, $3)',
                [sucursal, servicio, cantidad], (err, result) => {
                    // verificar error
                    if (err) {
                        // sí es ejecuta esto, el status 201 no se enviará
                        res.json({ error: err.message });
                        return;
                    }
                    res.status(201).send('Producto agregado');
                })
        } else {
            res.json({ error: 'Cantidad máxima superada' })
            return
        }
    } catch (error) {
        console.log(error);
    }
}


/**
 * Método para obtener los datos del registro del producto en la sucursal
 */
const one = async (req, res) => {
    try {
        // obtener el del detalle de la url
        const DETALLE = parseInt(req.params.id);
        // realizar query
        const PRODUCTO = await POOL.query('SELECT * FROM detalles_servicios_sucursales WHERE id_detalle = $1', [DETALLE]);
        // vefificar respuesta satisfactoria
        if (res.status(200)) res.json(PRODUCTO.rows[0]);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para actualizar datos según el registro seleccionado
 */
const change = async (req, res) => {
    try {
        // obtener detalle de la url
        const DETALLE = parseInt(req.params.id);
        // enviando los datos nuevos
        const { servicio, cantidad } = req.body;
        // realizar transacción sql,
        if (await compareProductos(servicio, cantidad)) {

            POOL.query('UPDATE detalles_servicios_sucursales SET id_servicio = $1, cantidad = $2 WHERE id_detalle = $3', [servicio, cantidad, DETALLE],
                (err, result) => {
                    // verificar sí hay algún error
                    if (err) {
                        // enviar mensaje de error
                        res.json({ error: err.message });
                        // retornar
                        return;
                    }
                    res.status(201).send('Detalle modificado');
                })
        } else {
            res.json({ error: 'Cantidad máxima superada'});
            return
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para eliminar el detalle seleccionado
 */
const destroy = (req, res) => {
    try {
        // obtener el registro según id enviando al route 
        const DETALLE = parseInt(req.params.id);
        // realizar sentencia sql
        POOL.query('DELETE FROM detalles_servicios_sucursales WHERE id_detalle = $1', [DETALLE], (err, result) => {
            // verificar errores
            if (err) {
                // enviar mensaje de error
                res.json({ error: err.message });
                // retornar
                return;
            }
            // mandar mensaje de proceso satisfecho
            res.status(201).send('Detalle eliminado');
        })
    } catch (error) {
        console.log(error);
    }
}

// exportar modulos con los queries
module.exports = { get, getProductos, store, one, change, destroy };