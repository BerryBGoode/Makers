// importar y asignar modulo para trabajar
const EXPRESS = require('express');
// importar o requerir cors para habilitar permisos en las peticiones
const CORS = require('cors');

// requerir las rutas para clientes
const CLIENTESROUTES = require('./routes/clientes.routes');
// requiriendo rutas para empleados
const EMPLEADOSROUTES = require('./routes/empleados.routes');
// requiriendo de las rutas para productos_sucursal
const PRODUCTOS_SUCURALES = require('./routes/productos_sucursales.routes');
// requerir de las rutas de detalle_orden
const DETALLE = require('./routes/detalles.routes');

// instanciando express
const APP = EXPRESS();
// settenado puerto, enviar un establecido por el sistema 
// sino establecer uno por defecto
APP.set('port', process.env.PORT || 3000);

// habilitar cors para los permisos
APP.use(CORS());
// convertir a json las respuestas del servidor
APP.use(EXPRESS.json());

// usar las rutas
APP.use('/api/clientes', CLIENTESROUTES);
APP.use('/api/empleados', EMPLEADOSROUTES);
APP.use('/api/sucursales/productos', PRODUCTOS_SUCURALES);
APP.use('/api/ordenes/detalles', DETALLE)

// escuchar al servidor
APP.listen(APP.get('port'), () => {
    console.log('server in port '+APP.get('port'));
})
