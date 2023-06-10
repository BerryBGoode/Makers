// requerir el modulo con los attrs de la conexión
const POOL = require('../db');

// método para obtener los clientes
// req (obtiene parametros en la consulta)
// res (retorna valor según resultado)
const getClientes = async (req, res) => {
    try {
        // realizar consulta
        const clientes = await POOL.query('SELECT * FROM clientes');
        // verificar el estado
        if (res.status(200)) res.json(clientes.rows)
    } catch (e) {
        console.error(e.message);
    }
}

/** Método para guardar datos del cliente
 * req, datos enviados del front
 * res, respuesta del servidor
 */
const guardarCliente = async (req, res) => {
    try {
        // asignar a un arreglo los valores del req
        const { nombres, apellidos, dui, telefono, correo, clave, estado } = req.body;
        // preparando query con los datos
        POOL.query('INSERT INTO clientes(nombres, apellidos, dui, telefono, correo, clave, id_estado_usuario_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7)'
            , [nombres, apellidos, dui, telefono, correo, clave, estado], 
            // función
            (err, result) => {
                // verificar sí existe error
                // if(err) throw err.message;
                // sino enviar estado exitoso
                res.status(201).send('Cliente agregado');
            })
    } catch (error) {
        console.error(error);
    }
}

// exportar funciones
module.exports = { getClientes, guardarCliente }