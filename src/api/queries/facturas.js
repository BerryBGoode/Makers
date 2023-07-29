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
        .catch(rej => {
            console.log(rej);
            res.status(500).send('Surgio un problema en el servidor');
        })
}


/**
 * Método para obtener la Dirección de la sucursal
 */
const getDirección = async (req, res) => {

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
        .catch(rej => {
            console.log(rej);
            res.status(500).send('Surgio un problema en el servidor');
        })
}

/**
 * Método para crear una factura
 */
const store = (req, res) => {
    let msg = '';
    try {
        // obtener los datos del req
        const { orden, empleado, sucursal, estado } = req.body;
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO facturas(id_orden, id_empleado, id_sucursal, estado) VALUES ($1, $2, $3, $4)',
            [orden, empleado, sucursal, estado], (err, result) => {

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
                    msg = 'Factura agregada';
                }

                res.status(201).send(msg);
            })
    } catch (error) {
        console.log(error)
    }
}

/** 
 * Método para actualizar los datos de la factura
 */
const change = (req, res) => {
    let msg;
    try {
        // obtener id 
        const IDFACTURA = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        // obtener los datos del req
        const { empleado, sucursal, estado } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE facturas SET id_sucursal = $1, id_empleado = $2, estado = $3 WHERE id_factura = $4',
            [sucursal, empleado, estado, IDFACTURA],
            (err, result) => {
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
                    msg = 'Factura modificada';
                }

                res.status(201).send(msg);
            }
        )
    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para obtener los datos de una factura
 */
const one = async (req, res) => {
    let data = [];
    execute('SELECT f.id_factura, f.id_sucursal, f.id_empleado, f.estado, f.id_orden, e.nombres, e.apellidos FROM facturas f INNER JOIN empleados e ON e.id_empleado = f.id_empleado WHERE id_factura = ?', [req.params.id])
        .then(filled => {
            let _factura = getBinary(filled, 'id_factura'), _sucursal = getBinary(filled, 'id_sucursal'), _empleado = getBinary(filled, 'id_empleado'), _orden = getBinary(filled, 'id_orden');
            for (let i = 0; i < filled.length; i++) {
                let id = {
                    id_factura: _factura[i],
                    id_sucursal: _sucursal[i],
                    id_empleado: _empleado[i],
                    id_orden: _orden[i],
                }
                Object.assign(filled[i], id)
                data.push(filled[i]);
            }            
            res.status(200).json(data[0])
        }).catch(rej => {
            res.status(500).send({error: getError(rej)})
        })
}
/**
 * Método para eliminar la factura seleccionada
 */
const destroy = async (req, res) => {
    try {
        // obtener el idFacturas
        const IDFACTURA = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        await POOL.query('DELETE FROM facturas WHERE id_factura = $1', [IDFACTURA], (err, resul) => {
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
                msg = 'Factura eliminada';
            }

            // mandar mensaje sí no hay errores
            res.status(201).send(msg);
        })
    } catch (error) {
        console.log(error);
    }
}








// exportación de modulos
module.exports = { get, getDirección, change, destroy, store, one }