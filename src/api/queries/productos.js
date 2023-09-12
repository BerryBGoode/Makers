// requerir de objeto con la pool de attrs. de la conexión con la db
const POOL = require('../db');
// método para realizar sentencias en MySQL
const { execute } = require('../MySQL')
// método para convertir a binario
const { getBinary } = require('../helpers/validateHelpers');
const { getError } = require('../helpers/errors');
/**
 * Método para obtener tipo de servicio llamado producto
 */
const producto = async () => {
    try {
        // declarar el tipo de servicio que se busca
        let producto = 'Producto';
        // realizar consulta
        const TIPO = await execute('SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = ?', [producto]);
        // retornar el id sí la respuesta es la deceada
        for (let i = 0; i < TIPO.length; i++) {
            id = {
                id_tipo_servicio: getBinary(TIPO, 'id_tipo_servicio')[i]
            }
            Object.assign(TIPO[i], id);
        }
        if (TIPO[0]) return TIPO[0].id_tipo_servicio;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Método para cargar todos los productos
 */
const get = async (req, response) => {
    if (req.headers.authorization) {
        // arreglo vacío para guardar la data
        let data = [];
        // realizar sentencia (una promesa)
        execute('SELECT id_servicio, nombre_servicio, descripcion, format(precio, 2) as precio, existencias, id_tipo_servicio,estado FROM productos_view')
            .then(res => {
                // obtener y convertir a binario
                // los ids recuperados
                let id = getBinary(res, 'id_servicio');
                let id_tipo = getBinary(res, 'id_tipo_servicio');
                let i = 0;
                // recorrer los datos recuperados
                res.forEach(element => {
                    //crear objeto con los datos recuperados
                    // de la sentencia
                    element = {
                        id_servicio: id[i],
                        id_tipo_servicio: id_tipo[i],
                        nombre_servicio: element.nombre_servicio,
                        descripcion: element.descripcion,
                        precio: element.precio,
                        existencias: element.existencias,
                    }
                    // agregar objeto al arreglo
                    data.push(element);
                    i++
                });
                // verificar sí estado de la respuesta
                if (response.status(200)) response.json(data)
            })
            .catch(rej => response.status(500).json(rej));
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para guardar un producto
 */
const store = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del tipo servicio producto        
            let tipo = await producto();
            // declarar estado activo        
            let estado = 1;
            // verificar sí se obtuvo
            if (tipo) {
                // obtener los datos de la petición
                const { descripcion, precio, existencias, nombre } = req.body;
                // realizar query o inserción y enviadole los parametros
                execute('INSERT INTO servicios(id_servicio, id_tipo_servicio, descripcion, precio, existencias, estado, nombre_servicio) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
                    [tipo, descripcion, precio, existencias, estado, nombre])
                    .then(() => {
                        res.status(201).send('Producto agregado')
                    }).catch(rej => { res.status(500).send(getError(rej)) })
            }
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener los datos de un producto que se pasa por parametro en la url
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del tipo servicio producto        
            let tipo = await producto();
            if (tipo) {
                // obtener el id del producto por medio de la url
                const ID = req.params.id;
                // realizar consulta
                const PRODUCTO = await execute('SELECT descripcion, precio, existencias, nombre_servicio FROM servicios WHERE id_tipo_servicio = ? AND id_servicio = ?',
                    [tipo, ID]);
                (PRODUCTO) ? res.status(200).send(PRODUCTO[0]) : res.status(500).send(getError(PRODUCTO))
                // verificar estado satisfactorio, para enviar los datos
            }
        } catch (error) {
            res.status(500).send(getError(error));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para actualizar los datos de un registro
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del producto a modificar
            const ID = req.params.id;
            // obtener los datos de la petición
            const { descripcion, precio, existencias, nombre } = req.body;
            // realizar actualización
            execute('UPDATE servicios SET descripcion = ?, precio = ?, existencias = ?, nombre_servicio = ? WHERE id_servicio = ?',
                [descripcion, precio, existencias, nombre, ID])
                .then(() => {
                    res.status(201).send('Producto modificado');
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para eliminar el producto enviado por la url
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id del registro por la url de la petición
            const ID = req.params.id;
            // realizar sentencia SQL
            execute('DELETE FROM servicios WHERE id_servicio = ?', [ID])
                .then(() => { res.status(201).send('Producto eliminado') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

module.exports = { get, one, store, change, destroy, producto };