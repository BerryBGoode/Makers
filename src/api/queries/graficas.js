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


const getEmpleadoCantidad = (req,res) =>   {
    execute('SELECT * c.Cargo, COALESCE(COUNT(e.id_empleado), 0) AS CantidadEmpleados FROM Cargos c LEFT JOIN Empleados e ON c.Id_cargo = e.id_cargo  GROUP BY c.Cargo;')
    .then(row =>    {
        es.status(200).json(rows)  
    }).catch(rej => {
        res.status(406).send({ error: getError(rej) })
    })
}

const getCliente = (req,res) =>   {
    execute('SELECT * FROM clientes')
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
module.exports = { getVentas, getEmpleadoCantidad, getCliente, getEmpleadoCargos}; 