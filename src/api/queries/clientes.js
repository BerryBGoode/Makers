// requerir el modulo con los attrs de la conexión
const { pg } = require('../db');
// requerir del encryptador
const { encrypt } = require('../helpers/encrypt');
const { getError } = require('../helpers/errors')

const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers')

let msg;
// método para obtener los clientes
// req (obtiene parametros en la consulta)
// res (retorna valor según resultado)
const get = async (req, res) => {

    if (req.headers.authorization) {
        let data = [];
        let i = 0;
        execute('SELECT * FROM clientes_view')
            .then(ful => {
                // obtener y convertir a binario ids recuperados
                let id = getBinary(ful, 'id_cliente');

                // recorrer los valores encontrados
                ful.forEach(element => {
                    // asignar objeto con del elemento q se recorrer
                    element = {
                        id_cliente: id[i],
                        nombres: element.nombres,
                        apellidos: element.apellidos,
                        correo: element.correo,
                        dui: element.dui,
                        telefono: element.telefono,
                        consumo: element.consumo
                    }

                    // agregar al arreglo
                    data.push(element);
                    i++;
                });
                if (res.status(200)) res.json(data);
            })
            .catch(rej => res.status(500).json({ error: rej }))

    } else {
        res.status(401).json({ error: 'Debe iniciar sesión antes' })
    }

}

/** Método para guardar datos del cliente
 * req, datos enviados del front
 * res, respuesta del servidor
 */
const store = (req, res) => {
    try {
        // asignar a un arreglo los valores del req
        const { nombres, apellidos, dui, telefono, correo, clave, estado } = req.body;
        // preparando query con los datos
        execute('INSERT INTO clientes (id_cliente, nombres, apellidos, dui, telefono, correo, clave, estado) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
            [nombres, apellidos, dui, telefono, correo, encrypt(clave), estado])
            .then(() => {
                if (res.status(201)) res.send('Cliente agregado');
            }).catch(rej => {
                res.status(406).send({ error: getError(rej['errno']) });
            })

    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para obtener cliente, según el registro seleccionado
 * obtiene unicamente 1 registro
 * req, datos de la petición
 * res, respuesta del servidor
 */
const one = async (req, res) => {
    try {
        // obtener idcliente de los parametros de la url
        const IDCLIENTE = req.params.id;
        // realizar consulta
        execute('SELECT id_cliente, nombres, apellidos, dui, telefono, correo FROM clientes WHERE id_cliente = ?', [IDCLIENTE])
            .then(filled => {
                let _cliente = getBinary(filled, 'id_cliente')
                for (let i = 0; i < filled.length; i++) {
                    let id = {
                        id_cliente: _cliente[i]
                    }
                    Object.assign(filled[i], id)
                }
                if (res.status(200)) res.send(filled[0])
            })
            .catch(rej => {
                res.status(500).send(getError(rej['errno']));
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para actualizar los datos de un cliente, cliente seleccionada
 * req, datos del front
 * res, respuesta del servidor
 */
const change = (req, res) => {
    try {
        // convertir a entero el id recibido de la ruta 
        const IDCLIENTE = req.params.id;
        // asignar a un arreglo los valores del req
        const { nombres, apellidos, dui, telefono, correo, estado } = req.body;
        // realizar transferencia SQL
        execute('UPDATE clientes SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, estado = ? WHERE id_cliente = ?',
            [nombres, apellidos, dui, telefono, correo, estado, IDCLIENTE])
            .then(() => {
                // sí la petición fue exitosa mandar mensaje al cliente
                res.status(201).send('Cliente modificado')
            }).catch(rej => {
                // de lo contrario enviar error obtenido del catch
                res.status(406).send({error: getError(rej['errno'])})
            })        
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}


/**
 * Método para eliminar un cliente selccionado
 * req, datos del front
 * res, respuesta del servidor
 */
const destroy = (req, res) => {
    let msg;
    try {
        // console.log(req.params.id)
        // obtener el idcliente del parametro de la ruta
        const IDCLIENTE = parseInt(req.params.id);
        // realizar consulta, enviar un array con los parametros y metodo para capturar error
        POOL.query('DELETE FROM clientes WHERE id_cliente = $1', [IDCLIENTE], (err, result) => {

            // veficar errores
            if (err) {
                if (err.code) msg = getError(err.code);
                res.json({ error: msg });
            }
            // verificar sí existe error
            // sino enviar estado exitoso
            else { msg = 'Cliente eliminado'; }
            if (!err) {
                res.status(201).send(msg);
            }
        })
    } catch (error) {
        // capturar error
        console.error(error);
    }
}
// exportar funciones
module.exports = { get, store, one, change, destroy }