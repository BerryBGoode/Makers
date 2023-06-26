// requerir del ruteados para activar los métodos 
const { Router} = require('express');
// requerir los métodos de los queries
const { get, getClienteDui, getObtenerClientes, change, destroy, store, one } = require('../queries/ordenes');


// instanciado router
const ORDENES = Router();

// métodos para hacer acciónes
ORDENES.get('/', get);
ORDENES.get('/ordenes', getObtenerClientes);
ORDENES.get('/clientes',  getClienteDui);
ORDENES.put('/:id', change);
ORDENES.delete('/:id', destroy);
ORDENES.post('/', store); 
ORDENES.get('/:id', one);

// exportar ruteador
module.exports = ORDENES;