// requerir del pool con los attrs de la conexión
const POOL = require('../db');

/**
 * Método para obtene los datos de los horarios
 */
const get = async (req, res) => {
    // definir parametros para formato de la consulta
    let formato = 'HH:12:MI', am = ' AM', pm = ' PM'
    try {
        // realizar query y enviando parametro
        const HORARIOS = await POOL.query('SELECT id_horario, CONCAT(to_char(hora_apertura, $1) || $2) , CONCAT(to_char(hora_cierre, $1) || $2) FROM horarios',
        [formato, am, pm]);
        // enviar datos sí la respuesta es satisfactoria
        if(res.status(200)) res.send(HORARIOS.rows);        
    } catch (er) {
        console.log(er);
        res.send({error: er});
    }
}

/**
 * Método para agregar un horario
 */
const store = (req, res) => {
    try {
        // obtener los datos de la petición
    } catch (error) {
        
    }
}

module.exports = { get }