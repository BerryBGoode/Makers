// importar y asignar modulo para trabajar
const EXPRESS = require('express');
// importar o requerir cors para habilitar permisos en las peticiones
const CORS = require('cors');

// requerir las rutas para clientes
const CLIENTESROUTES = require('./routes/clientes.routes');

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

// escuchar al servidor
APP.listen(APP.get('port'), () => {
    console.log('server in port '+APP.get('port'));
})
