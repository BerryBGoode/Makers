// importando enrutados de express
const { Router } = require('express');
// importando los métodos de /queries/reportes.js
const { getProxReservaciones } = require('../queries/reportes')
const { getEmpleadosCargos } = require('../queries/reportes')
const { getProdSucursal } = require('../queries/reportes')
const { getEmpleadosOrdenes } = require('../queries/reportes')

// instanciar router para poder crear las rutas del servidor y poder acceder a ellas 
// del lado del cliente por medio de la url
const APP = new Router();

APP.get('/proxreservaciones', getProxReservaciones);
APP.get('/empleadoscargos', getEmpleadosCargos);
APP.get('/prodsucursal', getProdSucursal);
APP.get('/empleadoOrdene',getEmpleadosOrdenes);

// exportar enrutador para importarlo en ../index.js
module.exports = APP;