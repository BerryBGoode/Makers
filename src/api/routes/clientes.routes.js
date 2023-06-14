// requerir enrutador de express
const { Router } = require('express');
// importar métodos con las transferencias SQL
const { get, store, one, change, destroy } = require('../queries/clientes');
// importar validaciones
const { validateClient } = require('./../validators/clientes')

// instanciar router
const CLIENTES = Router();

// obtener todos los datos
CLIENTES.get('/', get);
// guardar datos
CLIENTES.post('/', validateClient, store);
// obtener cliente según id
CLIENTES.get('/:id', one);
// actualizar datos
CLIENTES.put('/:id', validateClient, change);
// ruta para eliminar datos
CLIENTES.delete('/:id', destroy);

// exportar enrutador con los inserts, selects, deletes y updates
module.exports = CLIENTES;