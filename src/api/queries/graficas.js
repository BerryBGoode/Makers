// requerir método para ejecutar las peticiones a base
const { request } = require('express');
const { execute } = require('../MySQL');
// requerir método para obtener el código de error y enviar mensaje
const { getError } = require('../helpers/errors')

/**
 * Método para obtener las ventas del año actual
 * @param {*} req cuerpo de la petición
 * @param {*} res respuesta del servidor
 */
const getVentas = (req, res) => {
    // verificar la autenticación
    if (req.headers.authorization) {
        // ejecutar sentencia para obtener la ventas por año
        execute('SELECT * FROM ventas')
            .then(rows => {
                // enviar respuesta
                res.status(200).json(rows)
            }).catch(rej => {
                // enviar error interno
                res.status(500).send(getError(rej))
            })
    } else {
        res.status(401).send('Debe iniciar sesión antes');
    }
}

/**
 * Método para obtener las ordenes por mes
 * @param {*} req cuerpo de la petición (mes)
 * @param {*} res respuesta del reservidor
 */
const ordenesByMes = async (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        // obtener el mes seleccionado por el cliente
        let mes = req.params.mes;
        try {
            // ejecutar la sentencia para obtener las ventas según mes
            let sql = `SELECT count(o.fecha) as ordenes, date_format(o.fecha, '%Y-%m-%d') as fecha
                        FROM ordenes o
                        WHERE MONTH(o.fecha) = ?
                        GROUP BY YEAR(o.fecha), MONTH(o.fecha), DAY(o.fecha)
                        ORDER BY o.fecha DESC`
            let ordenes = await execute(sql, [mes]);
            // sí se encontraron ventas retornar los datos
            if (ordenes) {
                res.status(200).json(ordenes)
            }
        } catch (error) {
            // enviar error en la petición
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe iniciar sesió antes');
    }

}

/** Método para obtener la cantidad de ventas hecho por un empleado*/
const getEmpleadoCantidad = (req, res) => {
    // verficar autenticación
    if (req.headers.authorization) {

    } else {

    }
}
// método para obtener los clientes destacados
const getCliente = (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        // ejecutar sentencia para obtener los clientes destacados
        execute(`
        SELECT COUNT(o.id_orden) AS ordenes, concat(c.nombres, ' ', c.apellidos) AS cliente
        FROM ordenes o
        INNER JOIN clientes c ON c.id_cliente = o.id_cliente
        GROUP BY cliente
        ORDER BY ordenes DESC LIMIT 7`
        )
            .then(rows => {
                // respuesta la respuesta con los datos
                res.status(200).json(rows);
            }).catch(rej => {
                // respuesta con el error
                res.status(500).send(getError(rej));
            })
    } else {
        res.status(401).send('Debe iniciar sesión antes');
    }


}
// método para obtener las ventas generales por sucursal 
const getFacturasSucursales = (req, res) => {
    if (req.headers.authorization) {
        // ejecutar sentencia SQL para obtener las ventas por sucursal
        execute('SELECT s.id_sucursal, s.nombre_sucursal AS nombre_sucursal, COUNT(f.id_factura) AS ventas FROM sucursales s LEFT JOIN facturas f ON s.id_sucursal = f.id_sucursal GROUP BY s.id_sucursal, s.nombre_sucursal ORDER BY ventas DESC')
            .then(row => {
                res.status(200).json(row)
            }).catch(rej => {
                res.status(500).send(getError(rej))
            })
    } else {
        res.status(401).send('Debe iniciar sesión antes');
    }
}

/**
 * Método para obtener los  servicios más vendidos según el tipo de servicio
 * @param {*} req 
 * @param {*} res 
 */
const getServiciosVendidos = (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        let tipo = req.params.tipo;
        execute(`
                SELECT COUNT(d.id_detalle) AS cantidad, s.nombre_servicio
                FROM servicios s
                LEFT JOIN detalles_servicios_sucursales ds ON ds.id_servicio = s.id_servicio
                LEFT JOIN detalles_ordenes d ON d.id_detalle_servicio = ds.id_detalle
                LEFT JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio
                WHERE t.id_tipo_servicio = ?
                GROUP BY s.nombre_servicio
                ORDER BY cantidad DESC LIMIT 3`
            , [tipo])
            .then(rows => {
                res.status(200).json(rows)
            }).catch(rej => {
                res.status(406).send({ error: getError(rej) })
            })
    } else {
        res.status(401).send('Debe iniciar sesión antes');
    }
}

const getProductosVendidos = (req, res) => {
    // verificar autenticiación
    execute(`
            SELECT COUNT(d.id_detalle) AS cantidad, s.nombre_servicio
            FROM servicios s
            LEFT JOIN detalles_servicios_sucursales ds ON ds.id_servicio = s.id_servicio
            LEFT JOIN detalles_ordenes d ON d.id_detalle_servicio = ds.id_detalle
            LEFT JOIN tipos_servicios t ON t.id_tipo_servicio = s.id_tipo_servicio
            WHERE t.tipo_servicio = 'Producto'
            GROUP BY s.nombre_servicio
            ORDER BY cantidad DESC LIMIT 7`
        ,)
        .then(rows => {
            res.status(200).json(rows)
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

const reservacionesMes = (req, res) => {
    let mes = req.params.mes;
    execute(`
        SELECT COUNT(*) reservaciones, DATE_FORMAT(r.fecha, '%Y-%m-%d') as fecha
        FROM reservaciones r
        WHERE YEAR(r.fecha) = YEAR(CURRENT_DATE) AND MONTH(r.fecha) = ?
        GROUP BY fecha
        ORDER BY reservaciones DESC LIMIT 10
    `, [mes])
        .then(rows => { res.status(200).json(rows) })
        .catch(rej => { res.status(406).send({ error: getError(rej) }) });
}

const getClienteporfecha = (req, res) => {
    execute('SELECT r.fecha, c.nombre AS nombre_cliente FROM reservaciones r JOIN clientes c ON r.id_cliente = c.id')
        .then(row => {
            es.status(200).json(rows)
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })

}

const getEmpleadoCargos = (req, res) => {
    execute(`SELECT count(e.id_cargo) as count, c.cargo
            FROM cargos c
            LEFT JOIN empleados e ON c.id_cargo = e.id_cargo
            GROUP BY c.cargo
            ORDER BY count DESC`
    )
        .then(rows => {
            res.status(200).json(rows)
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

const getHoraMes = (req, res) => {
    let mes = req.params.mes;
    execute(`
        SELECT COUNT(*) as ventas, 
        CONCAT(TIME_FORMAT(o.hora, '%h:%i'), ' ', IF(TIME_FORMAT(o.hora, '%h:%i') < 12, 'AM', 'PM')) as hora
        FROM ordenes o
        WHERE YEAR(o.fecha) = YEAR(CURRENT_DATE) AND MONTH(o.fecha) = ?
        GROUP BY HOUR(o.hora)
        ORDER BY ventas DESC LIMIT 7        
    `, [mes]).then(rows => {
        res.status(200).json(rows)
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) });
    })
}


// exportar los métodos para obtener los datos para pintar las gráficas
module.exports = {
    getVentas, ordenesByMes, getEmpleadoCantidad, getCliente,
    getEmpleadoCargos, getClienteporfecha, getFacturasSucursales, getServiciosVendidos,
    getHoraMes, reservacionesMes, getProductosVendidos
}; 