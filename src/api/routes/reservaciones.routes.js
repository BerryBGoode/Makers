//importar enrutador de express
const { Router } = require('express');
//importar métodos con las  transferencias SQL
const { get, store, one, change, destroy, getCliente, getDuiCli, getDuiEmp, getEmpleado } = require('../queries/reservaciones');


//instanciar router
const RESERVACIONES = Router();
//Obtener los datos
RESERVACIONES.get('/', get);
//guardar datos
RESERVACIONES.get('/clientes', getDuiCli);
RESERVACIONES.get('/clientes/:id', getCliente)
RESERVACIONES.get('/empleados', getDuiEmp);
RESERVACIONES.get('/empleados/:id', getEmpleado)
RESERVACIONES.post('/', store);
//obtener reservacion según id
RESERVACIONES.get('/:id', one);
//actualizar daatos
RESERVACIONES.put('/:id', change);
//ruta para eliminar datos
RESERVACIONES.delete('/:id', destroy);

//exportar enrutador con los insert, select, delete y update
module.exports = RESERVACIONES;