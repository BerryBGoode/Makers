// requerir la pool con los datos de la conexión
const POOL = require('../db');

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
        const PRODUCTOS = await POOL.query('SELECT * FROM productos_sucursales_view WHERE id_sucursal = $1', [SUCURSAL])
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
        const PRODUCTOS = await POOL.query('SELECT id_servicio, nombre_servicio FROM productos_view WHERE existencias >= 1')
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
const store = (req, res) => {
    try {
        // obtener los datos del frontend
        const { sucursal, producto, cantidad } = req.body;
        // realizar transacción SQL
        POOL.query('INSERT INTO detalles_servicios_sucursales(id_sucursal, id_servicio, cantidad) VALUES ($1, $2, $3)',
            [sucursal, producto, cantidad], (err, result) => {
                // verificar error
                if (err) {
                    // sí es ejecuta esto, el status 201 no se enviará
                    res.json({ error: err.message });
                    return;
                }
                res.status(201).send('Producto agregado');
            })
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
const change = (req, res) => {
    try {
        // obtener detalle de la url
        const DETALLE = parseInt(req.params.id);
        // enviando los datos nuevos
        const { producto, cantidad } = req.body;
        // realizar transacción sql,
        POOL.query('UPDATE detalles_servicios_sucursales SET id_servicio = $1, cantidad = $2 WHERE id_detalle = $3', [producto, cantidad, DETALLE],
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
                res.json({error: err.message});
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