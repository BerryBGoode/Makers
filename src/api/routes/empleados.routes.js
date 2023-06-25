// requerir del ruteados para activar los métodos 
const { Router} = require('express');
// requerir los métodos de los queries
const { get, getSucursales, getHorarios, getCargos, store, one, change, destroy } = require('../queries/empleados');

// instanciado router
const EMPLEADO = Router();

// métodos para hacer acciónes
EMPLEADO.get('/', get);
EMPLEADO.get('/sucursales', getSucursales);
EMPLEADO.get('/horarios', getHorarios);
EMPLEADO.get('/cargos', getCargos);
EMPLEADO.post('/', store); 
EMPLEADO.get('/:id', one);
EMPLEADO.put('/:id', change);
EMPLEADO.delete('/:id', destroy);

// exportar ruteador
module.exports = EMPLEADO;
