// requerir el modulo de postgres
const POOL = require('pg').Pool;

// definir attrs para la conexión
const DB = new POOL({
    user : 'postgres', 
    password : '123', //modificar esta propiedad según tú contraseña de postgres
    database : 'makers',
    port : 5432,
    host : 'localhost' 
});

// exportar modulo con los attrs de la conexión
module.exports = DB;