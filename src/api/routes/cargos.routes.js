// importar enrutador de express
const { Router } = require('express');
// importar métodos con las transferencias SQL
const { store, change, destroy, get, one } = require('../queries/cargos');
// importar validaciones


// instanciar router
const CARGOS = Router();

// obtener todos los datos
CARGOS.get('/', get);
// obtener los datos del registro seleccionado
CARGOS.get('/:id', one);
// guardar datos
CARGOS.post('/', store);
// actualizar
CARGOS.put('/:id', change);
// eliminar
CARGOS.delete('/:id', destroy)

// exportar enrutador con los inserts, selects, deletes y updates
module.exports = CARGOS;
// ir a index para utilizar estas rutas