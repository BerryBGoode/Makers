// requerir del pool con los attrs de la conexión
const POOL = require('../db');

/**
 * Método para agregar un horario
 */
const store = (req, res) => {
    try {
        // obtener los datos de la petición
        const { inicio, cierre} = req.body;
        // realizar query
        POOL.query('INSERT INTO horarios(hora_apertura, hora_cierre) VALUES ($1, $2)', [inicio, cierre], (err, result) => {
            if (err) {
                res.json({error: err.message});
                return;
            }
            res.status(201).send('Horario agregado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

module.exports = { store }