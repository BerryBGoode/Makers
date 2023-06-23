// requerir de enrutador de express
const { Router } = require('express')
// requerir de los métodos para realizar queries
const { validateUsuario } = require('../queries/login')
// inicializar router
const LOGIN = Router();

LOGIN.post('/', validateUsuario)

module.exports = LOGIN