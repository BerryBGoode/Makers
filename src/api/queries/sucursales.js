// requerir del pool con los attrs de la conexión
const { execute } = require('../MySQL');
const { getError } = require('../helpers/errors');
const { getBinary } = require('../helpers/validateHelpers');

/**
 * Método para obtener las sucursales
 */
const get = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // realizar query
            execute('SELECT * FROM sucursales_view ORDER BY id_sucursal ASC')
                // retornar los datos sí el estado es el esperado
                .then(sucursales => {
                    for (let i = 0; i < sucursales.length; i++) {
                        id = {
                            id_sucursal: getBinary(sucursales, 'id_sucursal')[i]
                        }
                        Object.assign(sucursales[i], id);
                    }
                    res.status(200).send(sucursales)
                }).catch(rej => { console.log(rej); res.status(500).send(getError(rej)) })

        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe auntenticarse antes');
    }
}

/**
 * Método para agregar una sucursal
 */
const store = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener los datos de la petición
            const { tel, inicio, cierre, direccion, nombre } = req.body
            // realizar query 
            execute('INSERT INTO sucursales(id_sucursal, telefono, horario, nombre_sucursal, direccion) VALUES (UUID(), ?, ?, ?, ?)',
                [tel, inicio + ' - ' + cierre, nombre, direccion])
                .then(() => {
                    res.status(201).send('Sucursal agregada')
                }).catch(rej => { res.status(500).send(getError(rej)) })
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor')
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }

}

/**
 * Método para obtener los datos de una sucursal especificada con el id en la petición
 */
const one = async (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id de la sucursal
            const ID = req.params.id;
            // realizar consulta
            const SUCURSAL = await execute(`SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(horario, '-', 1), ' ',1 ) as inicio, SUBSTRING_INDEX(SUBSTRING_INDEX(horario, '-', -1), ' ', -1) as cierre, s.id_sucursal, s.telefono, s.nombre_sucursal, s.direccion FROM sucursales s WHERE id_sucursal = ?`, [ID])
            // verificar sí la respuesta es la esperada                        
            for (let i = 0; i < SUCURSAL.length; i++) {
                Object.assign(SUCURSAL[i], { id_sucursal: getBinary(SUCURSAL, 'id_sucursal')[i] });
            }
            if (res.status(200)) res.send(SUCURSAL[0]);
        } catch (error) {
            res.status(500).send(getError(error))
        }
    } else {
        res.status(401).send('Debe auntenticarse antes');
    }
}

/**
 * Método para actualizar los datos de una sucursal
 */
const change = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener el id
            const ID = req.params.id;
            // obtener los datos de la petición
            const { tel, inicio, cierre, direccion, nombre } = req.body;
            // realizar query 
            execute('UPDATE sucursales SET telefono = ?, horario = ?, nombre_sucursal = ?, direccion = ? WHERE id_sucursal = ?',
                [tel, inicio + ' - ' + cierre, nombre, direccion, ID])
                .then(() => { res.status(201).send('Sucursal modificada') })
                .catch(rej => {
                    res.status(500).send(getError(rej))
                })
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }
    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}


/**
 * Método para eliminar una sucursal, según el parametro de la url
 */
const destroy = (req, res) => {
    if (req.headers.authorization) {
        try {
            // obtener id
            const ID = req.params.id;
            // realizar delete
            execute('DELETE FROM sucursales WHERE id_sucursal = ?', [ID])
                .then(() => { res.status(201).send('Sucursal eliminada') })
                .catch(rej => res.status(500).send(getError(rej)));
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}
module.exports = { get, store, one, change, destroy }