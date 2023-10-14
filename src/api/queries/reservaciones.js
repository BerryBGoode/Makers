//requiere el módulo con los attrs de la conexión.
const { execute } = require('../MySQL');
const POOL = require('../db');
const { getError } = require('../helpers/errors');
const { getBinary } = require('../helpers/validateHelpers');


/**
 * Método para obtener el dui de los clientes 
 */
const getDuiCli = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar consulta
            const DUI = await execute('SELECT id_cliente, dui FROM clientes');
            if (DUI) {
                for (let i = 0; i < DUI.length; i++) {
                    id = {
                        id_cliente: getBinary(DUI, 'id_cliente')[i]
                    }
                    Object.assign(DUI[i], id);

                }
                // sí la respuesta es la esperara retoran los datos
                if (res.status(200)) res.send(DUI);
            } else {
                res.status(500).send(getError(DUI))
            }
        } catch (error) {
            res.status(500).send(getError(rej))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Metodo para obtener los nombres del clientes según id
 */
const getCliente = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id cliente
            const ID = req.params.id;
            // realizar consulta 
            const CLIENTE = await execute('SELECT nombres, apellidos FROM clientes WHERE id_cliente = ?', [ID]);
            // sí la respuesta es la esperada retornar dato
            if (res.status(200)) res.send(CLIENTE[0]);
        } catch (error) {
            res.status(500).send(getError(rej));
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Metodo para obtener los nombres del empleados
 */
const getEmpleado = async (req, res) => {
    if (req.headers.authorization) {
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
                res.status(500).send(getError(rej))
            })
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método para obtener el dui del empleado
 */
const getDuiEmp = async (req, res) => {
    if (req.headers.authorization) {
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
                res.status(500).send(getError(rej))
            })
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

//método para obtener reservaciones
//req obtiene los parametros en la consulta
//res retorna valor según resultado
const get = async (req, res) => {
    if (req.headers.authorization) {
        let data = [];
        let i = 0;
        let ids = {};
        execute('SELECT id_reservacion, fecha, hora, cliente_n, cliente_a, cliente_d, empleado_n, empleado_a, empleado_d FROM reservaciones_view WHERE estado = ?', [1])
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
            .catch(rej => res.status(500).send(getError(rej)))
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

const getValidateReservacion = async (cliente, empleado, fecha, hora) => {


    let hreservacion = await execute('SELECT hora FROM reservaciones WHERE id_cliente = ? AND id_empleado = ? AND fecha = ? AND estado = ?', [cliente, empleado, fecha, 1]);


    // calcular la deiferencia entre cada hora
    const difHorarios = (horacliente, horadb) => {
        // obtenener valor númerico de la hora obtenida de la db
        const [h1, m1] = horacliente.split(':').map(Number);
        // obteniendo la hora ingresada por el cliente
        const [h2, m2] = horadb.split(':').map(Number);
        return Math.abs((h2 - h1) * 60 + (m2 - m1));
    }
    // obteniendo una inicalización de los horarios
    let horacercana = hreservacion[0];
    let lessdif = difHorarios(hora, hreservacion[0].hora);

    // calculando la hora más cercana obtenida del método difHorarios
    hreservacion.forEach(obj => {
        let diferencia = difHorarios(hora, obj.hora);
        if (diferencia < lessdif) {
            lessdif = diferencia;
            horacercana = obj;
        }
    })

    // convertir la hora cercana a string
    horacercana = JSON.stringify(horacercana.hora)
    // extraera las horas y los minutos de la hora más cerca
    let [horas, min] = horacercana.split(':');

    // convetir a entero las horas y min(minustos)
    horas = horas.substring(1)
    let horasint = parseInt(horas, 10);
    let minint = parseInt(min, 10);

    // sumar 30 min para 
    minint += 30;
    // ajustando hora sí los min son más de 59
    if (minint > 59) {
        // restar 60 minutos
        minint -= 60;
        // agregar 1 hora
        horasint += 1;
    }
    // ajustar horas sí son más de 24
    horasint = horasint % 24;

    let deltahoras = horasint - parseInt(hora, 10);
    // comparar sí al sumar 
    if (!deltahoras || deltahoras === 0) {
        return false;
    } else {
        return true;
    }
}

/* Método que cuarga los datos de las reservaciones
    req, datos enviados desde el front
    res, respuesta del servidor
*/
const store = async (req, res) => {
    if (req.headers.authorization) {
        try {
            //se asigna un arreglo a los valores del req
            const { cliente, empleado, fecha, hora } = req.body;
            let estado = 1;
            if (!await getValidateReservacion(cliente, empleado, fecha, hora)) {
                res.status(400).json('Empleado ocupado');
                return
            }
            //preparando query con los datos
            execute('INSERT INTO reservaciones(id_reservacion, id_cliente, id_empleado, fecha, hora, estado) VALUES (UUID(), ?, ?, ?, ?, ?)'
                , [cliente, empleado, fecha, hora, estado])
                .then(() => { res.status(201).send('Reservación agregada') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/*
    Método para obtener la reservación según el restistro seleccionado
    se obtiene solamente 1 registro
    req, datos de la petición
    res, respuesta del servidor
*/
const one = async (req, res) => {
    if (req.headers.authorization) {
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
            res.status(500).send(getError(rej))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/*
    Método para actualizar los datos de las reservaciones, se selecciona la reservacion
    req, datos del front
    res, respuesta del servidor
*/

const change = async (req, res) => {
    if (req.headers.authorization) {
        try {
            //convertir a valor entero el id recibido de la ruta
            const idreser = req.params.id;
            //asignar a un arreglo los valores del req
            const { cliente, empleado, fecha, hora } = req.body;
            //realuzar transferencia SQL
            execute('UPDATE reservaciones SET id_cliente = ?, id_empleado = ?, fecha = ?, hora = ? WHERE id_reservacion = ?',
                [cliente, empleado, fecha, hora, idreser])
                .then(() => { res.status(201).send('Reservación modificada') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            res.status(500).send(getError(rej))
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}


/*
    Método para eliminar una reservación seleccionada
    req, datos del from
    res, respuesta del servidor
*/

const destroy = async (req, res) => {
    if (req.headers.authorization) {
        try {
            //obtener el idreser del parametro de la ruta
            const idreser = req.params.id;
            //resalizar consulta, se envia un array con los parametros y método para capturar error
            execute('UPDATE reservaciones SET estado = ? WHERE id_reservacion = ?', [2, idreser])
                .then(() => { res.status(201).send('Reservación eliminada') })
                .catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            //capturar error
            res.status(500).send(getError(rej))
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}
//exportar funciones
module.exports = { get, store, one, change, destroy, getDuiCli, getDuiEmp, getCliente, getEmpleado }