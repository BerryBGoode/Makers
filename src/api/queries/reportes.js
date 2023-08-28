// importar los métodos para realizar las consultas SQL y para obtener los errores
const { getError } = require('../helpers/errors');
const { execute } = require('../MySQL');

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
        if (res.status(200)) res.json(RESERVACIONES);
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

const getEmpleadosCargos = async (req, res) => {
    try {
        const EMPLEADOS = await execute('SELECT e.nombres, e.apellidos, c.cargo FROM empleados e JOIN cargos c ON e.id_cargo = c.id_cargo');
        if (res.status(200)) res.json(EMPLEADOS)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }

}

const getProdSucursal = async (req, res) => {
    try {
        const PRODUCTOS = await execute('SELECT ss.nombre_sucursal, s.nombre_servicio, ds.cantidad FROM detalles_servicios_sucursales ds JOIN sucursales ss ON ds.id_sucursal = ss.id_sucursal JOIN servicios s ON ds.id_servicio = s.id_servicio WHERE ds.id_sucursal = ?');
        if (res.status(200)) res.json(PRODUCTOS)
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

const getEmpleadosOrdenes = async (req, res) => {
    try {
        const EMPLEADOS = await execute(`
        CREATE VIEW vista_empleados_mas_ordenes AS
        SELECT e.id_empleado, e.nombres, e.apellidos, COUNT(o.id_orden) AS cantidad_ordenes
        FROM empleados e
        LEFT JOIN ordenes o ON e.id_empleado = o.id_empleado
        GROUP BY e.id_empleado, e.nombres, e.apellidos
        ORDER BY cantidad_ordenes DESC
        LIMIT 5;        
        `);
        if (res.status(200)) res.json(EMPLEADOS);
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
        if (res.status(200)) res.json(RESERVACIONES);
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


const getTipoServicios = async (req, res) => {
    try {
        const SERVICIOS = await execute(`
        SELECT s.id_servicio, s.nombre_servicio, t.tipo_servicio
        FROM servicios s
        INNER JOIN tipos_servicios t ON s.id_tipo_servicio = t.id_tipo_servicio
        `);
        if (res.status(200)) res.json(SERVICIOS);
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
        let cliente = req.params.cliente
        const ORDENES = await execute(`
            SELECT c.nombres, c.apellidos, c.dui,
            date_format(o.fecha, '%Y-%m-%d') as fecha, 
            CONCAT(TIME_FORMAT(o.hora, '%h:%i'), ' ', IF(TIME_FORMAT(o.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
            FROM ordenes o
            INNER JOIN clientes c ON c.id_cliente = o.id_cliente
            WHERE c.id_cliente = ?
        `, [cliente]);
        if (res.status(200)) res.json(ORDENES);
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Metodo para obtener las reservaciones que tiene un cliente 
 * @param {*} req cuerpo de la petición (cliente)
 * @param {*} res respuesta del servidor
 */
const historialReservacionesCliente = async (req, res) => {
    try {
        // obtener las reservaciones por cliente
        let usuario = req.params.usuario;

        const RESERVACIONES = await execute(`
            SELECT CONCAT(c.nombres, ' ', c.apellidos) as Cliente, c.dui as DuiCliente, 
	        CONCAT(e.nombres,' ' ,e.apellidos) as Empleado, e.dui as DuiEmpleado,
            DATE_FORMAT(r.fecha, '%Y-%m-%d') as fecha,     
            CONCAT(TIME_FORMAT(r.hora, '%h:%i'), ' ', IF(TIME_FORMAT(r.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
            FROM reservaciones r
            INNER JOIN clientes c ON c.id_cliente = r.id_cliente
            INNER JOIN empleados e ON e.id_empleado = r.id_empleado
            WHERE c.id_cliente = ?
        `, [usuario])
        if (RESERVACIONES) {
            if (res.status(200)) res.json(RESERVACIONES);
        }
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Método para obtener las ventas realizadas por fecha elegida por usuario
 * @param {*} req cuerpo de la petición (parametro: día)
 * @param {*} res respuesta del servidor ante la petición
 */
const ventasDia = async (req, res) => {
    try {
        let fecha = req.params.fecha;
        const VENTAS = await execute(`
            SELECT c.nombres, c.apellidos, c.dui, 
            DATE_FORMAT(o.fecha, '%Y-%m-%d') as fecha,     
            CONCAT(TIME_FORMAT(o.hora, '%h:%i'), ' ', IF(TIME_FORMAT(o.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
            FROM ordenes o
            INNER JOIN clientes c ON c.id_cliente = o.id_cliente
            WHERE o.fecha = ?    
        `, [fecha]);
        if (VENTAS) {
            if (res.status(200)) res.json(VENTAS);
        }
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Método para obtener las ventas realizadas durante el mes elegido
 * @param {*} req cuerpo de la petición (parametro: mes)
 * @param {*} res respuesta del servidor ante la petición
 */
const ventasMes = async (req, res) => {
    try {
        let mes = req.params.mes;
        const VENTAS = await execute(`
            SELECT c.nombres, c.apellidos, c.dui, 
            DATE_FORMAT(o.fecha, '%Y-%m-%d') as fecha,     
            CONCAT(TIME_FORMAT(o.hora, '%h:%i'), ' ', IF(TIME_FORMAT(o.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
            FROM ordenes o
            INNER JOIN clientes c ON c.id_cliente = o.id_cliente
            WHERE MONTH(o.fecha) = ? AND YEAR(CURRENT_DATE) = YEAR(o.fecha)
        `, [mes]);
        if (VENTAS && res.status(200)) res.json(VENTAS);
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

/**
 * Método para obtener las reservaciones por mes seleccionado
 * @param {*} req cuerpo de la petición (parametro: mes)
 * @param {*} res respuesta del servidor ante la petición
 */
const reservacionesMes = async (req, res) => {
    try {
        // obtener el mes seleccionado por el cliente
        let mes = req.params.mes;
        const RESERVACIONES = await execute(`
            SELECT CONCAT(c.nombres, ' ', c.apellidos) as Cliente, c.dui as DuiCliente, 
	        CONCAT(e.nombres,' ' ,e.apellidos) as Empleado, e.dui as DuiEmpleado,
            DATE_FORMAT(r.fecha, '%Y-%m-%d') as fecha,     
            CONCAT(TIME_FORMAT(r.hora, '%h:%i'), ' ', IF(TIME_FORMAT(r.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
            FROM reservaciones r
            INNER JOIN clientes c ON c.id_cliente = r.id_cliente
            INNER JOIN empleados e ON e.id_empleado = r.id_empleado
            WHERE MONTH(r.fecha) = ? AND YEAR(r.fecha) = YEAR(CURRENT_DATE)`,
            [mes]
        );
        if (RESERVACIONES && res.status(200)) res.json(RESERVACIONES);
    } catch (error) {
        res.status(406).send({ error: getError(error) });
    }
}

// exportando métodos para llamarlo en routes/reportes.routes.js
module.exports = {
    getProxReservaciones, getPrevReservaciones, getLessProductos,
    historialComprasCliente, historialReservacionesCliente, ventasDia, ventasMes,
    reservacionesMes
};