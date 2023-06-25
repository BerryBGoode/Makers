// requerir del enrutador de express
const { Router } = require('express');
// requerir de los métodos para realizar los queries
const { get, store, one, change, destroy } = require('../queries/sucursales')

// instanciar interface Router
const SUCURSAL = Router();

SUCURSAL.get('/', get);
SUCURSAL.post('/', store);
SUCURSAL.get('/:id', one);
SUCURSAL.put('/:id', change);
SUCURSAL.delete('/:id', destroy); 
// exportar ruta
module.exports = SUCURSAL;

// ir a api/index.js para usar las rutas