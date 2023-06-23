// requerir del enrutador de express
const { Router } = require('express');
// métodos con los queries
const { get, getServicios } = require('../queries/servicios')

// instanciar interface
const SERVICIO = Router();

SERVICIO.get('/', get);
SERVICIO.get('/tipos', getServicios)
// exportar la instancia de la interface
module.exports = SERVICIO;

// ir a api/index.js a implementar nueva ruta