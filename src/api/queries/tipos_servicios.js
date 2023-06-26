// requerir para hacer los queries, (constante)
const POOL = require('../db');

/**
 * Método para cargar todos los tipos de servicios
 */
const get = async (req, res) => {
    try {
        // query
        const TIPOS = await POOL.query('SELECT * FROM tipos_servicios');
        // verificar espera
        if (res.status(200)) res.send(TIPOS.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para agregar 
 */
const store = (req, res) => {
    try {
        // obtener los dato
        const { tipo } = req.body;
        // query
        POOL.query('INSERT INTO tipos_servicios(tipo_servicio) VALUES ($1)', [tipo], (err, result) => {
            if (err) {

                if (err.code === '23505') {
                    // enviar error el cliente
                    er = 'Dato unico ya registrado';
                } else {
                    er = err.message;
                }
                res.json({ error: er });
                // sí es ejecuta esto, el status 201 no se enviará
                // return;                    

            } else {
                msg = 'Tipo de servicio agregado';
            }

            res.status(201).send(msg);
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

/**
 * Método para obtener los datos de 1 tipo de servicio
 */
const one = async (req, res) => {
    try {
        // obtener los id
        const ID = parseInt(req.params.id);
        // obtener los datos del registro con este
        const TIPO = await POOL.query('SELECT * FROM tipos_servicios WHERE id_tipo_servicio = $1', [ID])
        // verificar sí la respuesta es correcta
        if (res.status(200)) res.send(TIPO.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor');
    }
}

//Metodo para actualizar los datos
const change = (req, res) => {
    try {
        //obtener el id del registro
        const ID = parseInt(req.params.id);
        //obtener los datos de la peticion
        const { tipo } = req.body;

        //realizar actualizacion
        POOL.query('UPDATE tipos_servicios SET tipo_servicio = $1 WHERE id_tipo_servicio = $2',
            [tipo, ID], (err, result) => {
                // verificar sí hubo un error                                
                if (err) {

                    if (err.code === '23505') {
                        // enviar error el cliente
                        er = 'Dato unico ya registrado';
                    } else {
                        er = err.message;
                    }
                    res.json({ error: er });
                    // sí es ejecuta esto, el status 201 no se enviará
                    // return;                    

                } else {
                    msg = 'Sucursal modificada';
                }
                res.status(201).send(msg);
            })
    } catch (error) {

    }
}

const destroy = (req, res) => {
    try {
        //obtener id del tipo servicio
        const ID = parseInt(req.params.id);
        //realizar query
        POOL.query('DELETE FROM tipos_servicios WHERE id_tipo_servicio = $1', [ID], (err, result) => {
            // verificar sí hubo un error                                                            
            if (err) {

                // verificar sí no se puede eliminar porque tiene datos dependientes                
                (err.code === '23503') ? e = 'No se puede modificar o eliminar debido a servicios asociados' : e = err.message
                // retornar el error
                res.json({ error: e });
                return;

            } else {
                msg = 'Sucursal eliminada';
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get, change, destroy, store, one }