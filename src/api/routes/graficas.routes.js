// requerir de enrutador de express
const { Router } = require('express');
// requerir de los métodos para obtener los datos para la gráficas
const { getVentas } = require('../queries/graficas');
const { getEmpleado } = require('../queries/graficas');

// instanciar enrutados
const ROUTER = Router();

// Definiendo rutas según urls personalizadas para acceder a los datos del servidor consulta a la base
// para retornarle el resultado del servidor (lo que se obtiene al realizar las consultas)
ROUTER.get('/ventas', getVentas)
ROUTER.get('/cargos', getEmpleado)


// exportar enrutador
module.exports = ROUTER
// ir a ./index.js para crear rutas accesibles