// archivo con la configuración de direcciones

// importación de modulos para el enrutamiento con vue
import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store';
import cookies from 'vue-cookies';
import { alertInfo } from '../components/alert.vue';
// importar interfaces, dashboard (inicio), servicios, productos, clientes
//#region 
// empleados, reservaciones, facturas, horarios, sucursales
import dashboard from '../views/dashboard.vue';
import servicios from '../views/servicios/vista.vue';
import productos from '../views/productos/vista.vue';
import clientes from '../views/clientes/vista.vue';
import empleados from '../views/empleados/vista.vue';
import reservaciones from '../views/reservaciones/vista.vue';
import sucursales from '../views/sucursales/vista.vue';
import horarios from '../views/horarios/vista.vue';
import tipos from '../views/tipos_servicios/vista.vue';
import cargos from '../views/cargos/vista.vue';
import ordenes from '../views/ordenes/vista.vue';
// vista de los formularios hijos
import productosSucursales from '../views/sucursales/productos/vista.vue';
import detallesOrden from '../views/ordenes/detalle/vista.vue';
//#endregion

//#region 
// arcihvos de crear
import crearReservacion from '../views/reservaciones/crear.vue';
import crearServicio from '../views/servicios/crear.vue';
import crearProducto from '../views/productos/crear.vue';
import crearCliente from '../views/clientes/crear.vue';
import crearEmpleado from '../views/empleados/crear.vue';
import crearTipo from '../views/tipos_servicios/crear.vue';
import crearCargo from '../views/cargos/crear.vue';
import crearOrden from '../views/ordenes/crear.vue';
import crearSucursal from '../views/sucursales/crear.vue';
import crearHorario from '../views/horarios/crear.vue';
import crearFactura from '../views/facturas/crear.vue';
import crearProductoSucursal from '../views/sucursales/productos/crear.vue';
import crearDetalle from '../views/ordenes/detalle/crear.vue';
//#endregion

//#region 
// archivos de editar
import editarCliente from '../views/clientes/editar.vue';
import editarEmpleado from '../views/empleados/editar.vue';
import editarProductoSucursal from '../views/sucursales/productos/editar.vue';
import editarDetalle from '../views/ordenes/detalle/editar.vue';
import editarProducto from '../views/productos/editar.vue';
import editarServicio from '../views/servicios/editar.vue';
import editarHorario from '../views/horarios/editar.vue';
import editarSucursal from '../views/sucursales/editar.vue'
import editarRervacion from '../views/reservaciones/editar.vue'
import editarOrden from '../views/ordenes/editar.vue'
import editarFactura from '../views/facturas/editar.vue';
import editarCargo from '../views/cargos/editar.vue';
import editarTipo from '../views/tipos_servicios/editar.vue';
//#endregion

// configuración

