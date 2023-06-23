// requerir del pool con los attrs de la conexión
const POOL = require('../db');

/**
 * Método para agregar un horario
 */
const store = (req, res) => {
    try {
        // obtener los datos de la petición
        const { inicio, cierre } = req.body;
        // realizar query
        POOL.query('INSERT INTO horarios(hora_apertura, hora_cierre) VALUES ($1, $2)', [inicio, cierre], (err, result) => {
            if (err) {
                res.json({ error: err.message });
                return;
            }
            res.status(201).send('Horario agregado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para obtener los datos de 1 horario enviado por la url
 */
const one = async (req, res) => {
    try {
        // obtener id de los parametros de la url
        const ID = parseInt(req.params.id);
        // formato de hora HH12:mm
        let formato = 'HH12:MI';
        // realizar consulta
        const HORARIO = await POOL.query('SELECT id_horario, to_char(hora_apertura, $1) as inicio, to_char(hora_cierre, $1) as cierre FROM horarios WHERE id_horario = $2', [formato, ID]); // con * tardo .118 mls
        // verificar respuesta satisfeca
        if (res.status(200)) res.json(HORARIO.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Metodo para actualizar datos, del registro según la petición
 */
const change = (req, res) => {
    try {
        // obtener id del registro
        const ID = parseInt(req.params.id);
        // obtener los datos de la petición
        const { inicio, cierre } = req.body;
        // realizar query
        POOL.query('UPDATE horarios SET hora_apertura = $1, hora_cierre = $2 WHERE id_horario = $3', [inicio, cierre, ID],
            (err, result) => {
                // verificar sí hubo un problema
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
                res.status(201).send('Horario modificado');
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

module.exports = { store, one, change }