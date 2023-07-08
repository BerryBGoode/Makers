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
                                <!-- caso donde existan más de 0 tipos de servicios -->
                                <select class="form-select mb-3" v-if="sucursales.length > 0" v-model="model.sucursal.value"
                                    @change="cargarSucursales" id="sucursales">
                                    <option selected disabled>Seleccionar</option>
                                    <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal"
                                        class="option" v-text="sucursal.nombre_sucursal"></option>
                                </select>
                                <!-- caso default-->
                                <select class="form-select mb-3" v-else>
                                    <option selected>No se encontraron tipos de servicio</option>
                                </select>

                            </div>
                            <div class="input-container">
                                <label for="" class="form-label">Servicio</label>
                                <!-- caso donde no sé haya seleccionar tipo de servicio -->
                                <select class="form-select mb-3" v-if="model.sucursal.txt === 'Seleccionar'">
                                    <!-- verificar sí el cliente ha seleccionar un tipo de servicio -->
                                    <option selected disabled>Seleccionar</option>
                                </select>
                                <!-- caso donde se haya selecccionar el tipo de servicio -->
                                <select class="form-select mb-3" v-if="model.sucursal.txt !== 'Seleccionar'"
                                    v-model="model.pedido.servicio">
                                    <!-- verificar sí el cliente ha seleccionar un tipo de servicio -->
                                    <option selected disabled>Seleccionar</option>
                                    <option v-for="(servicio, i) in servicios" :key="i" :value="servicio.id_servicio">
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
                                <!-- verificar sí ha seleccionado producto -->
                                <!-- en max obtener la existencias del producto -->
                                <!-- sí el tipo es producto entonces  se pueda editar-->
                                <input v-if="model.sucursal.txt === 'Producto'" type="number" class="form-control" id="" min="1"
                                    max="" v-model="model.pedido.cantidad">
                                <input v-else type="number" class="form-control" id="" min="1" max="" readonly
                                    v-model="model.pedido.cantidad">

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
                    orden: this.$route.params.id
                }
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
                this.model.tipo.value = event.target.value;
                // obtener el texto del option para evaluar la cantidad
                this.model.tipo.txt = event.target.options[event.target.selectedIndex].text;
                
            }
            // realizar petición
            axios.get('http://localhost:3000/api/ordenes/detalles/productos' + this.model.tipo.value)
                .then(res => {
                    this.servicios = res.data;
                })
                .catch(e => alert(e));
        },
        // método para modificar los datos (UPDATE)
        modificarDetalle() {
            this.msg = '';
            // validar datos
            // asignar por defecto sí es un servicio el seleccionado y no agregado descuento ni cantidad
            if (!this.model.pedido.cantidad && !this.model.pedido.descuento && this.model.tipo.txt !== 'Producto') {
                this.model.pedido.cantidad = 1;
                this.model.pedido.descuento = 0;
            }

            if (!this.model.pedido.cantidad && this.model.tipo.txt !== 'Producto') {
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
                        this.$router.push('/ordenes/' + this.$route.params.id + '/detalles');
                    }
                })
                .catch(e => alert(e));
        },
        // método para obtener los datos apartir del detalle
        cargarDetalle() {
            // obtener los datos del detalle
            axios.get('http://localhost:3000/api/ordenes/detalles/detalle/' + this.$route.params.detalle)
                .then(res => {
                    // obtener los datos
                    const DETALLE = res.data[0];
                    console.log(DETALLE)
                    // this.cargarServicios(event),
                    // cargar los datos 
                    this.model.tipo = {
                        txt: DETALLE.tipo_servicio,
                        value: DETALLE.id_tipo_servicio
                    };
                    this.model.pedido = {
                        servicio: DETALLE.id_servicio,
                        descuento: DETALLE.descuento,
                        cantidad: DETALLE.cantidad,
                        orden: this.$route.params.id
                    }
                    this.cargarServicios();
                })                
        }

    }
}

</script>