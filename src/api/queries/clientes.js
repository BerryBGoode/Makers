// requerir el modulo con los attrs de la conexión
const POOL = require('../db');
// requerir del encryptador
const encrypt = require('../helpers/encrypt');

// método para obtener los clientes
// req (obtiene parametros en la consulta)
// res (retorna valor según resultado)
const get = async (req, res) => {

    if(req.headers.authorization){
        try { 
            // realizar consulta
            const CLIENTES = await POOL.query('SELECT id_cliente, nombres, apellidos, dui, telefono, correo FROM clientes');
            // verificar el estado
            if (res.status(200)) res.json(CLIENTES.rows)
        } catch (e) {
            console.error(e.message);
            res.status(500).json('Surgio un problema en el servidor')
        }

    }else{
        res.status(401).json({error: 'Debe iniciar sesión antes'})
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
        POOL.query('INSERT INTO clientes(nombres, apellidos, dui, telefono, correo, clave, id_estado_usuario_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7)'
            , [nombres, apellidos, dui, telefono, correo, encrypt(clave), estado],
            // función
            (err, result) => {
                // verificar sí existe error

                if (err) {
                    res.json({ error: err.message });
                }
                // sino enviar estado exitoso
                res.status(201).send('Cliente agregado');
            })
    } catch (error) {
        console.error(error);
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
        const IDCLIENTE = parseInt(req.params.id);
        // realizar consulta
        const CLIENTE = POOL.query('SELECT * FROM clientes WHERE id_cliente = $1', [IDCLIENTE])
        // sí estuvo correcto el proceso, retorna el resultado de la consulta en json
        if (res.status(200)) { res.json((await CLIENTE).rows) }
    } catch (error) {
        console.error(error);
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
        const IDCLIENTE = parseInt(req.params.id);
        // asignar a un arreglo los valores del req
        const { nombres, apellidos, dui, telefono, correo, estado } = req.body;
        // realizar transferencia SQL
        POOL.query('UPDATE clientes SET nombres = $1, apellidos = $2, dui = $3, telefono = $4, correo = $5, id_estado_usuario_cliente = $6 WHERE id_cliente = $7',
            [nombres, apellidos, dui, telefono, correo, estado, IDCLIENTE],
            // error debe ir primero que res
            (err, results) => {
                // verificar sí hay un error
                if (err) {
                    res.json({ error: err.message });
                }
                res.status(201).send('Cliente modificado' + 'UPDATE clientes SET nombres = $1, apellidos = $2, dui = $3, telefono = $4, correo = $5, id_estado_usuario_cliente = $6' +
                    [nombres, apellidos, dui, telefono, correo, estado]);
            }
        )
    } catch (error) {
        console.log(error);
    }
}


/**
 * Método para eliminar un cliente selccionado
 * req, datos del front
 * res, respuesta del servidor
 */
const destroy = (req, res) => {
    try {
        // console.log(req.params.id)
        // obtener el idcliente del parametro de la ruta
        const IDCLIENTE = parseInt(req.params.id);
        // realizar consulta, enviar un array con los parametros y metodo para capturar error
        POOL.query('DELETE FROM clientes WHERE id_cliente = $1', [IDCLIENTE], (err, result) => {
            if (err) {
                // quebrar o detener y retornar msg-error
                // throw err.message;
                res.json({ error: err.message });
            }

            // enviando estado del proceso y mensaje
            res.status(201).send('Cliente eliminado');

        })
    } catch (error) {
        // capturar error
        console.error(error);
    }
}
// exportar funciones
module.exports = { get, store, one, change, destroy }