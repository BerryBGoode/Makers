// requerir para hacer los queries, (constante)
const { getError } = require('../helpers/errors');
// método para ejecutar consultas
const { execute } = require('../MySQL');
// método para obtener en binario el id (cargar)
const { getBinary } = require('../helpers/validateHelpers');


/**
 * Método para cargar todos los tipos de servicios
 */
const get = async (req, response) => {
    if (req.headers.authorization) {
        // arreglo para guardar los datos que se puede retornar
        let data = [];
        execute('SELECT * FROM tipos_servicios')
            .then(res => {
                // obtener ids en binario
                let id = getBinary(res, 'id_tipo_servicio')
                let i = 0;
                // recorrer los datos encontrados
                res.forEach(element => {
                    // crear objeto con la col q se esta recorriendo
                    element = {
                        // obtener id
                        id_tipo_servicio: id[i],
                        tipo_servicio: element.tipo_servicio
                    }
                    // arregarlos al arreglo a retornar
                    data.push(element);
                    i++;
                });
                // después de recorrer los datos verificar el estado
                // de la petición
                if (response.status(200)) response.json(data);
            })
            .catch(er => response.status(500).send(er));
    } else {
        response.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para agregar 
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los dato
            const { tipo } = req.body;
            // query
            execute('INSERT INTO tipos_servicios(id_tipo_servicio, tipo_servicio) VALUES (UUID(), ?)', [tipo])
                .then(() => { res.status(201).send('Tipo de servicio agregado') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener los datos de 1 tipo de servicio
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los id
            const ID = req.params.id;
            // obtener los datos del registro con este
            const TIPO = await execute('SELECT * FROM tipos_servicios WHERE id_tipo_servicio = ?', [ID])
            // verificar sí la respuesta es correcta

            for (let i = 0; i < TIPO.length; i++) {
                id = {
                    id_tipo_servicio: getBinary(TIPO, 'id_tipo_servicio')[i]
                }
                Object.assign(TIPO[i], id);
            }
            if (res.status(200)) res.send(TIPO[0]);
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

//Metodo para actualizar los datos
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            //obtener el id del registro
            const ID = req.params.id;
            //obtener los datos de la peticion
            const { tipo } = req.body;

            //realizar actualizacion
            execute('UPDATE tipos_servicios SET tipo_servicio = ? WHERE id_tipo_servicio = ?', [tipo, ID])
                .then(() => { res.status(201).send('Tipo de servicio modificado') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            //obtener id del tipo servicio
            const ID = req.params.id;
            //realizar query
            execute('DELETE FROM tipos_servicios WHERE id_tipo_servicio = ?', [ID])
                .then(() => { res.status(201).send('Tipo de servicio eliminado') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

module.exports = { get, change, destroy, store, one }