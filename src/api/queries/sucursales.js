// requerir del pool con los attrs de la conexión
const POOL = require('../db');

/**
 * Método para obtener las sucursales
 */
const get = async (req, res) => {
    try {
        // realizar query
        const SUCURSALES = await POOL.query('SELECT * FROM sucursales')
        // retornar los datos sí el estado es el esperado
        if (res.status(200)) res.send(SUCURSALES.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

/**
 * Método para agregar una sucursal
 */
const store = (req, res) => {
    let er, msg;
    try {
        // obtener los datos de la petición
        const { tel, inicio, cierre, direccion, nit, nrc } = req.body
        // realizar query 
        POOL.query('INSERT INTO sucursales(telefono, horario, nrc, nit, direccion) VALUES ($1, $2, $3, $4, $5)',
            [tel, inicio + ' A.M - ' + cierre + ' P.M', nrc, nit, direccion], (err, result) => {
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
                    msg = 'Sucursal agregada';
                }

                res.status(201).send(msg);
            })
    } catch (error) {
        console.log(error);
        res.status(500).send('Surgio un problema en el servidor')
    }
}

module.exports = { get, store }