// requerir el enrutador de express
const { Router } = require('express')
// requerir los modulos con los queries
const { get, getTiposSerivicios, getServicios } = require('../queries/detalle');

// instanciar router
const DETALLE = Router();

// rutas donde se ejecutan métodos con los queries
DETALLE.get('/tipos', getTiposSerivicios);
DETALLE.get('/productos:tipo', getServicios);
DETALLE.get('/:orden', get);


// exportar modulo con las rutas
module.exports = DETALLE;

// ir a index.js de api para usar estas rutas