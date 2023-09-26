// archivo para dar resultado después de aplicar las validaciones del lado del servidor
const { validationResult } = require('express-validator');
const POOL = require('../db');
const { convertToBin, convertToUtf } = require('./encrypt');
const { execute } = require('../MySQL');

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
        const SERVICIO = await execute('SELECT existencias, id_tipo_servicio FROM servicios WHERE id_servicio = ?', [servicio])
        // obtener el tipo de servicio sea producto
        const TPRODUCTO = await execute('SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = ?', ['Producto']);
        // verificar sí el tipo de servicio es producto para evaluar cantidad con respecto a las existencias                
        for (let i = 0; i < SERVICIO.length; i++) {
            id = {
                id_tipo_servicio: getBinary(SERVICIO, 'id_tipo_servicio')[i]
            }
            Object.assign(SERVICIO[i], id);
        }
        for (let i = 0; i < TPRODUCTO.length; i++) {
            id = {
                id_tipo_servicio: getBinary(TPRODUCTO, 'id_tipo_servicio')[i]
            }
            Object.assign(TPRODUCTO[i], id);
        }
        if (SERVICIO[0].id_tipo_servicio === TPRODUCTO[0].id_tipo_servicio) {
            // comparar sí las existencias son menos o igual4                                
            return (cantidad <= SERVICIO[0].existencias)
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
const compareProductosSucursal = async (servicio, cantidad) => {
    try {
        // obtener la cantidad de existencias que tiene el producto
        const DETALLE = await execute('SELECT cantidad FROM detalles_servicios_sucursales WHERE id_detalle = ?', [servicio])
        // comparar la cantidad que tiene en la db, con 
        // la que se quiere agregar el pedido              
        return (cantidad <= DETALLE[0].cantidad);

    } catch (error) {
        console.log(error);
    }
}

/**
 * método para obtener id en formato binario
 * de los datos obtenidos
 * @param {*} data respuesta con los datos recuperados
 * @param {*} col  campo 'Buffer' extraido de la db, la col debe existir en el parametro data
 * @returns binary
 */
const getBinary = (data, col) => {
    let id = [];
    console.log(data)
    // recorrer los datos obtenidos
    data.forEach(element => {
        console.log(element)
        // convertir a binario el elemento que se este recorriendo
        id.push(convertToBin(element[col]));
    });
    return id;
}

/**
 * Método para convertir una cadena hexctadecimal a binario
 * @param {*} hex arreglo con los valores enteros (cadena hexctadecimal) INCLUIR EL OBJETO COMPLETO CON type: 'Buffer'
 * @returns retorna valor hex a binario
 */
const convertToBinary = hex => {
    return Buffer.from(hex).toString('binary');
}
// exportar
module.exports = { validate, compareProductos, compareProductosSucursal, getBinary, convertToBinary };