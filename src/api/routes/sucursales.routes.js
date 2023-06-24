// requerir del enrutador de express
const { Router } = require('express');
// requerir de los métodos para realizar los queries
const { get, store } = require('../queries/sucursales')

// instanciar interface Router
const SUCURSAL = Router();

SUCURSAL.get('/', get);
SUCURSAL.post('/', store)

// exportar ruta
module.exports = SUCURSAL;

// ir a api/index.js para usar las rutas