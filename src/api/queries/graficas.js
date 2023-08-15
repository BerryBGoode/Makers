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


const getEmpleado = (req,res) =>   {
    execute('SELECT * FROM EmpleadoCargos')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}

const getFacturasSucursales = (req,res) =>  {
    execute('SELECT s.id_sucursal, s.nombre AS nombre_sucursal, COUNT(f.id_factura) AS cantidad_facturas FROM sucursales s LEFT JOIN facturas f ON s.id_sucursal = f.id_sucursal GROUP BY s.id_sucursal, s.nombre;')
    .then(row =>    {
        es.status(200).json(rows)
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}
   

// exportar los métodos para obtener los datos para pintar las gráficas
module.exports = { getVentas, getEmpleado, getFacturasSucursales};