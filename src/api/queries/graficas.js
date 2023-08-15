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

const getMesOr = (req, res) => {
    execute('select extract(month from fecha) mes, count (id_orden) from ordenes where fecha between ? and ? group by mes')
        .then(rows => {
            res.status(200).json(rows)        
        }).catch(rej => {
            res.status(406).send({ error: getError(rej) })
        })
}

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
module.exports = { getMesOr };
module.exports = { getTopP };
