<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Pedido
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container">
            <form @submit.prevent="modificarDetalle">
                <div class="form-data">
                    <form action="" class="form-1">
                        <div class="load">
                            <div class=" input-container">
                                <label for="sucursales" class="form-label">Sucursal</label>
                                <select class="form-select mb-3" v-if="sucursales.length > 0" v-model="model.sucursal.value"
                                    @change="cargarServicios" id="sucursales">
                                    <option selected disabled>Seleccionar</option>
                                    <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal"
                                        class="option" v-text="sucursal.nombre_sucursal"></option>
                                </select>
                                <!-- caso default-->
                                <select class="form-select mb-3" v-else>
                                    <option selected>No se encontraron sucursales</option>
                                </select>

                            </div>
                            <div class="input-container">
                                <label for="" class="form-label">Servicio</label>
                                <!-- caso donde no sé haya seleccionar tipo de servicio -->
                                <select class="form-select mb-3" v-if="model.sucursal.value === 'Seleccionar'">

                                    <option selected disabled>Seleccionar</option>
                                </select>

                                <select class="form-select mb-3" v-if="model.sucursal.value !== 'Seleccionar'"
                                    v-model="model.pedido.servicio" @change="select">

                                    <option selected disabled>Seleccionar</option>

                                    <option selected disabled v-if="servicios <= 0">Sucursal sin servicios</option>

                                    <option v-for="(servicio, i) in servicios" :key="i" :value="servicio.id_detalle"
                                        :data-existencias="servicio.existencias"
                                        :data-tipo-servicio="servicio.tipo_servicio">
                                        {{ servicio.nombre_servicio }}</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="form-data mb-36vh">
                    <form action="" class="form-1">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="" class="form-label">Descuento</label>
                                <input type="number" class="form-control" id="" min="1" max=""
                                    v-model="model.pedido.descuento">

                            </div>
                            <div class="mb-3 input-container">
                                <label for="" class="form-label">Cantidad</label>
                                <input type="number" class="form-control" id="" min="1" :max="input.stock"
                                    :readonly="input.read" v-model="model.pedido.cantidad">
                            </div>
                        </div>
                    </form>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link :to="{ path: '/ordenes/' + this.$route.params.orden + '/detalles' }"
                        class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    // nombre del componente
    name: "editarDetalle",
    // funciones que retornará el componente
    data() {
        return {
            // para cargar tipos
            sucursales: [],
            // cargar servicios
            servicios: [],
            model: {
                sucursal: {
                    value: 'Seleccionar',
                    txt: ''
                },
                pedido: {
                    servicio: 'Seleccionar',
                    descuento: '',
                    cantidad: '',
                    orden: this.$route.params.orden
                }
            },
            input: {
                stock: '',
                read: false
            },
            msg: ''
        }
    },
    mounted() {
        this.cargarDetalle();
        this.cargarSucursales();
    },
    // métodos del componente
    methods: {
        // método para validar los estados de algunos inputs y valores según el tipo de servicio
        select(event) {
            // obtener y verificar sí el tipo de producto para asignar límite
            // máximo, según las existencias del producto en la sucursal
            // estos datos se obtienen del DOM
            (event.target.options[event.target.selectedIndex].dataset.tipo_servicio === 'Producto') ?
                // asignar cantidad máxima al input según las existencias
                this.input.stock = event.target.options[event.target.selectedIndex].dataset.existencias
                :
                // limpiar las existencias
                this.input.stock = ''
        },
        // método para obtener los tipos de servicios
        cargarSucursales() {
            axios.get('http://localhost:3000/api/empleados/sucursales')
                .then(res => { this.sucursales = res.data; })
                .catch(e => console(e));
        },
        // método para obtener los servicios según el tipo 
        cargarServicios(event) {
            if (event) {
                // recear valor texto de select servicio
                this.model.pedido.servicio = 'Seleccionar'
                // obtener el id del tipo
                this.model.sucursal.value = event.target.value;
                // obtener el texto del option para evaluar la cantidad
                this.model.sucursal.txt = event.target.options[event.target.selectedIndex].text;

            }
            // realizar petición
            axios.get('http://localhost:3000/api/ordenes/detalles/productos' + this.model.sucursal.value)
                .then(res => {
                    this.servicios = res.data;
                })
                .catch(e => alert(e));
        },
        // método para modificar los datos (UPDATE)
        modificarDetalle() {
            this.msg = '';
            // verificar sí los datos son erroneas
            if (this.model.pedido.servicio === 'Seleccionar' ||
                this.model.sucursal.value === 'Seleccionar' || this.model.pedido.descuento <= -1 ||
                this.model.pedido.descuento <= -1 || this.model.pedido.descuento >= 101 ||
                this.model.pedido.cantidad <= -1 ||
                this.model.pedido.cantidad > this.input.stock) {
                this.msg = 'Datos invalidos';
            } else {

                // asignar por defecto sí es un servicio el seleccionado y no agregado descuento ni cantidad
                if (!this.model.pedido.cantidad && !this.model.pedido.descuento && this.model.sucursal.txt !== 'Producto') {
                    this.model.pedido.cantidad = 1;
                    this.model.pedido.descuento = 0;
                }

                if (!this.model.pedido.cantidad && this.model.sucursal.txt !== 'Producto') {
                    this.model.pedido.cantidad = 1;
                }

                if (!this.model.pedido.descuento) {
                    this.model.pedido.descuento = 0;
                }
                // realizar petición enviandole el parametro de iddetalle de la url y los datos
                axios.put('http://localhost:3000/api/ordenes/detalles/' + this.$route.params.detalle, this.model.pedido)
                    .then(res => {
                        // verificar error                    
                        if (res.data.error) {
                            this.msg = res.data.error;
                        }
                        // verificar sí la tarea se realizo de manera esperada
                        if (res.status === 201 && !res.data.error) {
                            // limipiar campos
                            this.model.pedido = {
                                servicio: 'Seleccionar',
                                descuento: '',
                                cantidad: '',
                                orden: this.$route.params.id
                            }
                            this.msg = '';
                            alert(res.data);
                            // redireccionar
                            this.$router.push('/ordenes/' + this.$route.params.orden + '/detalles');
                        }
                    })
                    .catch(e => alert(e));
            }


        },
        // método para obtener los datos apartir del detalle
        cargarDetalle() {
            // obtener los datos del detalle
            axios.get('http://localhost:3000/api/ordenes/detalles/detalle/' + this.$route.params.detalle)
                .then(res => {
                    // obtener los datos                    
                    // this.cargarServicios(event),
                    // cargar los datos 
                    const DETALLE = res.data[0];
                    this.model.sucursal = {
                        txt: DETALLE.nombre_sucursal,
                        value: DETALLE.id_sucursal
                    };
                    this.model.pedido = {
                        servicio: DETALLE.id_detalle_servicio,
                        descuento: DETALLE.descuento,
                        cantidad: DETALLE.cantidad,
                        orden: this.$route.params.orden
                    }
                    this.input.stock = DETALLE.cantidad_servicio
                    this.cargarServicios();
                })
        }

    }
}

</script>