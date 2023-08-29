// requerir el modulo con los attrs de la conexión
// const { mysql, pg, execute } = require('../db');
const { execute } = require('../MySQL');
const { getError } = require('../helpers/errors');

const { getBinary } = require('../helpers/validateHelpers')

let msg;
// metodo para obtener los cargos
// req (obtiene parametros de consulta)
// res (retorna valor segun resultado)
const get = (req, res) => {

    // arreglo para guardar los datos a retornar 
    let data = [];
    // realizar 4query
    execute('SELECT BINARY(id_cargo) AS id_cargo, cargo FROM cargos')
        .then(response => {
            // obtener los ids
            let id = getBinary(response, 'id_cargo');
            // recorrer los ids encontrados
            let i = 0;
            response.forEach(element => {
                // declarar un objeto para obtener los datos 
                // y retornar al cliente
                element = {
                    // recueperar el id de los binarios convertidos
                    id_cargo: id[i],
                    // obtener los cargos obtenidos de la respuesta
                    cargo: element.cargo
                }
                // agregarselo al arreglo con los datos
                data.push(element);
                // sumar 1 al ciclo para recorrer todos los datos
                i++;
            });
            if (res.status(200)) res.json(data)
        })
        .catch(er => { res.status(500).send(er) });
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
        execute('INSERT INTO  cargos(id_cargo, cargo) VALUES (UUID(), ?)', [cargo])
            .then(() => {
                // enviar mensaje exitoso
                res.status(201).send('Cargo agregado');
            }).catch(rej => {
                res.status(406).send({ error: getError(rej) });
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
    const ID = req.params.id;
    // relizar query
    execute('SELECT * FROM cargos WHERE id_cargo = ?', [ID])
        .then(filled => {
            // convertir a binario los buffer encontrados
            let _cargo = getBinary(filled, 'id_cargo');
            // recorrer los registros
            for (let i = 0; i < filled.length; i++) {
                // obj con el id binario
                let id = {
                    id_cargo: _cargo[i]
                }
                // unir ambos objetos
                Object.assign(filled[i], id);
            }
            if (res.status(200)) res.json(filled[0]);
        })
        .catch(rej => {
            res.status(500).send(rej);
        })
}

/**
 * Método para actualizar los datos de cargos
 */
const change = (req, res) => {
    try {
        // obtener id del parametro de la url
        const ID = req.params.id;
        // obtener los datos del cuerpo de la petición
        const { cargo } = req.body;
        // realizar SQL
        execute('UPDATE cargos SET cargo = ? WHERE id_cargo = ?', [cargo, ID])
            .then(() => {
                res.status(201).send('Cargo modificado');
            })
            .catch(rej => {
                res.status(406).send({ error: getError(rej) });
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
        const ID = req.params.id;
        // realizar consulta
        execute('DELETE FROM cargos WHERE id_cargo = ?', [ID])
            .then(() => {
                res.status(200).send('Cargo eliminado');
            })
            .catch(rej => {
                res.status(406).send({ error: getError(rej) });
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get, store, destroy, one, change }