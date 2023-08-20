// importar los métodos para realizar las consultas SQL y para obtener los errores
const { getError } = require('../helpers/errors')
const { execute } = require('../MySQL')

/**
 * Método para obtener las próximas reservaciones, retorna la respuesta del servidor
 * @param {*} req datos de la petición
 * @param {*} res respuesta del servidor
 */
const getProxReservaciones = async (req, res) => {
    try {
        const RESERVACIONES = await execute(`
        SELECT 
            concat(c.nombres, ' ', c.apellidos) as cliente, c.dui as duicliente, 
            concat(e.nombres, ' ', e.apellidos) as empleado, e.dui as duiempleado, 
            date_format(r.fecha, '%Y-%m-%d') as fecha,
            TIME_FORMAT(r.hora, '%h:%i') as hora
        FROM reservaciones r
        INNER JOIN empleados e ON e.id_empleado = r.id_empleado
        INNER JOIN clientes c ON c.id_cliente = r.id_cliente
        WHERE fecha > CURRENT_DATE`);
        if (res.status(200)) res.json(RESERVACIONES)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Método para obtener de la db las reservaciones previas a el día que se console
 * @param {*} req datos de la petición
 * @param {*} res respues del servidor
 */
const getPrevReservaciones = async (req, res) => {
    try {
        const RESERVACIONES = await execute(`
        SELECT 
            concat(c.nombres, ' ', c.apellidos) as cliente, c.dui as duicliente, 
            concat(e.nombres, ' ', e.apellidos) as empleado, e.dui as duiempleado, 
            date_format(r.fecha, '%Y-%m-%d') as fecha,
            TIME_FORMAT(r.hora, '%h:%i') as hora
        FROM reservaciones r
        INNER JOIN empleados e ON e.id_empleado = r.id_empleado
        INNER JOIN clientes c ON c.id_cliente = r.id_cliente
        WHERE fecha < CURRENT_DATE`);
        if (res.status(200)) res.json(RESERVACIONES)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Método para obtener el nombre de la sucursal, el producto, la cantidad y el precio
 * de los productos que estan a punto de agotarse (cantidad < 10)
 * @param {*} req datos de la petición
 * @param {*} res respuestas del servidor
 */
const getLessProductos = async (req, res) => {
    try {
        const PRODUCTOS = await execute(`
            SELECT sc.nombre_sucursal, sr.nombre_servicio, ds.cantidad, sr.precio
            FROM detalles_servicios_sucursales ds
            INNER JOIN servicios sr ON sr.id_servicio = ds.id_servicio
            INNER JOIN sucursales sc ON sc.id_sucursal = ds.id_sucursal
            WHERE ds.cantidad < 10
        `)
        if (res.status(200)) res.json(PRODUCTOS);
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Metodo para obtener las ordenes que tiene un cliente 
 * @param {*} req cuerpo de la petición (cliente)
 * @param {*} res respuesta del servidor
 */
const historialComprasCliente = async (req, res) => {
    try {
        // obtener el cliente que se decea saber el historial de ordenes
        const cliente = req.params.cliente
        const ORDENES = await execute(`
            SELECT c.nombres, c.apellidos, c.dui,
            date_format(o.fecha, '%Y-%m-%d') as fecha, 
            TIME_FORMAT(o.hora, '%h:%i') as hora
            FROM ordenes o
            INNER JOIN clientes c ON c.id_cliente = o.id_cliente
            WHERE c.id_cliente = ?
        `, [cliente]);
        if (res.status(200)) res.json(ORDENES)
    } catch (error) {
        res.status(406).send({ error: getError(error) })
    }
}

// exportando métodos para llamarlo en routes/reportes.routes.js
module.exports = { getProxReservaciones, getPrevReservaciones, getLessProductos, historialComprasCliente }