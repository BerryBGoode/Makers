// requerir método para ejecutar las peticiones a base
const { execute } = require('../MySQL');
// requerir método para obtener el código de error y enviar mensaje
const { getError } = require('../helpers/errors')

/**
 * Método para obtener las ventas del año actual
 * @param {*} req cuerpo de la petición
 * @param {*} res respuesta del servidor
 */
const getVentas = (req, res) => {
    execute('SELECT * FROM ventas')
        .then(rows => {
            res.status(200).json(rows)
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

/**
 * Método para obtener las ordenes por mes
 * @param {*} req cuerpo de la petición (mes)
 * @param {*} res respuesta del reservidor
 */
const ordenesByMes = async (req, res) => {
    let mes = req.params.mes;
    try {
        let sql = `SELECT count(o.fecha) as ordenes, date_format(o.fecha, '%Y-%m-%d') as fecha
                    FROM ordenes o
                    WHERE MONTH(o.fecha) = ?
                    GROUP BY YEAR(o.fecha), MONTH(o.fecha), DAY(o.fecha)
                    ORDER BY o.fecha DESC`
        let ordenes = await execute(sql, [mes]);
        if (ordenes) {
            res.status(200).json(ordenes)
        }
    } catch (error) {
        res.status(406).send({ error: getError(error) })
    }

}

const getEmpleadoCantidad = (req,res) =>   {
    execute('SELECT * c.Cargo, COALESCE(COUNT(e.id_empleado), 0) AS CantidadEmpleados FROM Cargos c LEFT JOIN Empleados e ON c.Id_cargo = e.id_cargo  GROUP BY c.Cargo;')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}

const getCliente = (req,res) =>   {
    execute('SELECT c.nombres AS nombres, COUNT(o.id_cliente) AS total_ordenes FROM clientes c JOIN ordenes o ON c.id_cliente = o.id_cliente  GROUP BY c.id_cliente  ORDER BY total_ordenes DESC')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
    
}

const getFacturasSucursales = (req,res) =>  {
    execute('SELECT s.id_sucursal, s.nombre_sucursal AS nombre_sucursal, COUNT(f.id_factura) AS cantidad_facturas FROM sucursales s LEFT JOIN facturas f ON s.id_sucursal = f.id_sucursal GROUP BY s.id_sucursal, s.nombre_sucursal;')
    .then(row =>    {
        es.status(200).json(rows)
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}

const getServiciosVendidos = (req, res) =>  {
    execute('SELECT * FROM vista_productos_mas_vendidos')
    .then(row =>    {
        es.status(200).json(rows)
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}
   

const getClienteporfecha = (req,res) =>   {
    execute('SELECT r.fecha, c.nombre AS nombre_cliente FROM reservaciones r JOIN clientes c ON r.id_cliente = c.id')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
    
}

const getEmpleadoCargos = (req,res) =>   {
    execute('SELECT o.hora, count(*) as ordenes FROM ordenes o GROUP BY hora ORDER BY ordenes DESC;')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
    
}
    


// exportar los métodos para obtener los datos para pintar las gráficas
module.exports = { getVentas, ordenesByMes, getEmpleadoCantidad, getCliente, getEmpleadoCargos, getEmpleado, getFacturasSucursales, getServiciosVendidos}; 