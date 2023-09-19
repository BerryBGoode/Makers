<style>
.info-orden {
    margin-bottom: 27vh;
}

.h-91 {
    height: 91%;
}

.relative {
    position: relative;
}

.bottom-0 {
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>
<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Orden
            </h5>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container relative h-91">
            <div class="form-data">
                <span class="bold">
                    Cliente
                </span>
                <div class="form-2">
                    <label for="">DUI</label>
                    <!-- verificar sí existe dui del cliente -->
                    <select @change="getCliente" class="form-select mb-3" aria-label="Default select example" id="clientes"
                        v-if="clientes.length > 0" v-model="this.model.ordenes.cliente">
                        <option selected disabled>Seleccionar</option>
                        <!-- recorrer los datos de clientes -->
                        <option v-for="(clientes, i) in clientes" :key="i" :value="clientes.id_cliente">{{ clientes.dui }}
                        </option>
                    </select>
                    <!-- sino existe el dui del cliente -->
                    <select class="form-select mb-3" name="error" v-else>
                        <option selected>No se encontraron datos</option>
                    </select>
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres" v-model="cliente.nombres" readonly>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" v-model="cliente.apellidos" readonly>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="form-data info-orden">
                <span class="bold">
                    info. Orden
                </span>
                <div class="form-2">
                    <div class="mb-3 flex-col">
                        <label for="">Fecha</label>
                        <input type="date" name="" id="" class="form-control" v-model="model.ordenes.fecha">
                    </div>
                </div>
            </div>
            <hr>
            <div class="buttons-reservacion bottom-0 form-data">
                <router-link to="/ordenes" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import store from '../../store';
import { notificationError, notificationSuccess } from '../../components/alert.vue';

// exportar componente
export default {
    name: 'ordenes',
    data() {
        return {
            // arreglo con info. clientes
            clientes: [],
            // arreglo para obtener datos de horarios
            dui: [],
            cliente: {
                nombres: '',
                apellidos: ''
            },
            model: {
                ordenes: {
                    fecha: '',
                    cliente: 'Seleccionar'
                }
            },
            // mostrarle al cliente mensajes
            msg: ''
        }
    },
    mounted() {
        // cargar sucursales
        this.cargarClienteDui();
        this.getOrden();
    },
    methods: {
        getCliente() {
            axios.get('http://localhost:3000/api/reservaciones/clientes/' + this.model.ordenes.cliente, store.state.config)
                .then(res => { this.cliente.nombres = res.data.nombres; this.cliente.apellidos = res.data.apellidos })
                .catch(e => { notificationError(e.response.data) });

        },
        // método para obtener el dui del cliente
        cargarClienteDui() {
            try {
                // hacer petición para obtener dui de clientes
                axios.get('http://localhost:3000/api/ordenes/clientes', store.state.config)
                    .then(res => { this.clientes = res.data }) // obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data) })
            } catch (error) {
                console.error(error);
            }
        },
        getOrden() {
            axios.get('http://localhost:3000/api/ordenes/' + this.$route.params.id, store.state.config)
                .then(res => {
                    // cargar datos
                    this.model.ordenes = {
                        cliente: res.data.id_cliente,
                        fecha: res.data.fecha
                    }
                    this.cliente = {
                        apellidos: res.data.apellidos,
                        nombres: res.data.nombres
                    }
                }).catch(e => { notificationError(e.response.data) })
        },
        // método para agregar una nueva orden
        modificar() {
            // validar datos
            // realizar petición y enviando datos
            axios.put('http://localhost:3000/api/ordenes/' + this.$route.params.id, this.model.ordenes, store.state.config)
                .then(res => {
                    // cuando si se realizo la tarea deceada y se creo algo 
                    // 201 es usado en método post y put
                    if (res.status === 201) {
                        // limpiar valores 
                        this.model.ordenes = {
                            fecha: '',
                            hora: '',
                            dui: 'Seleccionar',
                            nombres: 'Seleccionar',
                            apellidos: 'Seleccionar',
                        }
                        // redireccionar
                        notificationSuccess(res.data)
                        this.$router.push('/ordenes');
                    }
                })
                .catch(e => { notificationError(e.response.data) });

        }
    }
}

</script>