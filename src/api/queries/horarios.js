// requerir del pool con los attrs de la conexión
const { execute } = require('../MySQL');
const POOL = require('../db');
const { getError } = require('../helpers/errors');
const { getBinary } = require('../helpers/validateHelpers');

/**
 * Método para agregar un horario
 */
const store = (req, res) => {
    if (req.headers.authorization || (req.body.path === '/primer/sucursal' && req.headers.origin === 'http://localhost:5173')) {
        try {
            // obtener los datos de la petición
            const { inicio, cierre } = req.body;
            // realizar query
            execute('INSERT INTO horarios(id_horario, hora_apertura, hora_cierre) VALUES (UUID(), ?, ?)', [inicio, cierre])
                .then(() => {
                    res.status(201).send('Horario agregado');
                }).catch(rej => { res.status(500).send(getError(rej)) })

        } catch (error) {

            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener los datos de 1 horario enviado por la url
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id de los parametros de la url
            const ID = req.params.id;
            // realizar consulta
            const HORARIO = await execute(`SELECT id_horario, hora_apertura as inicio, hora_cierre as cierre  FROM horarios WHERE id_horario = ?`, [ID]); // con * tardo .118 mls
            // verificar respuesta satisfeca        
            for (let i = 0; i < HORARIO.length; i++) {
                id = {
                    id_horario: getBinary(HORARIO, 'id_horario')[i]
                }
                Object.assign(HORARIO[i], id);
            }
            if (res.status(200)) res.json(HORARIO[0]);
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Metodo para actualizar datos, del registro según la petición
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id del registro
            const ID = req.params.id;
            // obtener los datos de la petición
            const { inicio, cierre } = req.body;
            // realizar query
            execute('UPDATE horarios SET hora_apertura = ?, hora_cierre = ? WHERE id_horario = ?', [inicio, cierre, ID])
                .then(() => {
                    res.status(201).send('Horario modificado');
                }).catch(rej => {
                    res.status(500).send(getError(rej));
                })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Metodo para eliminar un horario, que es el enviado en la url
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del horario
            const ID = req.params.id;
            // realizar query
            execute('DELETE FROM horarios WHERE id_horario = ?', [ID])
                .then(() => {
                    res.status(201).send('Horario eliminado');
                }).catch(rej => {
                    res.status(500).send(getError(rej))
                })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}
module.exports = { store, one, change, destroy }