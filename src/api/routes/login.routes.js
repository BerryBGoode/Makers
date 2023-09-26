// requerir de enrutador de express
const { Router } = require('express')
// requerir de los métodos para realizar queries
const {
    validateUsuario, getInfo, getConfig, change, verificarSucursales,
    verificarEmpleados, getDataPrimerEmpleado, validatePIN, validateRecuperación, restablecer, cambiarClave,
    getCargo, validateUsuarioBloqueado
} = require('../queries/login')

// inicializar router
const LOGIN = Router();

LOGIN.post('/', validateUsuario);
LOGIN.get('/config', getConfig);
LOGIN.get('/', getInfo);
LOGIN.put('/', change);
LOGIN.get('/verificar/sucursal', verificarSucursales);
LOGIN.get('/verificar/empleados', verificarEmpleados);
LOGIN.get('/get/primerempleado', getDataPrimerEmpleado);
LOGIN.post('/correo', validatePIN);
LOGIN.post('/recuperacion/correo/', validateRecuperación);
LOGIN.get('/restablecer', restablecer);
LOGIN.post('/restablecer', cambiarClave);
LOGIN.get('/usuario-bloqueado', validateUsuarioBloqueado)
LOGIN.get('/cargo', getCargo);

module.exports = LOGIN