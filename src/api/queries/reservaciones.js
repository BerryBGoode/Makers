//requiere el módulo con los attrs de la conexión.
const POOL = require('../db');


/**
 * Método para obtener el dui de los clientes 
 */
const getDuiCli = async (req, res) => {
    try {
        // realizar consulta
        const DUI = await POOL.query('SELECT id_cliente, dui FROM clientes');
        // sí la respuesta es la esperara retoran los datos
        if (res.status(200)) res.send(DUI.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Metodo para obtener los nombres del clientes según id
 */
const getCliente = async (req, res) => {
    try {
        // obtener id cliente
        const ID = parseInt(req.params.id);
        // realizar consulta 
        const CLIENTE = await POOL.query('SELECT nombres, apellidos FROM clientes WHERE id_cliente = $1', [ID]);
        // sí la respuesta es la esperada retornar dato
        if (res.status(200)) res.send(CLIENTE.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Metodo para obtener los nombres del empleados
 */
const getEmpleado = async (req, res) => {
    try {
        // obtener ids
        const ID = parseInt(req.params.id);
        // realizar consulta
        const EMPLEADO = await POOL.query('SELECT nombres, apellidos FROM empleados WHERE id_empleado = $1', [ID]);
        if (res.status(200)) res.send(EMPLEADO.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para obtener los duis de los empleados
 */
const getDuiEmp = async (req, res) => {
    try {
        // realizar query
        const DUI = await POOL.query('SELECT id_empleado, dui FROM empleados');
        // sí la respuesta es la esperada retornar los datos
        if (res.status(200)) res.send(DUI.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

//método para obtener reservaciones
//req obtiene los parametros en la consulta
//res retorna valor según resultado
const get = async (req, res) => {
    try {
        //se realiza la consulta
        const reservaciones = await POOL.query('SELECT * FROM  reservaciones_view');
        //se verifica el estado
        if (res.status(200)) res.json(reservaciones.rows)
    } catch (e) {
        console.log(e);
    }
}

/* Método que cuarga los datos de las reservaciones
    req, datos enviados desde el front
    res, respuesta del servidor
*/
const store = async (req, res) => {
    try {
        //se asigna un arreglo a los valores del req
        const { cliente, empleado, fecha, hora } = req.body;
        let estado = 1;
        console.log(req.body)
        //preparando query con los datos
        POOL.query('INSERT INTO reservaciones(id_cliente, id_empleado, fecha, hora, id_estado) VALUES ($1, $2, $3, $4, $5)'
            , [cliente, empleado, fecha, hora, estado],
            //función
            (err, result) => {
                //verificar si existe algún error
                // verificar sí hubo un error
                if (err) {
                    res.json({ error: err.message });
                    return
                }
                res.status(201).send('Reservación agregado')
            })
    } catch (error) {
        console.error(error);
    }
}

/*
    Método para obtener la reservación según el restistro seleccionado
    se obtiene solamente 1 registro
    req, datos de la petición
    res, respuesta del servidor
*/
const one = async (req, res) => {
    try {
        //se obtiene el id de  la reservacion de los  parametros de la url
        const idreser = parseInt(req.params.id);
        //se realiza la consulta
        const RESERVACION = await POOL.query('SELECT * FROM reservaciones_view WHERE id_reservacion = $1', [idreser])
        //si el proceso es correcto, se retorna el resultado de la consulta en json        
        if (res.status(200)) res.json(RESERVACION.rows)
    } catch (error) {
        console.error(error);
    }
}

/*
    Método para actualizar los datos de las reservaciones, se selecciona la reservacion
    req, datos del front
    res, respuesta del servidor
*/

const change = async (req, res) => {
    try {
        //convertir a valor entero el id recibido de la ruta
        const idreser = parseInt(req.params.id);
        //asignar a un arreglo los valores del req
        const { cliente, empleado, fecha, hora } = req.body;
        //realuzar transferencia SQL
        POOL.query('UPDATE reservaciones SET id_cliente = $1, id_empleado = $2, fecha = $3, hora = $4 WHERE id_reservacion = $5',
            [cliente, empleado, fecha, hora, idreser],
            //erro debe ir antes que res
            (err, results) => {
                // verificar sí hubo un error
                if (err) {
                    res.json({ error: err.message });
                    return
                }
                res.status(201).send('Reservación modificada');
            }
        )
    } catch (error) {
        console.log(error);
    }
}


/*
    Método para eliminar una reservación seleccionada
    req, datos del from
    res, respuesta del servidor
*/

const destroy = async (req, res) => {
    try {
        //obtener el idreser del parametro de la ruta
        const idreser = parseInt(req.params.id);
        //resalizar consulta, se envia un array con los parametros y método para capturar error
        POOL.query('DELETE FROM reservaciones WHERE id_reservacion = $1', [idreser], (err, result) => {
            // verificar sí ocurre un error
            if (err) {
                // verificar sí no se puede eliminar porque tiene datos dependientes                
                if (err.code === '23503') {
                    e = 'No se puede modificar o eliminar debido a datos asociados'
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
        //capturar error
        console.error(error);
    }
}
//exportar funciones
module.exports = { get, store, one, change, destroy, getDuiCli, getDuiEmp, getCliente, getEmpleado }