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
        const PRODUCTOS = await POOL.query('SELECT cantidad, nombre_servicio, id_detalle, id_servicio, id_sucursal FROM productos_sucursales_view WHERE id_sucursal = $1', [SUCURSAL])
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
        const PRODUCTOS = await POOL.query('SELECT id_servicio, nombre_servicio FROM servicios WHERE existencias >= 1')
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
        if(await compareProductos(servicio, cantidad) === true){
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
        }else{
            res.json({ error: 'Cantidad máxima superada'})
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Metodo para obtener y evaluar sí la cantidad agregar es más o igual
 * a las existencias
 */
const compareProductos = async (servicio, cantidad) => {
    try {        
        // obtener las existencias
        const SERVICIO = await POOL.query('SELECT existencias, id_tipo_servicio FROM servicios WHERE id_servicio = $1', [servicio])        
        // obtener el tipo de servicio sea producto
        const TPRODUCTO = await POOL.query('SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = $1', ['Producto']);
        // verificar sí el tipo de servicio es producto para evaluar cantidad con respecto a las existencias        
        if (SERVICIO.rows[0].id_tipo_servicio === TPRODUCTO.rows[0].id_tipo_servicio){
            // comparar sí las existencias son menos o igual4            
            return (cantidad <= SERVICIO.rows[0].existencias)  
        }else {            
            return true;
        }
    } catch (error) {
        console.log(error)
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