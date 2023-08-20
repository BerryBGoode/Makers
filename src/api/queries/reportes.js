
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

const getEmpleadosCargos = async (req, res) => {
    try {
        const EMPLEADOS = await execute('SELECT e.nombres, e.apellidos, c.cargo FROM empleados e JOIN cargos c ON e.id_cargo = c.id_cargo');
        if(res.status(200)) res.json(EMPLEADOS)
    } catch (error) {
        res.status(406).send({  error: getError(error)});
    }

}

const getProdSucursal = async (req, res) => {
    try {
        const PRODUCTOS = await execute('SELECT ss.nombre_sucursal, s.nombre_servicio, ds.cantidad FROM detalles_servicios_sucursales ds JOIN sucursales ss ON ds.id_sucursal = ss.id_sucursal JOIN servicios s ON ds.id_servicio = s.id_servicio WHERE ds.id_sucursal = ?');
        if(res.status(200)) res.json(PRODUCTOS)
    } catch (error) {
        res.status(406).send({ error: getError(error)});
    }
}

const getEmpleadosOrdenes = async (req, res) => {
    try {
        const PRODUCTOS = await execute('SELECT e.id_empleado, e.nombres, e.apellidos, COUNT(o.id_orden) AS cantidad_ordenes FROM Empleados e LEFT JOIN Ordenes o ON e.id_empleado = o.id_cliente GROUP BY e.id_empleado ORDER BY cantidad_ordenes DESC LIMIT 5');
        if(res.status(200)) res.json(PRODUCTOS)
    } catch (error) {
        res.status(406).send({ error: getError(error)});
    }
}



// exportando métodos para llamarlo en routes/reportes.routes.js
module.exports = { getProxReservaciones, getEmpleadosCargos, getProdSucursal, getEmpleadosOrdenes }