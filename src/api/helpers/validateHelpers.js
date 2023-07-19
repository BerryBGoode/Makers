// archivo para dar resultado después de aplicar las validaciones del lado del servidor
const { validationResult } = require('express-validator');
const POOL = require('../db');
const { convertToBin, convertToUtf } = require('./encrypt')

// método para dar resultado después de validar
const validate = (req, res, next) => {
    // intentar verificar sí existe un error en los datos (validar datos)
    try {
        // validar cada dato del front (req)
        validationResult(req).throw();
        // retornar al siguiente
        return next();
    } catch (error) {
        // retornar el estado del error y el mensaje
        res.status(403);
        res.send({ errors: error.array() });
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
        if (SERVICIO.rows[0].id_tipo_servicio === TPRODUCTO.rows[0].id_tipo_servicio) {
            // comparar sí las existencias son menos o igual4            
            return (cantidad <= SERVICIO.rows[0].existencias)
        } else {
            return true;
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Metodo obtener la cantidad o existencias que tiene un producto
 * en una sucursal
 */
const compareProductosSucursal = async (producto, cantidad) => {
    try {
        // obtener la cantidad de existencias que tiene el producto
        const DETALLE = await POOL.query('SELECT cantidad FROM detalles_servicios_sucursales WHERE id_detalle = $1', [producto]);
        // comparar la cantidad que tiene en la db, con 
        // la que se quiere agregar el pedido
        return (cantidad <= DETALLE.rows[0].cantidad);
    } catch (error) {
        console.log(error);
    }
}

/**
 * método para obtener id en formato binario
 * de los datos obtenidos
 * @param {*} data respuesta con los datos recuperados
 * @param {*} col  campo id en la db
 * @returns binary
 */
const getBinary = (data, col) => {
    let id = [];
    // recorrer los datos obtenidos
    data.forEach(element => {
        // convertir a binario el elemento que se este recorriendo
        id.push(convertToBin(element[col]));
    });
    return id;
}

// exportar
module.exports = { validate, compareProductos, compareProductosSucursal, getBinary };