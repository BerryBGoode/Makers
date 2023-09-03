// archivo con la configuración de direcciones

// importación de modulos para el enrutamiento con vue
import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
// importar interfaces, dashboard (inicio), servicios, productos, clientes
//#region 
// empleados, reservaciones, facturas, horarios, sucursales
import dashboard from "../views/dashboard.vue";
import servicios from "../views/servicios/vista.vue";
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
import crearReservacion from "../views/reservaciones/crear.vue";
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
import config from '../views/configuracion.vue';

// 404
import notfound from '../views/404.vue';

import inicio from '../views/inicio.vue';

import login from '../views/login.vue';

import template from '../App.vue';

// intancia del enrutador
const ROUTER = createRouter({
    // configuración del historial dentro de la ejecucción
    // se el valor asignado es la url que se utiliza para obtener 
    // la url base del proyecto
    // hace la consulta a la al obj. routes, según el valor obtenido de la url
    // para buscar el componente
    history: createWebHistory(import.meta.env.BASE_URL),
    // definiendo arreglo con las rutas
    routes: [
        // nombre de la ruta para ser llamada en el sidebar
        // path: direcicón url
        // nombre del componente importado
        // inicio
        //#region 
        // servicios
        // { path: '/', component: dashboard },

        {
            name: 'login',
            path: '/login',
            component: login
        },
        // ruta cuando no se encontró la ruta
        {
            path: '/:pathMatch(.*)*',
            component: notfound,
            name: '404'
        },
        {
            name: 'index',
            path: '/',
            // component: login,
        },
        {
            name: 'dashboard',
            path: '/dashboard',
            component: dashboard,
            children: [
                {
                    name: 'inicio',
                    path: '/inicio',
                    component: inicio,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'servicios',
                    path: '/servicios',
                    component: servicios,
                    meta: { requiresAuth: true }
                },
                // productos 
                {
                    name: 'productos',
                    path: '/productos',
                    component: productos,
                    meta: { requiresAuth: true }
                },
                // clientes
                {
                    name: 'clientes',
                    path: '/clientes',
                    component: clientes,
                    meta: { requiresAuth: true }
                },
                // empleados
                {
                    name: 'empleados',
                    path: '/empleados',
                    component: empleados,
                    meta: { requiresAuth: true }
                },
                // reservaciones
                {
                    name: 'reservaciones',
                    path: '/reservaciones',
                    component: reservaciones,
                    meta: { requiresAuth: true }
                },
                // sucursales
                {
                    name: 'sucursales',
                    path: '/sucursales',
                    component: sucursales,
                    meta: { requiresAuth: true }
                },
                // horarios
                {
                    name: 'horarios',
                    path: '/horarios',
                    component: horarios,
                    meta: { requiresAuth: true }
                },
                // tipos de servicios
                {
                    name: 'tipos servicios',
                    path: '/servicios/tipos',
                    component: tipos,
                    meta: { requiresAuth: true }
                },
                // cargos
                {
                    name: 'cargos',
                    path: '/empleados/cargos',
                    component: cargos,
                    meta: { requiresAuth: true }
                },
                // ordenes 
                {
                    name: 'ordenes',
                    path: '/ordenes',
                    component: ordenes,
                    meta: { requiresAuth: true }
                },
                // productos sucursales
                {
                    name: 'productosSucursales',
                    path: '/sucursales/:id/productos',
                    component: productosSucursales,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'detallesOrden',
                    path: '/ordenes/:orden/detalles/',
                    component: detallesOrden,
                    meta: { requiresAuth: true }
                },
                //#endregion

                // rutas de crear
                // servicios
                {
                    name: 'crearServicio',
                    path: '/servicios/crear',
                    component: crearServicio,
                    meta: { requiresAuth: true }

                },
                // productos
                {
                    name: 'crearProducto',
                    path: '/productos/crear',
                    component: crearProducto,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearCliente',
                    path: '/clientes/crear',
                    component: crearCliente,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearEmpleado',
                    path: '/empleados/crear',
                    component: crearEmpleado,
                    meta: { requiresAuth: true }
                },
                // reservacion
                {
                    name: 'crearReservacion',
                    path: '/reservaciones/crear',
                    component: crearReservacion,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearTipoServicio',
                    path: '/servicios/tipos/crear',
                    component: crearTipo,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearCargo',
                    path: '/empleados/cargos/crear',
                    component: crearCargo,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearOrden',
                    path: '/ordenes/crear',
                    component: crearOrden,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearSucursal',
                    path: '/sucursales/crear',
                    component: crearSucursal,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearHorario',
                    path: '/horarios/crear',
                    component: crearHorario,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearFactura',
                    path: '/ordenes/:orden/factura/crear',
                    component: crearFactura,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearProductoSucursal',
                    path: '/sucursales/:id/productos/crear',
                    component: crearProductoSucursal,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'crearDetalle',
                    path: '/ordenes/:orden/detalles/crear/',
                    component: crearDetalle,
                    meta: { requiresAuth: true }
                },

                // rutas de actualizar, reciben parametro de id
                // clientes
                {
                    name: 'editarCliente',
                    path: '/clientes/editar/:id',
                    component: editarCliente,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarCargo',
                    path: '/empleados/cargos/editar/:id',
                    component: editarCargo,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarTipoServicio',
                    path: '/servicios/tipos/editar/:id',
                    component: editarTipo,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarEmpleado',
                    path: '/empleados/editar/:id',
                    component: editarEmpleado,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarProductoSucursal',
                    path: '/sucursales/:id/productos/editar/:detalle',
                    component: editarProductoSucursal,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarDetalleOrden',
                    path: '/ordenes/:orden/detalles/editar/:detalle',
                    component: editarDetalle,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarProducto',
                    path: '/productos/editar/:id',
                    component: editarProducto,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarServicio',
                    path: '/servicios/editar/:id',
                    component: editarServicio,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarHorarios',
                    path: '/horarios/editar/:id',
                    component: editarHorario,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarSucursal',
                    path: '/sucursales/editar/:id',
                    component: editarSucursal,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarRervacion',
                    path: '/reservaciones/editar/:id',
                    component: editarRervacion,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarOrden',
                    path: '/ordenes/editar/:id',
                    component: editarOrden,
                    meta: { requiresAuth: true }
                },
                {
                    name: 'editarFactura',
                    path: '/ordenes/:orden/factura/editar/:id',
                    component: editarFactura,
                    meta: { requiresAuth: true }
                },
                // configuración
                {
                    name: 'configuracion',
                    path: '/configuracion',
                    component: config,
                    meta: { requiresAuth: true }
                },
            ]
        },

    ]
})

// se ejecuta antes de ejecuta antes de realizar una acción o leer una ruta
ROUTER.beforeEach((to, from, next) => {
    // tiene como parametro la autenticación
    if (to.matched.some(route => route.meta.requiresAuth)) {
        // verificar sí se tiene autenciación para redireccionar a la que se deceaba, sino al login
        (store.state.access !== null) ? next() : next({ name: 'login' });

    }
    // verificar sí a ruta que se decea acceder es '/' y hay sesión
    else if (from.path === '/login' || to.path === '/') {
        // verificar sí hay sesión para redireccionar sí tiene sesión a inicio, sino a login
        (localStorage.getItem('auth') !== null) ? next({ name: 'inicio' }) : next({ name: 'login' })
    }
    else {
        // ejecutar lo que debería pasar sí no necesita autenticación
        next();
    }
})
// exportando ruteado
export default ROUTER;