// requerir del ruteados para activar los métodos 
const { Router} = require('express');
// requerir los métodos de los queries
const { get, getDirección, getObtenerEmpleados , change, destroy, store, one  } = require('../queries/facturas');
const { getDuiEmp } = require('../queries/reservaciones')

// instanciado router
const FACTURAS = Router();

// métodos para hacer acciónes
FACTURAS.get('/', get);
FACTURAS.get('/empleados',  getDuiEmp);
FACTURAS.get('/sucursales', getDirección);
FACTURAS.get('/:id', one);
FACTURAS.put('/:id', change);
FACTURAS.delete('/:id', destroy);
FACTURAS.post('/', store); 

// exportar ruteador
module.exports = FACTURAS;