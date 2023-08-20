
// importar los métodos para realizar las consultas SQL y para obtener los errores
const { getError } = require('../helpers/errors')
const { execute } = require('../MySQL')

/**
 * Método para obtener las próximas reservaciones, retorna la respuesta del servidor
 * @param {*} req datos de la petición
 * @param {*} res respuesta del servidor
 */


const getEmpleadosOrdenes = async (req, res) => {
    try {
        const EMPLEADOS = await execute(`
        SELECT e.id_empleado, e.nombres, e.apellidos, COUNT(o.id_orden) AS cantidad_ordenes
        FROM empleados e
        LEFT JOIN ordenes o ON e.id_empleado = o.id_cliente
        GROUP BY e.id_empleado, e.nombres, e.apellidos
        ORDER BY cantidad_ordenes DESC
        LIMIT 5;
        
        `);
        if (res.status(200)) res.json(EMPLEADOS)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}


const getTipoServicios = async (req, res) => {
    try {
        const SERVICIOS = await execute(`
        SELECT s.id_servicio, s.nombre_servicio, t.tipo_servicio
        FROM servicios s
        INNER JOIN tipos_servicios t ON s.id_tipo_servicio = t.id_tipo_servicio
        `);
        if (res.status(200)) res.json(SERVICIOS)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}



// exportando métodos para llamarlo en routes/reportes.routes.js
module.exports = { getEmpleadosOrdenes, getTipoServicios }