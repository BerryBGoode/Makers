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
        .then(filled => {
            // enviar mensaje exitoso
            res.status(200).send('Cargo agregado');
        }).catch(rej => {
            res.status(200).send({error: getError(rej['sqlState'])});
        })
        // console.log(SQL);
        // POOL.query('INSERT INTO cargos(cargo) VALUES ($1)', [cargo],
        //     // funcion
        //     (err, result) => {
        //         // verificar sí hubo un error                                
        //         if (err) {

        //             if (err.code === '23505') {
        //                 // enviar error el cliente
        //                 er = 'Dato unico ya registrado';
        //             } else {
        //                 er = err.message;
        //             }
        //             res.json({ error: er });
        //             // sí es ejecuta esto, el status 201 no se enviará
        //             // return;                    

        //         } else {
        //             msg = 'Servicio agregado';
        //         }
        //         res.status(201).send(msg);

        //     })
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
        const CARGO = mysql.query('SELECT * FROM cargos WHERE id_cargo = $1', [ID]);
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
            // verificar sí hubo un error                                
            if (err) {

                if (err.code === '23505') {
                    // enviar error el cliente
                    er = 'Dato unico ya registrado';
                } else {
                    er = err.message;
                }
                res.json({ error: er });
                // sí es ejecuta esto, el status 201 no se enviará
                // return;                    

            } else {
                msg = 'Servicio agregado';
            }
            res.status(201).send(msg);
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