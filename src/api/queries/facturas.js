// requiriendo la pool con los attrs de la conexión
const POOL = require('../db');

const { execute } = require('../MySQL')
const { getBinary } = require('../helpers/validateHelpers');
const { getError } = require('../helpers/errors');

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */


/**
 * Método para obtener la factura
 */
const get = async (req, res) => {
    if (req.headers.authorization) {
        // arreglo para guardar los datos
        let data = [];
        // promesa que ejecuta un SQL 
        execute('SELECT * FROM facturas')
            .then(filled => {
                // obtener los ids (Buffer)
                let _factura = getBinary(filled, 'id_factura'), _empleado = getBinary(filled, 'id_empleado'), _orden = getBinary(filled, 'id_orden'), _sucursal = getBinary(filled, 'id_sucursal');
                // recorrer los registros encontrados
                for (let i = 0; i < filled.length; i++) {
                    // crear un obj donde recupere los ids ya convertidos a binario
                    ids = {
                        id_factura: _factura[i],
                        id_empleado: _empleado[i],
                        id_orden: _orden[i],
                        id_sucursal: _sucursal[i],
                    }
                    // unir el obj con los arreglos con el que tiene los registrs
                    Object.assign(filled[i], ids);
                    data.push(filled[i]);
                }
                if (res.status(200)) res.json(data);
            })
            .catch(() => {
                res.status(500).json('Surgio un problema en el servidor');
            })
    } else {
        res.status(401).json('Debe autenticarse antes');
    }

}


/**
 * Método para obtener la Dirección de la sucursal
 */
const getDirección = async (req, res) => {
    if (req.headers.authorization) {
        let data = [];
        execute('SELECT id_sucursal, nombre_sucursal FROM sucursales')
            .then(filled => {
                let _sucursal = getBinary(filled, 'id_sucursal');
                for (let i = 0; i < filled.length; i++) {
                    id = {
                        id_sucursal: _sucursal[i]
                    }
                    Object.assign(filled[i], id)
                    data.push(filled[i]);
                }
                if (res.status(200)) res.json(data)
            })
            .catch(() => {
                res.status(500).json('Surgio un problema en el servidor');
            })
    } else {
        res.status(401).json('Debe autenticarse antes');
    }

}

/**
 * Método para crear una factura
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos del req
            const { orden, empleado, sucursal, estado } = req.body;
            // realizar query o insert y enviarle los parametros
            execute('INSERT INTO facturas(id_factura, id_orden, id_empleado, id_sucursal, estado) VALUES (UUID(), ?, ?, ?, ?)',
                [orden, empleado, sucursal, estado])
                .then(() => {
                    res.status(201).json('Factura agregada')
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).json('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }

}

/** 
 * Método para actualizar los datos de la factura
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id 
            const IDFACTURA = req.params.id;
            // obtener los datos enviados del frontend
            // obtener los datos del req
            const { empleado, sucursal, estado } = req.body;
            // realizar transacción sql
            execute('UPDATE facturas SET id_sucursal = ?, id_empleado = ?, estado = ? WHERE id_factura = ?',
                [sucursal, empleado, estado, IDFACTURA])
                .then(() => {
                    res.status(201).json('Factura modificada')
                }).catch(rej => res.status(500).send(getError(rej)));
        } catch (error) {
            res.status(500).json('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }

}

/**
 * Método para obtener los datos de una factura
 */
const one = async (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        let data = [];
        // obtener de la db los datos según la consulta
        execute('SELECT f.id_factura, f.id_sucursal, f.id_empleado, f.estado, f.id_orden, e.nombres, e.apellidos FROM facturas f INNER JOIN empleados e ON e.id_empleado = f.id_empleado WHERE id_factura = ?', [req.params.id])
            .then(filled => {
                // convirtiendo a binario los ids que retornar en caracter diferente
                let _factura = getBinary(filled, 'id_factura'), _sucursal = getBinary(filled, 'id_sucursal'), _empleado = getBinary(filled, 'id_empleado'), _orden = getBinary(filled, 'id_orden');
                // obtener los binarios de cada registro
                for (let i = 0; i < filled.length; i++) {
                    let id = {
                        id_factura: _factura[i],
                        id_sucursal: _sucursal[i],
                        id_empleado: _empleado[i],
                        id_orden: _orden[i],
                    }
                    // unir el objeto con los demás datos con el que contiene los ids
                    Object.assign(filled[i], id);
                    // agregar el registro recorrido al arreglo con los datos
                    data.push(filled[i]);
                }
                // responder a la petición con el código de la petición y los datos
                res.status(200).json(data[0]);
            }).catch(rej => {
                // reponder con la respuesta denegada con el código y el error
                res.status(500).json(getError(rej));
            })
    } else {
        // enviar mensaje que necesita de una autenticación
        res.status(401).json('Debe autenticarse antes');
    }
    // este arreglo data sirve para guardar los datos después de haber formateado y ordenado los datos para retorar la respuesta
}
/**
 * Método para eliminar la factura seleccionada
 */
const destroy = (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        try {
            // obtener el idFacturas
            const IDFACTURA = req.params.id;
            // realizar transferencia sql o delete en este caso
            execute('DELETE FROM facturas WHERE id_factura = ?', [IDFACTURA])
                .then(() => {
                    res.status(201).json('Factura eliminada');
                }).catch(rej => {
                    res.status(500).json({ error: getError(rej) })
                })
        } catch (error) {
            console.log(error);
            res.status(500).json('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}

// exportación de modulos
module.exports = { get, getDirección, change, destroy, store, one }