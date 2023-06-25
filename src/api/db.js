// requerir el modulo de postgres y con pool le decimos que él va a poder hacer los queries
const POOL = require('pg').Pool;

// definir attrs para la conexión
const DB = new POOL({
    user : 'postgres', 
    password : 'alvaradolira', //modificar esta propiedad
    database : 'makers',
    port : 5432,
    host : 'localhost' 
});

// exportar modulo con los attrs de la conexión
module.exports = DB;