// requerirmos en enrutador de express
const { Router } = require('express')
// requerimos los queris
const { change, destroy, get, store, one} = require('../queries/tipos_servicios')

// instanciamos enrutador
const TIPOS = Router();

// cargar todos los servicios
TIPOS.get('/', get);
// ruta para agregar
TIPOS.post('/',  store)
// obtener uno
TIPOS.get('/:id', one);
TIPOS.put('/:id', change)
TIPOS.delete('/:id', destroy)
// get, post, put y delete

module.exports = TIPOS;

// ir a index a usar las rutas