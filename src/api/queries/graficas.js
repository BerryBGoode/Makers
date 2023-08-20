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

// exportar los métodos para obtener los datos para pintar las gráficas
module.exports = { getVentas, ordenesByMes };