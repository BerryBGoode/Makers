<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Reservación
            </h5>
        </div>
        <hr>
        <div class="container">
            <form @submit.prevent="crearReser">
                <div class="form-data">
                    <span class="bold">
                        Cliente
                    </span>
                    <div class="form-2">
                        <label for="">DUI</label>
                        <select class="form-select mb-3" aria-label="Default select example" v-if="clientes.length > 0"
                            v-model="model.reservacion.cliente" @change="getCliente">
                            <option selected>Seleccionar</option>
                            <option v-for="(cliente, i) in clientes" :key="i" :value="cliente.id_cliente">{{
                                cliente.dui }}
                            </option>
                        </select>
                        <select class="form-select mb-3" aria-label="Default select example" v-else>
                            <option selected>No se encontraron datos</option>
                        </select>

                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" autocomplete="off" class="form-control" id="nombres" v-model="cliente.nombre" readonly>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" autocomplete="off" class="form-control" id="apellidos" v-model="cliente.apellido" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data">
                    <span class="bold">
                        Empleado
                    </span>
                    <div class="form-2">
                        <label for="">DUI</label>
                        <select class="form-select mb-3" aria-label="Default select example" v-if="empleados.length > 0"
                            v-model="model.reservacion.empleado" @change="getEmpleado">
                            <option selected>Seleccionar</option>
                            <option v-for="empleado in empleados" :key="empleado.id_empleado" :value="empleado.id_empleado">
                                {{
                                    empleado.dui }}
                            </option>

                        </select>
                        <select class="form-select mb-3" aria-label="Default select example" v-else>
                            <option selected>No se encontraron datos</option>
                        </select>
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" autocomplete="off" class="form-control" id="nombres" v-model="empleado.nombre" readonly>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" autocomplete="off" class="form-control" id="apellidos" v-model="empleado.apellido" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data">
                    <span class="bold">
                        Reservación
                    </span>
                    <div class="form-2 flex wp sp-bet">
                        <div class="mb-3 flex-col input-container">
                            <label for="">Fecha</label>
                            <input type="date" name="" id="" class="form-control" v-model="model.reservacion.fecha">
                        </div>
                        <div class="mb-3 flex-col input-container">
                            <label for="">Hora</label>
                            <input type="time" name="" id="" class="form-control" v-model="model.reservacion.hora">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link to="/reservaciones" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
//importar axios para realizar peticiones
import axios from 'axios';
import store from '../../store';
import { notificationError, notificationSuccess } from '../../components/alert.vue';
//exportar componenete
export default {
    // nombre del componente
    name: "crearReservacion",
    // funciones que retornará el componente
    data() {
        return {
            //arreglo con info. cliente
            clientes: [],
            //arreglo para obtener datos de empleado
            empleados: [],
            model: {
                reservacion: {
                    fecha: '',
                    hora: '',
                    cliente: 'Seleccionar',
                    empleado: 'Seleccionar',
                }
            },
            //mostrar el mensaje
            msg: '',

            // obj con datos del cliente
            cliente: {
                id: '',
                nombre: '',
                apellido: '',
                dui: 'Seleccionar'
            },
            // obj con datos del empleado
            empleado: {
                id: '',
                nombre: '',
                apellido: '',
                dui: 'Seleccionar'
            },
            // obj con datos de la reservación
            reservacion: {
                fecha: '',
                hora: ''
            }
        }
    },
    mounted() {
        //cargar clientes
        this.cargarClientes();
        //cargar empleados
        this.cargarEmpleados();
    },
    methods: {
        getCliente() {
            axios.get('http://localhost:3000/api/reservaciones/clientes/' + this.model.reservacion.cliente, store.state.config)
                .then(res => { this.cliente.nombre = res.data.nombres; this.cliente.apellido = res.data.apellidos })
                .catch(e => { notificationError(e.response.data) });
        },
        getEmpleado() {
            axios.get('http://localhost:3000/api/reservaciones/empleados/' + this.model.reservacion.empleado, store.state.config)
                .then(res => { this.empleado.nombre = res.data.nombres; this.empleado.apellido = res.data.apellidos })
                .catch(e => { notificationError(e.response.data) });
        },
        //método para obtener los clientes
        cargarClientes() {
            try {
                //hacer petición para obtener clientes
                axios.get('http://localhost:3000/api/reservaciones/clientes', store.state.config)
                    .then(res => {
                        this.clientes = res.data;
                    }) //obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data); });
            } catch (error) {
                console.error(error);
            }
        },
        //método para obtener los empleados de las reservaciones
        cargarEmpleados() {
            try {
                //hacer petición para obtener empleados
                axios.get('http://localhost:3000/api/reservaciones/empleados', store.state.config)
                    .then(res => { this.empleados = res.data }) //obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data) })
            } catch (error) {
                console.error(error);
            }
        },
        //método para agregar una reservación
        crearReser() {
            //validar datos
            //realizar petición y enviar datos
            axios.post('http://localhost:3000/api/reservaciones', this.model.reservacion, store.state.config)
                .then(res => {
                    //cuando si se realizó la tarea deseada y se creó algo
                    //201 es usado en método post y put
                    if (res.status === 201) {
                        //limpiar valores
                        this.model.reservacion = {
                            fecha: '',
                            hora: '',
                            cliente: 'Seleccionar',
                            empleado: 'Seleccionar',
                        }
                        //redireccionar
                        notificationSuccess(res.data);
                        this.$router.push('/reservaciones');
                    }
                    //si la respuesta es la esperada, redireccionará a la vista principal
                })
                .catch(e => { notificationError(e.response.data) });
        }
    }
}
</script>