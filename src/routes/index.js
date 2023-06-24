// archivo con la configuración de direcciones

// importación de modulos para el enrutamiento con vue
import { createRouter, createWebHistory } from "vue-router";

// importar interfaces, dashboard (inicio), servicios, productos, clientes
//#region 
// empleados, reservaciones, facturas, horarios, sucursales
import dashboard from "../views/dashboard.vue";
import servicios from "../views/servicios/vista.vue";
import productos from '../views/productos/vista.vue';
import clientes from '../views/clientes/vista.vue';
import empleados from '../views/empleados/vista.vue';
import reservaciones from '../views/reservaciones/vista.vue';
import facturas from '../views/facturas/vista.vue';
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
//#endregion

// configuración
import config from '../views/configuracion.vue';

// 404
import notfound from '../views/404.vue';

import App from '../App.vue';

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
        {
            name: 'servicios',
            path: '/servicios',
            component: servicios
        },
        // productos 
        {
            name: 'productos',
            path: '/productos',
            component: productos
        },
        // clientes
        {
            name: 'clientes',
            path: '/clientes',
            component: clientes
        },
        // empleados
        {
            name: 'empleados',
            path: '/empleados',
            component: empleados
        },
        // reservaciones
        {
            name: 'reservaciones',
            path: '/reservaciones',
            component: reservaciones
        },
        // facturas
        {
            name: 'facturas',
            path: '/facturas',
            component: facturas
        },
        // sucursales
        {
            name: 'sucursales',
            path: '/sucursales',
            component: sucursales
        },
        // horarios
        {
            name: 'horarios',
            path: '/horarios',
            component: horarios
        },
        // tipos de servicios
        {
            name: 'tipos servicios',
            path: '/servicios/tipos',
            component: tipos
        },
        // cargos
        {
            name: 'cargos',
            path: '/empleados/cargos',
            component: cargos
        },
        // ordenes 
        {
            name: 'ordenes',
            path: '/ordenes',
            component: ordenes
        },
        // productos sucursales
        {
            name: 'productosSucursales',
            path: '/sucursales/:id/productos',
            component: productosSucursales
        },
        {
            name: 'detallesOrden',
            path: '/ordenes/:orden/detalles/',
            component: detallesOrden
        },
        //#endregion

        // rutas de crear
        // servicios
        {
            name: 'crearServicio',
            path: '/servicios/crear',
            component: crearServicio

        },
        // productos
        {
            name: 'crearProducto',
            path: '/productos/crear',
            component: crearProducto
        },
        {
            name: 'crearCliente',
            path: '/clientes/crear',
            component: crearCliente
        },
        {
            name: 'crearEmpleado',
            path: '/empleados/crear',
            component: crearEmpleado
        },
        // reservacion
        {
            name: 'crearReservacion',
            path: '/reservaciones/crear',
            component: crearReservacion
        },
        {
            name: 'crearTipoServicio',
            path: '/servicios/tipos/crear',
            component: crearTipo
        },
        {
            name: 'crearCargo',
            path: '/empleados/cargos/crear',
            component: crearCargo
        },
        {
            name: 'crearOrden',
            path: '/ordenes/crear',
            component: crearOrden
        },
        {
            name: 'crearSucursal',
            path: '/sucursales/crear',
            component: crearSucursal
        },
        {
            name: 'crearHorario',
            path: '/horarios/crear',
            component: crearHorario
        },
        {
            name: 'crearFactura',
            path: '/facturas/crear',
            component: crearFactura
        },
        {
            name: 'crearProductoSucursal',
            path: '/sucursales/:id/productos/crear',
            component: crearProductoSucursal
        },
        {
            name: 'crearDetalle',
            path: '/ordenes/:orden/detalles/crear/',
            component: crearDetalle
        },
        // TODO: faltan algunos de crear



        // rutas de actualizar, reciben parametro de id
        // clientes
        {
            name: 'editarCliente',
            path: '/clientes/editar/:id',
            component: editarCliente
        },
        {
            name: 'editarEmpleado',
            path: '/empleados/editar/:id',
            component: editarEmpleado
        },
        {
            name: 'editarProductoSucursal',
            path: '/sucursales/:id/productos/editar/:detalle',
            component: editarProductoSucursal
        },
        {
            name: 'editarDetalleOrden',
            path: '/ordenes/:id/detalles/editar/:detalle',
            component: editarDetalle
        },
        {
            name: 'editarProducto',
            path: '/productos/editar/:id',
            component: editarProducto
        },
        {
            name: 'editarServicio',
            path: '/servicios/editar/:id',
            component: editarServicio
        },
        {
            name: 'editarHorarios',
            path: '/horarios/editar/:id',
            component: editarHorario
        },
        {
            name: 'editarSucursal',
            path: '/sucursales/editar/:id',
            component: editarSucursal
        },

        // configuración
        {
            name: 'configuracion',
            path: '/configuracion',
            component: config
        },

        // ruta cuando no se encontró la ruta
        {
            path: '/:pathMatch(.*)*',
            component: notfound
        },
        {
            name: 'index',
            path: '/',
            component: dashboard
            
        }

    ]
})

// exportando ruteado
export default ROUTER;