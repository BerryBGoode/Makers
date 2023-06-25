// requerir del enrutador de express
const { Router } = require('express');
// requerir de los queries
const { get, getProductos, store, one, change, destroy } = require('../queries/productos_sucursales');

// instanciar Router
const PRODUCTOS = Router();
// ir a index.js de api para usar o habilitar estas rutas

PRODUCTOS.get('/productos', getProductos);
PRODUCTOS.get('/detalle/:id', one);
PRODUCTOS.get('/:id', get);
PRODUCTOS.post('/', store);
PRODUCTOS.put('/:id', change);
PRODUCTOS.delete('/:id', destroy);


module.exports = PRODUCTOS;