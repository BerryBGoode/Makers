// requerir de las variables de entorno
require('dotenv').config();
// importar y asignar modulo para trabajar
const EXPRESS = require('express');
// importar o requerir cors para habilitar permisos en las peticiones
const CORS = require('cors');

const path = require('path');
// requerir dependencia para subir archivos a la apu
// const FILEUPLOAD = require('express-fileupload');

// requerir las rutas para clientes
const CLIENTESROUTES = require('./routes/clientes.routes');
// requiriendo rutas para empleados
const EMPLEADOSROUTES = require('./routes/empleados.routes');
// requiriendo de las rutas para productos_sucursal
const PRODUCTOS_SUCURALES = require('./routes/productos_sucursales.routes');
// requerir de las rutas de detalle_orden
const DETALLE = require('./routes/detalles.routes');
// requerir de las rutas de login
const LOGIN = require('./routes/login.routes');
// requerir de las rutas de productos
const PRODUCTO = require('./routes/productos.routes');
const SERVICIO = require('./routes/servicios.routes');
const HORARIOS = require('./routes/horarios.routes')
const SUCURSALES = require('./routes/sucursales.routes');
const RESERVACIONES = require('./routes/reservaciones.routes');
const ORDENES = require('./routes/ordenes.routes');
const FACTURAS = require('./routes/facturas.routes');
const CARGOS = require('./routes/cargos.routes');
const TIPOS = require('./routes/tipos_servicios.routes');
const GRAFICAS = require('./routes/graficas.routes');
const REPORTES = require('./routes/reportes.routes');
const FILES = require('./routes/files.routes');
// instanciando express
const APP = EXPRESS();
// settenado puerto, enviar un establecido por el sistema 
// sino establecer uno por defecto
APP.set('port', process.env.PORT || 3000);

// habilitar express upload
// APP.use(FILEUPLOAD());
// habilitar cors para los permisos
APP.use(CORS());
APP.use(EXPRESS.static(path.join(__dirname, './audios')))
// convertir a json las respuestas del servidor
APP.use(EXPRESS.json());

// usar las rutas
APP.use('/api/clientes', CLIENTESROUTES);
APP.use('/api/empleados', EMPLEADOSROUTES);
APP.use('/api/sucursales/productos', PRODUCTOS_SUCURALES);
APP.use('/api/ordenes/detalles', DETALLE);
APP.use('/api/productos', PRODUCTO);
APP.use('/api/servicios', SERVICIO);
APP.use('/api/auth', LOGIN);
APP.use('/api/horarios', HORARIOS);
APP.use('/api/reservaciones', RESERVACIONES);
APP.use('/api/sucursales', SUCURSALES);
APP.use('/api/ordenes', ORDENES);
APP.use('/api/facturas', FACTURAS);
APP.use('/api/cargos', CARGOS);
APP.use('/api/tipos', TIPOS);
APP.use('/api/graficas', GRAFICAS);
APP.use('/api/reportes', REPORTES);
APP.use('/api/upload', FILES);

// escuchar al servidor
APP.listen(APP.get('port'), () => {
    console.log('server in port ' + APP.get('port'));
})
