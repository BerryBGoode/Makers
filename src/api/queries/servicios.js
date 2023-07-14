// requerir la mysql con los datos de la conexión
const { mysql, pg } = require('../db');

// método para ejecutar sentencias en MySQL
const { execute } = require('../MySQL');
// método para obtener binarios de los ids
const { getBinary } = require('../helpers/validateHelpers')

let msg;
/**
 * Método para obtener los tipos de servicios 
 */
const getServicios = async (req, res) => {
    try {
        // declarar valor diferente al que se espera
        let producto = 'Producto';
        // realizar query
        const TIPOS = mysql.query('SELECT * FROM tipos_servicios WHERE NOT tipo_servicio = $1', [producto])
        // verificar sí la respuesta es la esperada
        if (res.status(200)) res.send(TIPOS.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener todos los servicios
 */
const get = (req, response) => {
    // arreglo vacíos para guardar los datos encontrados
    let data = [];
    // realizar query
    let producto = 'Producto';
    
    execute('SELECT * FROM servicios_view WHERE tipo_servicio NOT LIKE ?', [producto])
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
            if(response.status(200)) response.json(data)
        })
        // enviar mensaje de error
        .catch(er => response.status(500).send(er))
}

/**
 * Método para agregar un servicio
 */
const store = (req, res) => {
    try {
        let estado = 1;
        // obtener los datos de la petición
        const { tipo, nombre, descripcion, precio, existencias } = req.body;
        // realizar query
        mysql.query('INSERT INTO servicios(id_tipo_servicio, descripcion, precio, existencias, id_estado_servicio, nombre_servicio) VALUES ($1, $2, $3, $4, $5, $6)',
            [tipo, descripcion, precio, existencias, estado, nombre],
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
                    msg = 'Servicio agregado';
                }
                res.status(201).send(msg);
            })
    } catch (error) {
        console.log(error)
        // enviar mensaje al cliente
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener los datos del registro especificado 
 */
const one = async (req, res) => {
    try {
        // obtener el id 
        const ID = parseInt(req.params.id);
        // realizar query
        const SERVICIO = mysql.query('SELECT descripcion, precio, id_tipo_servicio, nombre_servicio FROM servicios WHERE id_servicio = $1', [ID])
        // verificar sí el resultado es el esperado para enviar los datos
        if (res.status(200)) res.send(SERVICIO.rows[0]);
    } catch (error) {
        console.log(error);
        // enviar mensaje de error al cliente
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para actualizar los datos del servicio recibido
 */
const change = (req, res) => {
    try {
        // obtener el id del registro
        const ID = parseInt(req.params.id);
        // obtener los datos de la petición
        const { tipo, nombre, descripcion, precio } = req.body;
        // realizar actualización
        mysql.query('UPDATE servicios SET descripcion = $1, precio = $2, id_tipo_servicio = $3, nombre_servicio = $4 WHERE id_servicio = $5',
            [descripcion, precio, tipo, nombre, ID], (err, result) => {
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
                    msg = 'Servicio modificado';
                }
                res.status(201).send(msg);
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para eliminar un servicio
 */
const destroy = (req, res) => {
    try {
        // obtener id del servicio
        const ID = parseInt(req.params.id);
        // realizar query
        mysql.query('DELETE FROM servicios WHERE id_servicio = $1', [ID], (err, result) => {
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
            res.status(201).send('Servicio eliminado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get, getServicios, store, one, change, destroy }