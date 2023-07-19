// requiriendo la pool con los attrs de la conexión
const POOL = require('../db');

const { execute } = require('../MySQL');
const { getBinary } = require('../helpers/validateHelpers')

/**
 * req: información que viene del frontend
 * res: respuesta del servidor
 */

/**
 * Método para obtener las ordenes
 */
const get = async (req, res) => {
    let data = [];
    let i = 0;
    execute('SELECT * FROM ordenes_view')
        .then(filled => {
            // convertir ids a binario
            let _orden = getBinary(filled, 'id_orden');
            let _cliente = getBinary(filled, 'id_cliente');
            let _factura = getBinary(filled, 'factura')
            filled.forEach(element => {
                // por cada registro crear un objeto con los is convertidos
                ids = {
                    id_orden: _orden[i],
                    id_cliente: _cliente[i],
                    factura: _factura[i]
                }
                Object.assign(element, ids);
                data.push(element);
                i++
            });            
            if (res.status(200)) res.json(data);
        })
        .catch(rej => {
            res.status(500).json({ error: rej })
        })
};

/**
 * Método para obtener el dui de un clientes
 */
const getClienteDui = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await POOL.query('SELECT id_cliente, dui FROM clientes');
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES.rows);
    } catch (error) {
        console.error(error);
    }
}


/**
* Método  para obtener los datos del cliente por su DUI
*/
const getObtenerClientes = async (req, res) => {
    try {
        // realizar consulta
        const CLIENTES = await POOL.query('SELECT nombres, apellidos FROM clientes WHERE id_cliente = $1',);
        // verificar respuesta satisfactoria, para enviar los datos
        if (res.status(200)) res.json(CLIENTES.rows);
    } catch (error) {
        console.error(error);
    }
}







/**
 * Método para crear una orden
 */
const store = (req, res) => {
    let msg = '';
    let status = '';
    try {
        // obtener los datos del req
        const { fecha, cliente } = req.body;
        let estado = 1
        // realizar query o insert y enviarle los parametros
        POOL.query('INSERT INTO ordenes(fecha, estado, id_cliente) VALUES ($1,$2, $3)',
            [fecha, estado, cliente], (err, result) => {

                // verificar sí hubo un error                                
                if (err) {
                    // sí es ejecuta esto, el status 201 no se enviará
                    res.json({ error: err.message });
                    return;
                }
                res.status(201).send('orden agregada');
                // verificar estado satisfactorio
                // res.status(201).send('Orden agregada')
            })
    } catch (error) {
        console.log(error)
    }
}


/**
 * Método para actualizar los datos de la orden
 */
const change = (req, res) => {
    let e;
    try {
        // obtener id 
        const IDORDEN = parseInt(req.params.id);
        // obtener los datos enviados del frontend
        const { fecha, cliente } = req.body;
        // realizar transacción sql
        POOL.query('UPDATE ordenes SET fecha = $1, id_cliente = $2 WHERE id_orden = $3',
            [fecha, cliente, IDORDEN],
            (err, result) => {
                // verificar sí hubo un error                                
                if (err) {

                    // verificar sí no se puede eliminar porque tiene datos dependientes                
                    (err.code === '23503') ? e = 'No se puede modificar o eliminar debido a empleados asociados' : e = err.message
                    // retornar el error
                    res.json({ error: e });
                    return;

                } else {
                    msg = 'Sucursal eliminada';
                }

                res.status(201).send(msg);
            }
        )
    } catch (error) {
        console.log(error);
    }
}




/**
 * Método para eliminar la orden seleccionada
 */
const destroy = async (req, res) => {
    let e;
    try {
        // obtener el idorden
        const IDORDEN = parseInt(req.params.id);
        // realizar transferencia sql o delete en este caso
        await POOL.query('DELETE FROM ordenes WHERE id_orden = $1', [IDORDEN], (err, resul) => {
            // verificar sí hubo un error                                
            if (err) {

                // verificar sí no se puede eliminar porque tiene datos dependientes                
                (err.code === '23503') ? e = 'No se puede modificar o eliminar debido a empleados asociados' : e = err.message
                // retornar el error
                res.json({ error: e });
                return;

            } else {
                msg = 'Orden eliminada';
            }

            res.status(201).send(msg);
        })
    } catch (error) {
        console.log(error);
    }
}


/**
 * Método para obtener los datos de la orden enviada por la url
 */
const one = async (req, res) => {
    try {
        // obtener id
        const ID = parseInt(req.params.id);
        // realizar query
        const ORDEN = await POOL.query('SELECT * FROM ordenes_view WHERE id_orden = $1', [ID]);
        // verificar respuesta esperada
        if (res.status(200)) res.send(ORDEN.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}





// exportación de modulos
module.exports = { get, getClienteDui, getObtenerClientes, change, destroy, store, one }