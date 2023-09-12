// requerir la mysql con los datos de la conexión
const { mysql, pg } = require('../db');

// método para ejecutar sentencias en MySQL
const { execute } = require('../MySQL');
// método para obtener binarios de los ids
const { getBinary } = require('../helpers/validateHelpers')
const { getError } = require('../helpers/errors');

let msg;
/**
 * Método para obtener los tipos de servicios 
 */
const getServicios = (req, res) => {
    if (req.headers.authorization) {
        try {
            // declarar valor diferente al que se espera
            let producto = 'Producto';
            // realizar query
            execute('SELECT * FROM tipos_servicios WHERE NOT tipo_servicio = ?', [producto])
                // verificar sí la respuesta es la esperada
                .then(tipos => {
                    for (let i = 0; i < tipos.length; i++) {
                        id = {
                            id_tipo_servicio: getBinary(tipos, 'id_tipo_servicio')[i]
                        }
                        Object.assign(tipos[i], id);
                    }
                    res.status(200).send(tipos);
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener todos los servicios
 */
const get = (req, response) => {
    if (req.headers.authorization) {
        // arreglo vacíos para guardar los datos encontrados
        let data = [];
        // realizar query
        let producto = 'Producto';

        execute('SELECT id_servicio, nombre_servicio, descripcion, format(precio, 2) as precio, tipo_servicio, id_tipo_servicio FROM servicios_view WHERE tipo_servicio NOT LIKE ?', [producto])
            .then(res => {
                // obtener ids y convertirlos a binario
                let id = getBinary(res, 'id_servicio');
                let id_tipo = getBinary(res, 'id_tipo_servicio');
                let i = 0;
                // recorrer las cantidad de datos encontrados
                res.forEach(element => {
                    // hacer un obj con los datos recuperados
                    element = {
                        id_servicio: id[i],
                        nombre_servicio: element.nombre_servicio,
                        descripcion: element.descripcion,
                        tipo_servicio: element.tipo_servicio,
                        id_tipo_servicio: id_tipo[i],
                        precio: element.precio
                    }
                    // arregar obj al arreglo de objetos
                    data.push(element);
                    i++;
                });
                if (response.status(200)) response.json(data);
            })
            // enviar mensaje de error
            .catch(er => response.status(500).send(er));
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para agregar un servicio
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            let estado = 1;
            // obtener los datos de la petición
            const { tipo, nombre, descripcion, precio, existencias } = req.body;
            // realizar query
            execute('INSERT INTO servicios(id_servicio, id_tipo_servicio, descripcion, precio, existencias, estado, nombre_servicio) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
                [tipo, descripcion, precio, existencias, estado, nombre])
                .then(() => { res.status(201).send('Servicio agregado') })
                .catch(rej => { res.status(500).send(getError(rej)) });
        } catch (error) {
            // enviar mensaje al cliente
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener los datos del registro especificado 
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id 
            const ID = req.params.id;
            // realizar query
            const SERVICIO = await execute('SELECT descripcion, precio, id_tipo_servicio, nombre_servicio FROM servicios WHERE id_servicio = ?', [ID])
            for (let i = 0; i < SERVICIO.length; i++) {
                let id = {
                    id_tipo_servicio: getBinary(SERVICIO, 'id_tipo_servicio')[i]
                }
                Object.assign(SERVICIO[i], id);
            }
            // verificar sí el resultado es el esperado para enviar los datos
            if (res.status(200)) res.send(SERVICIO[0]);
        } catch (error) {
            // enviar mensaje de error al cliente
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para actualizar los datos del servicio recibido
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del registro
            const ID = req.params.id;
            // obtener los datos de la petición
            const { tipo, nombre, descripcion, precio } = req.body;
            // realizar actualización
            execute('UPDATE servicios SET descripcion = ?, precio = ?, id_tipo_servicio = ?, nombre_servicio = ? WHERE id_servicio = ?',
                [descripcion, precio, tipo, nombre, ID]).then(() => {
                    res.status(201).send('Servicio modificado')
                }).catch(rej => { res.status(500).send(getError(rej)) })

        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para eliminar un servicio
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id del servicio
            const ID = req.params.id;
            // realizar query
            execute('DELETE FROM servicios WHERE id_servicio = ?', [ID])
                .then(() => {
                    res.status(201).send('Servicio eliminado')
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

module.exports = { get, getServicios, store, one, change, destroy }