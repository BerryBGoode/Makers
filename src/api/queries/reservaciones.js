//requiere el módulo con los attrs de la conexión.
const POOL = require('../db');

//método para obtener reservaciones
//req obtiene los parametros en la consulta
//res retorna valor según resultado
const get = async (req, res) => {
    try {
        //se realiza la consulta
        const reservaciones = await POOL.query('SELECT * FROM  reservaciones');
        //se verifica el estado
        if (res.status(200)) res.json(reservaciones.rows)
    } catch (e) {
        console.error(e.message);
    }
}

/* Método que cuarga los datos de las reservaciones
    req, datos enviados desde el front
    res, respuesta del servidor
*/
const store = async (req, res) => {
    try {
        //se asigna un arreglo a los valores del req
        const { cliente, empleado, fecha, hora, estado} = req.body;
        //preparando query con los datos
        POOL.query('INSERT INTO reservaciones(id_cliente, id_empleado, fecha, hora, id_estado) VALUES ($1, $2, $3, $4, $5)'
        , [cliente, empleado, fecha, hora, estado],
        //función
        (err, result) => {
            //verificar si existe algún error
            if (err) {
                res.send(err.message)
            }
            //si no existe, confirmar estado exitado, digo exitoso
            res.status(201).send('Reservación realizada' + 'INSERT INTO reservaciones(id_cliente, id_empleado, fecha, hora, id_estado) VALUES ($1, $2, $3, $4, $5)' + [cliente, empleado, fecha, hora, estado]);
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
const  one = async (req, res) =>  {    
    try {
        //se obtiene el id de  la reservacion de los  parametros de la url
        const  idreser = parseInt(req.params.id);
        //se realiza la consulta
        const reservarcion = POOL.query('SELECT * FROM reservaciones WHERE id_reservacion = $1', [idreser])
        //si el proceso es correcto, se retorna el resultado de la consulta en json        
        if(res.status(200)) res.json((await reservarcion).rows)  
    } catch (error) {
        console.error(error);
    }
}

/*
    Método para actualizar los datos de las reservaciones, se selecciona la reservacion
    req, datos del front
    res, respuesta del servidor
*/

const change = async  (req, res) => {
    try {
        //convertir a valor entero el id recibido de la ruta
        const idreser = parseInt(req.params.id);
        //asignar a un arreglo los valores del req
        const {cliente, empleado, fecha, hora, estado} = req.body;
        //realuzar transferencia SQL
        POOL.query('UPDATE reservaciones  SET id_cliente = $1, id_empleado = $2, fecha = $3, hora = $4, id_estado = $5 WHERE id_reservacion = $6',
            [cliente, empleado, fecha, hora, estado],
            //erro debe ir antes que res
            (err, results) => {
                //vereficar  si existen errores
                if (err) {
                    res.send(err.message);
                }
                res.status(201).send('Reservación actualizada' + 'UPDATE reservaciones  SET id_cliente = $1, id_empleado = $2, fecha = $3, hora = $4, id_estado = $5 WHERE id_reservacion = $6' + [cliente, empleado, fecha, hora, estado]);
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
        POOL.query('DELET FROM reservaciones WHERE id_reservacion = $1', [idreser], (err,result) => {
            //enviando estado del proceso y mensaje 
            res.status(201).send('Reservación eliminada correctamente' + 'DELET FROM reservaciones WHERE id_reservacion = $1' + [idreser]);
        })
    } catch (error) {
        //capturar error
        console.error(error);
    }
}
//exportar funciones
module.exports = { get, store, one, change, destroy}