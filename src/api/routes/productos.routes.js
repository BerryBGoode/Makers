// requerir de el enrutador de express
const { Router } = require('express')
// requerir de los métodos para hacer queries;
const { change, destroy, get, one, store } = require('../queries/productos');

// instanciar express-router
const PRODUCTO = Router();

// realizar endpoints o donde caen las acciones
PRODUCTO.get('/', get);
PRODUCTO.post('/', store);
PRODUCTO.get('/:id', one);
PRODUCTO.put('/:id', change);
PRODUCTO.delete('/:id', destroy);

// exportar ruteador
module.exports = PRODUCTO;

// ir a api/index.js