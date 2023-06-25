// requerir del enrutador de express
const { Router } = require('express');
// métodos con los queries
const { get, getServicios, store, one, change, destroy } = require('../queries/servicios')

// instanciar interface
const SERVICIO = Router();

SERVICIO.get('/', get);
SERVICIO.get('/tipos', getServicios)
SERVICIO.post('/', store)
SERVICIO.get('/:id', one);
SERVICIO.put('/:id', change);
SERVICIO.delete('/:id', destroy);
// exportar la instancia de la interface
module.exports = SERVICIO;

// ir a api/index.js a implementar nueva ruta