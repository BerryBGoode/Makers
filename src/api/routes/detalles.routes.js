// requerir el enrutador de express
const { Router } = require('express')
// requerir los modulos con los queries
const { get, getServicios, store, one, change, destroy } = require('../queries/detalle');

// instanciar router
const DETALLE = Router();

// rutas donde se ejecutan métodos con los queries
DETALLE.get('/productos:sucursal', getServicios);
DETALLE.get('/orden/:orden', get);
DETALLE.post('/', store);
DETALLE.get('/detalle/:id', one);
DETALLE.put('/:id', change);
DETALLE.delete('/:id', destroy);

// exportar modulo con las rutas
module.exports = DETALLE;

// ir a index.js de api para usar estas rutas