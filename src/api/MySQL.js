// requerir del modulo de mysql
const MySQL = require('mysql');

// attrs. de la conexión con mariaDB
const POOL = MySQL.createPool({
    database: 'makers_fu',
    password: '',
    host: 'localhost',// definir dominio en este caso host local
    user: 'root'
})


/**
 * 
 * @param {*} sql sentece SQL to request 
 * @param {*} params if the sentences required especific datas
 * @returns promise with datas of database
 */
const execute = (sql, params = null) => {
    // retornar la promesa
    return new Promise((res, rej) => {
        try {
            // realizar consulta, enviar parametros = null
            // y un callback, método dentro de la llamada a un método
            // y esta solo se ejecuta cuando se realizó el proceso
            POOL.query(sql, params, (err, result) => {
                // verificar errores sino enviarlo los datos de la respuesta
                (err) ? rej(err) : res(result);

            })
        } catch (error) {
            console.log(error);
            return null;
        }
    })
}

module.exports = { execute }