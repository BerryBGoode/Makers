// importando enrutados de express
const { Router } = require('express');
// importando los métodos de /queries/reportes.js
const { getEmpleadosOrdenes } = require('../queries/reportes')
const { getTipoServicios } = require('../queries/reportes')

// instanciar router para poder crear las rutas del servidor y poder acceder a ellas 
// del lado del cliente por medio de la url
const APP = new Router();
;
APP.get('/empleadoordenes',getEmpleadosOrdenes);
APP.get('/tiposervicios', getTipoServicios );

// exportar enrutador para importarlo en ../index.js
module.exports = APP;