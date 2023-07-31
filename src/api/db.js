// requerir el modulo de postgres y con pool le decimos que él va a poder hacer los queries
const POOL = require('pg').Pool;
// requerir del modulo de MySQL para poder manejera
// el objeto con la conexión
const MySQL = require('mysql');

// definir attrs para la conexión
const pg = new POOL({
    user: 'postgres',
    password: '123', //modificar esta propiedad según tú contraseña de postgres
    database: 'makers',
    port: 5432,
    host: 'localhost'
});

// definir un objeto con los datos de la conexión
const mysql = MySQL.createPool({
    database: 'makers',
    password: '',
    host: 'localhost',// definir dominio en este caso host local
    user: 'root'
})


// exportar modulo con los attrs de la conexión
module.exports = { pg };