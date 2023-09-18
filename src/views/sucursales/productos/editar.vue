<style>
.mb-24-2vh {
    margin-bottom: 24.2vh;
}

.router-view {
    height: 90%;
    position: relative;
}

.bottom {
    position: absolute;
    bottom: 0;
    width: 98%;
}
</style>

<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Servicio sucursal
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container router-view">
            <form @submit.prevent="modificarServicio">
                <div class="form-data mb-24-2vh">
                    <span class="bold">
                        Servicio
                    </span>
                    <div action="" class="form-2">
                        <label for="" class="form-label">Servicio</label>
                        <!-- verifica sí existen productos -->
                        <select class="form-select mb-3" aria-label="Default select example" v-if="servicios.length > 0"
                            v-model="this.model.servicio.servicio" @change="select">
                            <option selected disabled>Seleccionar</option>
                            <!-- recorrre los productos encontrados -->
                            <option v-for="(servicio, i) in servicios" :key="i" :value="servicio.id_servicio"
                                :data-existencias="servicio.existencias" :data-tipo_servicio="servicio.tipo_servicio">
                                {{ servicio.nombre_servicio }}</option>
                        </select>
                        <select class="mb-3 form-select" v-else>
                            <option>No se encontraron servicios</option>
                        </select>
                        <div class="mb-3">
                            <label for="" class="form-label">Cantidad</label>
                            <!-- en max obtener la existencias del producto -->
                            <input type="number" autocomplete="off" class="form-control" :readonly="input.read" min="1" :max="input.stock"
                                v-model="this.model.servicio.cantidad">
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <hr>
                    <div class="buttons-reservacion form-data">
                        <router-link :to="{ path: '/sucursales/' + this.$route.params.id + '/productos' }"
                            class="btn btn-makers">
                            Cancelar
                        </router-link>
                        <button type="submit" class="btn btn-makers">Agregar cambios</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import store from '../../../store';
import { notificationError, notificationSuccess } from '../../../components/alert.vue';
export default {
    // nombre del componente
    name: "editarProductoSucursal",
    // funciones que retornará el componente
    data() {
        return {
            servicios: [],
            model: {
                servicio: {
                    // sucursal va a ser igual al parametro de la url
                    sucursal: this.$route.params.id,
                    servicio: 'Seleccionar',
                    cantidad: ''
                }
            },
            input: {
                stock: '',
                read: ''
            },
            producto: {
                existencias: '',
                tipo: ''

            },
            msg: ''
        }
    },
    mounted() {
        // llamar aquí los método al cargar la página
        this.cargarServicios();
        this.cargar(this.$route.params.detalle);
    },
    // métodos del componente
    methods: {
        // método para validar el input según el tipo de servicio
        select(event) {
            // verificar sí el servicio seleccionado es un producto
            // para habilitar unos campos

            if (event.target.options[event.target.selectedIndex].dataset.tipo_servicio === 'Producto') {
                // habilitar agregar cantidad
                this.input.read = false;
                // asignar la cantidad máxima el input, según las existencias del producto
                this.producto.existencias = event.target.options[event.target.selectedIndex].dataset.existencias;
                this.input.stock = this.producto.existencias;
                this.producto.tipo = 'Producto'
                this.model.servicio.cantidad = ''
            } else {
                // desabilitar edición
                this.input.read = true;
                // limpiar la cantidad máxima del input
                this.input.stock = '';
                // asignar 1 al servicio
                this.model.servicio.cantidad = 1;
                // para verificar después de sí el servicio es un producto
                // al momento de cargar
                this.producto.tipo = ''
            }
        },
        cargarServicios() {
            // realizar petición
            axios.get('http://localhost:3000/api/sucursales/productos/productos', store.state.config)
                .then(res => {
                    this.servicios = res.data;
                })
                .catch(e => { notificationError(e.response.data) })
        },
        cargar(detalle) {
            axios.get('http://localhost:3000/api/sucursales/productos/detalle/' + detalle, store.state.config)
                .then(res => {
                    // cargar los valores
                    this.model.servicio = {
                        servicio: res.data.id_servicio,
                        cantidad: res.data.cantidad
                    }
                })
                .catch(e => { notificationError(e.response.data) })
        },
        modificarServicio() {
            this.msg = '';
            if (this.model.servicio.servicio === 'Seleccionar' ||
                (this.input.stock) ?
                (this.model.servicio.cantidad <= 0)
                : (this.model.servicio.cantidad > this.input.stock) ||
                    (this.producto.tipo !== 'Producto') ?
                    (this.model.servicio.cantidad !== 1)
                    : (this.model.servicio.cantidad <= 0 || this.model.servicio.cantidad > this.input.stock)) {
                this.msg = 'Datos invalidos';
            }
            // obtener el id del detalle
            let id = this.$route.params.detalle;
            // validar datos
            // realizar petición

            axios.put('http://localhost:3000/api/sucursales/productos/' + id, this.model.servicio, store.state.config)
                .then(res => {
                    // verificar sí se realizo la tarea como se deceaba
                    // status = 201 en post y put
                    if (res.status === 201) {
                        // limipiar campos
                        this.model.servicio = {
                            cantidad: '',
                            servicio: 'Seleccionar'
                        }
                        // redireccionar
                        notificationSuccess(res.data);
                        this.msg = '';
                        this.$router.push('/sucursales/' + this.$route.params.id + '/productos');
                    }
                })
                .catch(err => { notificationError(err.response.data); })
        }

    }
}

</script>