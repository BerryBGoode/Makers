// requerir de objeto con la pool de attrs. de la conexión con la db
const POOL = require('../db');
// método para realizar sentencias en MySQL
const { execute } = require('../MySQL')
// método para convertir a binario
const { getBinary } = require('../helpers/validateHelpers');
/**
 * Método para obtener tipo de servicio llamado producto
 */
const producto = async () => {
    try {
        // declarar el tipo de servicio que se busca
        let producto = 'Producto';
        // realizar consulta
        const TIPO = await POOL.query('SELECT id_tipo_servicio FROM tipos_servicios WHERE tipo_servicio = $1', [producto]);
        // retornar el id sí la respuesta es la deceada
        if (TIPO.rows[0]) return TIPO.rows[0].id_tipo_servicio;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Método para cargar todos los productos
 */
const get = async (req, response) => {
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
        .catch(rej => response.status(500).json({ error: rej }));
}

/**
 * Método para guardar un producto
 */
const store = async (req, res) => {
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
            POOL.query('INSERT INTO servicios(id_tipo_servicio, descripcion, precio, existencias, id_estado_servicio, nombre_servicio) VALUES ($1, $2, $3, $4, $5, $6)',
                [tipo, descripcion, precio, existencias, estado, nombre],
                (err, result) => {
                    // verificar sí hubo un error
                    if (err) {
                        res.json({ error: err.message });
                        return
                    }
                    res.status(201).send('Producto agregado')
                })

        }

    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para obtener los datos de un producto que se pasa por parametro en la url
 */
const one = async (req, res) => {
    try {
        // obtener el id del tipo servicio producto        
        let tipo = await producto();
        if (tipo) {
            // obtener el id del producto por medio de la url
            const ID = parseInt(req.params.id);
            // realizar consulta
            const PRODUCTO = await POOL.query('SELECT descripcion, precio, existencias, nombre_servicio FROM servicios WHERE id_tipo_servicio = $1 AND id_servicio = $2',
                [tipo, ID]);
            // verificar estado satisfactorio, para enviar los datos
            if (res.status(200)) res.send(PRODUCTO.rows[0]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para actualizar los datos de un registro
 */
const change = (req, res) => {
    try {
        // obtener el id del producto a modificar
        const ID = parseInt(req.params.id);
        // obtener los datos de la petición
        const { descripcion, precio, existencias, nombre } = req.body;
        // realizar actualización
        POOL.query('UPDATE servicios SET descripcion = $1, precio = $2, existencias = $3, nombre_servicio = $4 WHERE id_servicio = $5',
            [descripcion, precio, existencias, nombre, ID],
            (err, result) => {
                // verificar sí hubo un problema
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
                res.status(201).send('Producto modificado');
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para eliminar el producto enviado por la url
 */
const destroy = (req, res) => {
    let e;
    try {
        // obtener el id del registro por la url de la petición
        const ID = parseInt(req.params.id);
        // realizar sentencia SQL
        POOL.query('DELETE FROM servicios WHERE id_servicio = $1', [ID], (err, result) => {
            // verificar errores
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
            res.status(201).send('Producto eliminado');
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

module.exports = { get, one, store, change, destroy, producto };