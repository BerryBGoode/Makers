// requerir de enrutador de express
const { Router } = require('express')
// requerir de los métodos para realizar queries
const { validateUsuario, getInfo, getConfig, change } = require('../queries/login')
// inicializar router
const LOGIN = Router();

LOGIN.post('/', validateUsuario);
LOGIN.get('/config', getConfig);
LOGIN.get('/', getInfo);
LOGIN.put('/', change)

module.exports = LOGIN