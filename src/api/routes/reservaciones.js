//importar enrutador de express
const { Router } = require('express');
//importar métodos con las  transferencias SQL
const { get, store, one, change, destroy} = require('../queries/reservaciones');
//importar validaciones
const { validateClient} = require('./../validators/reservaciones');

//instanciar router
const RESERVACIONES = Router();
//Obtener los datos
RESERVACIONES.get('/', get);
//guardar datos
RESERVACIONES.post('/',validateReser, store);
//obtener reservacion según id
RESERVACIONES.get('/:id', one);
//actualizar daatos
RESERVACIONES.put('/:id', validateReser, change);
//ruta para eliminar datos
RESERVACIONES.delete('/:id', destroy);

//exportar enrutador con los insert, select, delete y update
module.exports = RESERVACIONES;