// intancia del enrutador
const ROUTER = createRouter({
    // configuración del historial dentro de la ejecucción
    // se el valor asignado es la url que se utiliza para obtener 
    // la url base del proyecto
    // hace la consulta a la al obj. routes, según el valor obtenido de la url
    // para buscar el componente
    history: createWebHashHistory(import.meta.env.BASE_URL),
    // definiendo arreglo con las rutas
    routes: [
        // nombre de la ruta para ser llamada en el sidebar
        // path: direcicón url
        // nombre del componente importado
        // inicio
        //#region
        {
            name: 'login',
            path: '/login',
            component: () => import('../views/login.vue')
        },
        {
            name: '404',
            path: '/404',
            component: () => import('../views/404.vue')
        },
        {
            name: 'contraseña',
            path: '/recuperacion',
            component: () => import('../views/empleados/formulario.vue')
        },
        
        // ruta cuando no se encontró la ruta
        {
            path: '/:pathMatch(.*)*',
            redirect: '/404',
        },
        {
            name: 'index',
            path: '/',
            // component: login,
        },
        {
            name: 'primeraSucursal',
            path: '/primer/sucursal',
            component: () => import('../views/primerUso/sucursal.vue'),
        },
        {
            name: 'primerEmpleado',
            path: '/primer/empleado',
            component: () => import('../views/primerUso/empleado.vue'),
        },
        {
            name: 'dashboard',
            path: '/dashboard',
            component: () => import('../views/dashboard.vue'),
            children: [
                {
                    name: 'inicio',
                    path: '/inicio',
                    component: () => import('../views/inicio.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'servicios',
                    path: '/servicios',
                    component: () => import('../views/servicios/vista.vue'),
                    meta: { requiresAuth: true },
                },
                // productos 
                {
                    name: 'productos',
                    path: '/productos',
                    component: () => import('../views/productos/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // clientes
                {
                    name: 'clientes',
                    path: '/clientes',
                    component: () => import('../views/clientes/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // empleados
                {
                    name: 'empleados',
                    path: '/empleados',
                    component: () => import('../views/empleados/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // reservaciones
                {
                    name: 'reservaciones',
                    path: '/reservaciones',
                    component: () => import('../views/reservaciones/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // sucursales
                {
                    name: 'sucursales',
                    path: '/sucursales',
                    component: () => import('../views/sucursales/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // horarios
                {
                    name: 'horarios',
                    path: '/horarios',
                    component: () => import('../views/horarios/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // tipos de servicios
                {
                    name: 'tiposServicios',
                    path: '/servicios/tipos',
                    component: () => import('../views/tipos_servicios/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // cargos
                {
                    name: 'cargos',
                    path: '/empleados/cargos',
                    component: () => import('../views/cargos/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // ordenes 
                {
                    name: 'ordenes',
                    path: '/ordenes',
                    component: () => import('../views/ordenes/vista.vue'),
                    meta: { requiresAuth: true }
                },
                // productos sucursales
                {
                    name: 'productosSucursales',
                    path: '/sucursales/:id/productos',
                    component: () => import('../views/sucursales/productos/vista.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'detallesOrden',
                    path: '/ordenes/:orden/detalles/',
                    component: () => import('../views/ordenes/detalle/vista.vue'),
                    meta: { requiresAuth: true }
                },
                //#endregion

                // rutas de crear
                // servicios
                {
                    name: 'crearServicio',
                    path: '/servicios/crear',
                    component: () => import('../views/servicios/crear.vue'),
                    meta: { requiresAuth: true }

                },
                // productos
                {
                    name: 'crearProducto',
                    path: '/productos/crear',
                    component: () => import('../views/productos/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearCliente',
                    path: '/clientes/crear',
                    component: () => import('../views/clientes/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearEmpleado',
                    path: '/empleados/crear',
                    component: () => import('../views/empleados/crear.vue'),
                    meta: { requiresAuth: true }
                },
                // reservacion
                {
                    name: 'crearReservacion',
                    path: '/reservaciones/crear',
                    component: () => import('../views/reservaciones/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearTipoServicio',
                    path: '/servicios/tipos/crear',
                    component: () => import('../views/tipos_servicios/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearCargo',
                    path: '/empleados/cargos/crear',
                    component: () => import('../views/cargos/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearOrden',
                    path: '/ordenes/crear',
                    component: () => import('../views/ordenes/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearSucursal',
                    path: '/sucursales/crear',
                    component: () => import('../views/sucursales/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearHorario',
                    path: '/horarios/crear',
                    component: () => import('../views/horarios/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearFactura',
                    path: '/ordenes/:orden/factura/crear',
                    component: () => import('../views/facturas/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearProductoSucursal',
                    path: '/sucursales/:id/productos/crear',
                    component: () => import('../views/sucursales/productos/crear.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearDetalle',
                    path: '/ordenes/:orden/detalles/crear/',
                    component: () => import('../views/ordenes/detalle/crear.vue'),
                    meta: { requiresAuth: true }
                },

                // rutas de actualizar, reciben parametro de id
                // clientes
                {
                    name: 'editarCliente',
                    path: '/clientes/editar/:id',
                    component: () => import('../views/clientes/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarCargo',
                    path: '/empleados/cargos/editar/:id',
                    component: () => import('../views/cargos/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarTipoServicio',
                    path: '/servicios/tipos/editar/:id',
                    component: () => import('../views/tipos_servicios/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarEmpleado',
                    path: '/empleados/editar/:id',
                    component: () => import('../views/empleados/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarProductoSucursal',
                    path: '/sucursales/:id/productos/editar/:detalle',
                    component: () => import('../views/sucursales/productos/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarDetalleOrden',
                    path: '/ordenes/:orden/detalles/editar/:detalle',
                    component: () => import('../views/ordenes/detalle/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarProducto',
                    path: '/productos/editar/:id',
                    component: () => import('../views/productos/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarServicio',
                    path: '/servicios/editar/:id',
                    component: () => import('../views/servicios/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarHorarios',
                    path: '/horarios/editar/:id',
                    component: () => import('../views/horarios/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarSucursal',
                    path: '/sucursales/editar/:id',
                    component: () => import('../views/sucursales/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarRervacion',
                    path: '/reservaciones/editar/:id',
                    component: () => import('../views/reservaciones/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarOrden',
                    path: '/ordenes/editar/:id',
                    component: () => import('../views/ordenes/editar.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarFactura',
                    path: '/ordenes/:orden/factura/editar/:id',
                    component: () => import('../views/facturas/editar.vue'),
                    meta: { requiresAuth: true }
                },
                // configuración
                {
                    name: 'configuracion',
                    path: '/configuracion',
                    component: () => import('../views/configuracion.vue'),
                    meta: { requiresAuth: true }
                },
            ]
        },
    ]
})

/**
 * TODO: REVERISAR CUANDO DE INICIO SE REDIRECCIONA A OTRA, EJEMPLO: PRODUCTOS, QUE DIRECCIONÉ A PRODUCTOS NO A INICIO.
 * TODO: REVISAR APP.VUE EN LA CONDICIÓN DE EMPLEADOS PARA REDIRECCIONAR A PRIMER USO 
 */
// se ejecuta antes de ejecuta antes de realizar una acción o leer una ruta
ROUTER.beforeEach((to, from, next) => {
    // tiene como parametro la autenticación
    if (to.matched.some(route => route.meta.requiresAuth)) {
        // verificar sí se tiene autenciación para redireccionar a la que se deceaba, sino al login
        (localStorage.getItem('auth') !== null) ? next() : next({ name: 'login' });
    }
    // verificar cuando se decea ir formulario de primera sucursal
    else if (to.path === '/primer/sucursal') {
        // cuando se desea ir a la ruta de primera sucursal
        // validar otra ves la cantidad de sucursales que se encontraron
        // verificar sí existen sucursales
        if (store.state.sucursales <= 0) {
            next();
        }
        // verificando sí existen empleados para direccionar al que se deceaba
        else if (store.state.empleados <= 0) {
            next('/primer/empleado');
        }
        // sí tanto como hay sucursales como empleados entonces va a verificar sí existen token para direccionar a la ruta debida
        else {

            (localStorage.getItem('auth')) ? next(from.path) : next('/login')
        }
    }
    // validando cuando se quiere ir primer empleado
    else if (to.path === '/primer/empleado') {
        // verificar sí existen sucursales
        if (store.state.sucursales <= 0) {
            next('/primer/sucursal')
        }
        // verificando sí existen empleados para direccionar al que se deceaba
        else if (store.state.empleados <= 0) {
            next()
        }
        // sí tanto como hay sucursales como empleados entonces va a verificar sí existen token para direccionar a la ruta debida
        else {
            (localStorage.getItem('auth')) ? next(from.path) : next('/login')
        }

    }
    // verificar cuando se va a navegar al login
    // cuando redirecciona al inicio
    else if (to.fullPath === '/login') {
        //  cuando se desea ir a la ruta de primera sucursal
        // validar otra ves la cantidad de sucursales que se encontraron
        if (store.state.sucursales <= 0) {
            next('/primer/sucursal')
        } else if (store.state.empleados <= 0) { next('/primer/empleado') }
        else {
            // verificar sí existe autencicación
            if (localStorage.getItem('auth')) {
                // redireccionar al inicio sí existen autenticación
                next({ name: 'inicio' })
            } else {
                next();
                // en esta parte se aplica cuando forsosamente se decea ir al login
                // next(); //bug : cuando inicia sesión, cuando de inicio -> primera sucursal y manda al login
            }
        }
    }
    // vericar sí no hay autenticación y este en login y se quiere ir a '/'
    else if (to.fullPath === '/' && from.path === '/login' && !localStorage.getItem('auth')) {
        next('/login')
    }
    // verificar sí se quiere ir a la '/' desde primer uso
    else if (to.fullPath === '/' && (from.path === '/primer/empleado' || from.path === '/primer/sucursal')) {
        // verificar sí existen empleados, para mandar a crear primer empleado o mandar a crear primer sucursal
        // porque puede entrar a esta condicional solo sí 
        // va (to) a la dirección raíz '/', y viene (from) de alguna dirección de primer uso
        (store.state.empleados <= 0) ? next('/primer/empleado') : next('/primer/sucursal');
    }
    // verificar sí el usuaurio esta autenticado cuando quiera acceder a la ruta raíz
    else if (to.fullPath === '/inicio' || to.fullPath === '/') {
        // en esta parte es cuando vue-router redirecciona al login
        // verificar sí hay sesión para redireccionar sí tiene sesión a inicio, sino a login
        if (localStorage.getItem('auth') !== null) {
            // redireccionar a inicio sí sé quería ir '/', sí no coincide redireccionar a la establecida según la ruta
            (to.fullPath === '/') ? next('/inicio') : next();
        } else {
            // se ejecutará un evento del storage
            // veficar sí se ha borrado el token para mandar al login
            if (localStorage.getItem('auth') !== null) {
                next();
            } else {
                // redirección sospechosa, cuando se elimina del localStorage
                next();
            }
            // next({ name: 'login' });

        }
    }
    else {

        // ejecutar lo que debería pasar sí no necesita autenticación
        next();
    }

})

// exportando ruteado
export default ROUTER;