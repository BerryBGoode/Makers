// requerir del ruteados para activar los métodos 
const { Router} = require('express');
// requerir los métodos de los queries
const { get,  getDuiEmpleado, getDirección, getObtenerEmpleados , change, destroy, store  } = require('../queries/facturas');


// instanciado router
const FACTURAS = Router();

// métodos para hacer acciónes
FACTURAS.get('/', get);
FACTURAS.get('/empleados',  getDuiEmpleado);
FACTURAS.get('/sucursales', getDirección);
FACTURAS.get('/empleados', getObtenerEmpleados);
FACTURAS.put('/:id', change);
FACTURAS.delete('/:id', destroy);
FACTURAS.post('/', store); 

// exportar ruteador
module.exports = FACTURAS;