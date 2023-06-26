// requerir el modulo con los attrs de la conexión
const POOL = require('../db');

// metodo para obtener los cargos
// req (obtiene parametros de consulta)
// res (retorna valor segun resultado)
const get = async (req, res) => {
    try {
        //realizar consulta
        const CARGOS = await POOL.query('SELECT * FROM cargos');
        //verificar el estado
        if (res.status(200)) res.json(CARGOS.rows)
    } catch (e) {
        console.error(e.message);
    }
}

/** Método para guardar cargos de los empleados
 * req, datos enviados del front
 * res, respuesta del servidor
 */
const store = async (req, res) => {
    try {
        // asignar a u arreglo los valores del req
        const { cargo } = req.body;
        // preparando query con los datos
        POOL.query('INSERT INTO cargos(cargo) VALUES ($1)', [cargo],
            // funcion
            (err, result) => {
                // verificar si existe error
                if (err) {
                    res.json({ error: err.message });
                }
                // sino enviar estado exitoso
                res.status(201).send('Cargo agregado');

            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener los datos del cargo selccionado
 */
const one = async (req, res) => {
    try {
        // obtener el id
        const ID = parseInt(req.params.id);
        // relizar query
        const CARGO = await POOL.query('SELECT * FROM cargos WHERE id_cargo = $1', [ID]);
        // sí la respuesta es la esperada retornar los datos
        if (res.status(200)) res.send(CARGO.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para actualizar los datos de cargos
 */
const change = (req, res) => {
    try {
        // obtener id del parametro de la url
        const ID = parseInt(req.params.id);
        // obtener los datos del cuerpo de la petición
        const { cargo } = req.body;
        // realizar SQL
        POOL.query('UPDATE cargos SET cargo = $1 WHERE id_cargo = $2', [cargo, ID], (err, result) => {
            // verificar sí ocurre un error
            if (err) {
                // verificar sí no se puede eliminar porque tiene datos dependientes                
                if (err.code === '23503') {
                    e = 'No se puede modificar o eliminar debido a pedidos asociados'
                } else {
                    e = err.message
                }
                // retornar el error
                res.json({ error: e });
                return;
            }
            res.status(201).send('Cargo modificado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}
/**
 * Metodo para eliminar un cargo
 */
const destroy = (req, res) => {
    try {
        // obtener el id 
        const ID = parseInt(req.params.id);
        // realizar consulta
        POOL.query('DELETE FROM cargos WHERE id_cargo = $1', [ID], (err, result) => {
            // verificar sí ocurre un error
            if (err) {
                // verificar sí no se puede eliminar porque tiene datos dependientes                
                if (err.code === '23503') {
                    e = 'No se puede modificar o eliminar debido a pedidos asociados'
                } else {
                    e = err.message
                }
                // retornar el error
                res.json({ error: e });
                return;
            }
            res.status(201).send('Cargo eliminado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get, store, destroy, one, change }