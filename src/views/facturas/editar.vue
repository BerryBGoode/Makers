<style>
.bottoms {
    position: absolute;
    width: 100%;
    bottom: 0;
}
</style>
<template>
    <div class="container servicios component-servicio h-100 relative">
        <div class="top">
            <h5 class="bold">
                Factura
            </h5>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container">
            <div class="form-data">
                <span class="bold">
                    Empleado
                </span>
                <div class="form-2">
                    <label for="clientes" class="form-label">DUI</label>
                    <!-- verificar sí existe dui del cliente -->
                    <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                        v-model="model.factura.empleado" v-if="empleados.length > 0" @change="getEmpleado">
                        <option selected disabled>Seleccionar</option>
                        <!-- recorrer los datos de clientes -->
                        <option v-for="(empleado, i) in empleados" :key="i" :value="empleado.id_empleado">{{ empleado.dui }}
                        </option>
                    </select>
                    <!-- sino existe el dui del empleado -->
                    <select class="form-select mb-3" name="error" v-else>
                        <option selected>No se encontraron datos</option>
                    </select>
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" autocomplete="off" class="form-control" id="nombres" v-model="empleado.nombres" readonly>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" autocomplete="off" class="form-control" id="apellidos" v-model="empleado.apellidos" readonly>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="form-data ">
                <span class="bold">
                    Sucursal
                </span>
                <div class="form-2 flex wp sp-bet">
                    <label for="dirección" class="form-label">Dirección</label>
                    <!-- verificar sí existe una dirección -->
                    <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                        v-if="sucursales.length > 0" v-model="this.model.factura.sucursal">
                        <option selected disabled>Seleccionar</option>
                        <!-- recorrer los datos de la dirección -->
                        <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal">{{
                            sucursal.nombre_sucursal }}</option>
                    </select>
                    <!-- sino existen sucursales -->
                    <select class="form-select mb-3" name="error" v-else>
                        <option selected>No se encontraron datos</option>
                    </select>
                </div>
            </div>
            <hr>
            <div class="form-data ">
                <span class="bold">
                    info. Factura
                </span>
                <div class="form-2 flex wp sp-bet">
                    <label for="dirección" class="form-label">Estado</label>
                    <!-- verificar sí existe una dirección -->
                    <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                        v-model="this.model.factura.estado">
                        <option selected disabled>Seleccionar</option>
                        <option value="1">Pagada</option>
                        <option value="2">Pendiente</option>

                    </select>
                </div>
            </div>
            <hr>
            <div class="buttons-reservacion form-data bottoms">
                <router-link to="/ordenes" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button @click="eliminarFactura" type="button" class="btn btn-makers">Eliminar</button>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>

<script>
// importar axios para realizar peticiones
import axios from 'axios';
import { notificationError, notificationQuestion, notificationSuccess } from '../../components/alert.vue';
import store from '../../store';
// exportar componente
export default {
    // nombre del componente
    name: "crearFactura",
    // funciones que retornará el componente
    data() {
        return {
            // arreglo con info. sucursales
            sucursales: [],
            // arreglo con info. sucursales
            empleados: [],
            empleado: {
                nombres: '',
                apellidos: ''
            },
            model: {
                factura: {
                    empleado: 'Seleccionar',
                    sucursal: 'Seleccionar',
                    estado: 'Seleccionar',
                    orden: this.$route.params.orden

                }
            },
            // mostrarle al cliente mensajes
            msg: ''
        }
    },
    mounted() {

        // cargar sucursales
        this.cargarSucursales();
        this.cargarEmpleadoDui();
        this.getFactura();
    },
    // métodos del componente
    methods: {
        getFactura() {
            // realizar petición
            axios.get('http://localhost:3000/api/facturas/' + this.$route.params.id, store.state.config)
                .then(res => {
                    this.model.factura = {
                        empleado: res.data.id_empleado,
                        estado: res.data.estado,
                        sucursal: res.data.id_sucursal
                    }
                    this.empleado = {
                        nombres: res.data.nombres,
                        apellidos: res.data.apellidos
                    }
                }).catch(e => notificationError(e.response.data))
        },
        // método para obtener el dui del cliente
        cargarEmpleadoDui() {
            try {
                // hacer petición para obtener dui de clientes
                axios.get('http://localhost:3000/api/reservaciones/empleados', store.state.config)
                    .then(res => { this.empleados = res.data; }) // obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data) })

            } catch (error) {
                console.error(error);
            }
        },
        getEmpleado() {

            axios.get('http://localhost:3000/api/reservaciones/empleados/' + this.model.factura.empleado, store.state.config)
                .then(res => {
                    this.empleado = {
                        nombres: res.data.nombres,
                        apellidos: res.data.apellidos,
                    }
                })
                .catch(e => { notificationError(e.response.data) });

        },
        // método para obtener la sucursal para la factura
        cargarSucursales() {
            // realizar petición
            axios.get('http://localhost:3000/api/facturas/sucursales', store.state.config)
                // cuando pase todo correctamente
                .then(res => { this.sucursales = res.data }) // cuando todo salga correcto asignar valores a arreglo
                .catch(e => { notificationError(e.response.data); }) // mostrar mensaje de error
        },

        // método para agregar una nueva factura
        modificar() {
            // validar datos
            // realizar petición y enviando datos
            axios.put('http://localhost:3000/api/facturas/' + this.$route.params.id, this.model.factura, store.state.config)
                .then(res => {
                    // cuando si se realizo la tarea deceada y se creo algo 
                    // 201 es usado en método post y put
                    if (res.status === 201 && !res.data.error) {
                        // limpiar valores 
                        this.model.factura = {
                            empleado: 'Seleccionar',
                            sucursal: 'Seleccionar',
                            estado: 'Seleccionar',

                        }
                        // redireccionar
                        notificationSuccess(res.data)
                        this.$router.push('/ordenes');
                    }
                })
                .catch(e => { notificationError(e.response.data) });
        },
        async eliminarFactura() {
            if (await notificationQuestion('Desea eliminar esta factura?', 3500)) {
                axios.delete('http://localhost:3000/api/facturas/' + this.$route.params.id, store.state.config)
                    .then(res => {
                        // verificar errores
                        notificationSuccess(res.data);
                        this.$router.push('/ordenes');
                    })
                    .catch(e => {
                        notificationError(e.response.data);
                    })
            }
        }
    }
}
</script>