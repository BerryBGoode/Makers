//requiere el módulo con los attrs de la conexión.
const { execute } = require('../MySQL');
const POOL = require('../db');
const { getError } = require('../helpers/errors');
const { getBinary } = require('../helpers/validateHelpers');


/**
 * Método para obtener el dui de los clientes 
 */
const getDuiCli = async (req, res) => {
    try {
        // realizar consulta
        const DUI = await execute('SELECT id_cliente, dui FROM clientes');
        // sí la respuesta es la esperara retoran los datos
        for (let i = 0; i < DUI.length; i++) {
            id = {
                id_cliente: getBinary(DUI, 'id_cliente')[i]
            }
            Object.assign(DUI[i], id);

        }
        if (res.status(200)) res.send(DUI);
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
        const ID = req.params.id;
        // realizar consulta 
        const CLIENTE = await execute('SELECT nombres, apellidos FROM clientes WHERE id_cliente = ?', [ID]);
        // sí la respuesta es la esperada retornar dato
        if (res.status(200)) res.send(CLIENTE[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Metodo para obtener los nombres del empleados
 */
const getEmpleado = async (req, res) => {
    const ID = req.params.id;
    let data = [];
    execute('SELECT nombres, apellidos FROM empleados WHERE id_empleado = ?', [ID])
        .then(filled => {
            // recorrer los registros
            for (let i = 0; i < filled.length; i++) {
                // agregarlos al arreglo vacíos que retornar los datos
                data.push(filled[i]);
            }
            if (res.status(200)) res.json(data[0]);
        })
        .catch(rej => {
            res.status(500).send({ error: getError(rej['errno']) });
        })
}

/**
 * Método para obtener el dui del empleado
 */
const getDuiEmp = async (req, res) => {

    let data = [];
    execute('SELECT dui, id_empleado FROM empleados')
        .then(filled => {
            let _empleado = getBinary(filled, 'id_empleado');
            for (let i = 0; i < filled.length; i++) {
                id = {
                    id_empleado: _empleado[i]
                }
                Object.assign(filled[i], id);
                data.push(filled[i]);
            }
            if (res.status(200)) res.json(data);
        })
        .catch(rej => {
            res.status(500).json(rej);
            console.log(rej)
        })
}

//método para obtener reservaciones
//req obtiene los parametros en la consulta
//res retorna valor según resultado
const get = async (req, res) => {
    let data = [];
    let i = 0;
    let ids = {};
    execute('SELECT id_reservacion, fecha, hora, cliente_n, cliente_a, cliente_d, empleado_n, empleado_a, empleado_d FROM reservaciones_view')
        .then(filled => {
            let id = getBinary(filled, 'id_reservacion');
            filled.forEach(element => {
                ids = {
                    id_reservacion: id[i],
                }
                Object.assign(element, ids);
                data.push(element)
                i++;
            });
            if (res.status(200)) res.json(data);
        })
        .catch(rej => res.status(500).json({ error: rej }))
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
        //preparando query con los datos
        execute('INSERT INTO reservaciones(id_reservacion, id_cliente, id_empleado, fecha, hora, estado) VALUES (UUID(), ?, ?, ?, ?, ?)'
            , [cliente, empleado, fecha, hora, estado])
            .then(() => { res.status(201).send('Reservación agregada') })
            .catch(rej => { res.status(406).send({ error: getError(rej) }) })
    } catch (error) {
        console.error(error);
        res.status(500).send('Surgio un problema en el servidor');
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
        const idreser = req.params.id;
        //se realiza la consulta
        const RESERVACION = await execute(`SELECT id_reservacion, id_cliente, id_empleado, cliente_n, cliente_a, cliente_d, empleado_n, empleado_a, empleado_d, fecha, time_format(hora, '%h:%i') as hora FROM reservaciones_view WHERE id_reservacion = ?`, [idreser])
        //si el proceso es correcto, se retorna el resultado de la consulta en json        
        for (let i = 0; i < RESERVACION.length; i++) {
            id = {
                id_reservacion: getBinary(RESERVACION, 'id_reservacion')[i],
                id_cliente: getBinary(RESERVACION, 'id_cliente')[i],
                id_empleado: getBinary(RESERVACION, 'id_empleado')[i]
            }
            Object.assign(RESERVACION[i], id);
        }
        if (res.status(200)) res.json(RESERVACION[0])
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Surgio un problema en el servidor' });
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
        const idreser = req.params.id;
        //asignar a un arreglo los valores del req
        const { cliente, empleado, fecha, hora } = req.body;
        //realuzar transferencia SQL
        execute('UPDATE reservaciones SET id_cliente = ?, id_empleado = ?, fecha = ?, hora = ? WHERE id_reservacion = ?',
            [cliente, empleado, fecha, hora, idreser])
            .then(() => { res.status(201).send('Reservación modificada') })
            .catch(rej => { res.status(406).send({ error: getError(rej) }) })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Surgio un problema en el servidor' });
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
        const idreser = req.params.id;
        //resalizar consulta, se envia un array con los parametros y método para capturar error
        execute('DELETE FROM reservaciones WHERE id_reservacion = ?', [idreser])
            .then(() => { res.status(201).send('Reservación eliminada') })
            .catch(rej => { res.status(406).send({ error: getError(rej) }) })
    } catch (error) {
        //capturar error
        console.error(error);
        res.status(500).send({ error: 'Surgio un problema en el servidor' });
    }
}
//exportar funciones
module.exports = { get, store, one, change, destroy, getDuiCli, getDuiEmp, getCliente, getEmpleado }