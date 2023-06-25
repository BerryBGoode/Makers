// requerir del ruteados para activar los métodos 
const { Router} = require('express');
// requerir los métodos de los queries
const { get, getClienteDui, getObtenerClientes, change, destroy, store } = require('../queries/ordenes');


// instanciado router
const ORDENES = Router();

// métodos para hacer acciónes
ORDENES.get('/', get);
ORDENES.get('/ordenes', getObtenerClientes);
ORDENES.get('/ClienteDui',  getClienteDui);
ORDENES.put('/:id', change);
ORDENES.delete('/:id', destroy);
EMPLEADO.post('/', store); 

// exportar ruteador
module.exports = ORDENES;