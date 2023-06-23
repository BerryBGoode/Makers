// requerir de el enrutador de express
const { Router } = require('express');
// requerir de los métodos para realizar queries
const { get } = require('../queries/horarios');
const { getHorarios } = require('../queries/empleados')

// instanciando en enrutador
const HORARIOS = Router();

// definiendo rutas o endpoints
HORARIOS.get('/', getHorarios);

// exportando objeto con las rutas
module.exports = HORARIOS;

// ir a index.js para utilizar y definir la ruta en el servidor
