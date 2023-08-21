// importando enrutados de express
const { Router } = require('express');
// importando los métodos de /queries/reportes.js
const { getProxReservaciones, getPrevReservaciones,
    getLessProductos, historialComprasCliente,
    historialReservacionesCliente,
    ventasDia, ventasMes, reservacionesMes, getEmpleadosOrdenes,
       getTipoServicios
} = require('../queries/reportes');


// instanciar router para poder crear las rutas del servidor y poder acceder a ellas 
// del lado del cliente por medio de la url
const APP = new Router();

APP.get('/empleadoordenes',getEmpleadosOrdenes);
APP.get('/tiposervicios', getTipoServicios );
APP.get('/proxreservaciones', getProxReservaciones);
APP.get('/prevreservaciones', getPrevReservaciones);
APP.get('/lessproductos', getLessProductos);
APP.get('/historialcompras/:cliente', historialComprasCliente);
APP.get('/historialreservaciones/:usuario', historialReservacionesCliente);
APP.get('/ventadia/:fecha', ventasDia);
APP.get('/ventasmes/:mes', ventasMes);
APP.get('/reservacionesmes/:mes', reservacionesMes);

// exportar enrutador para importarlo en ../index.js
module.exports = APP;