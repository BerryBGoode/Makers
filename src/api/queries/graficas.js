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

// Consulta para obtener la cantidad de reservaciones por fecha en un mes, dividido por semana
const getMesRE = (req, res) => {
    execute('select WEEK(fecha) AS semana, count (id_reservacion) from reservaciones where MONTH(NOW()) = MONTH(fecha) group by semana')
        .then(rows => {
            res.status(200).json(rows)        
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

// Consulta para obtener el top 7 de productos
const getTopP = (req, res) => {
    execute('select nombre_servicio, count (id_servicio) cantidad from servicios inner join detalle_ordenes using (id_servicio) group by nombre_servicio order by cantidad desc limit 7')
        .then(rows => {
            res.status(200).json(rows)        
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

// exportar los métodos para obtener los datos para pintar las gráficas
module.exports = { getVentas };
module.exports = { getMesRE };
module.exports = { getTopP };
