<style>
.mb-36vh {
    margin-bottom: 36vh;
}

.align-center {
    align-self: center;
}

.switch-options {
    width: 25%;
    display: flex;
    justify-content: space-between;
}

.form-check-input:checked {
    background-color: #393534;
    border-color: #393534;
}

.form-switch .form-check-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.form-check-input:focus {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
    border-color: #b4b0af;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(84, 84, 84, 0.48);
}

.form-check-input {
    background-color: #393534;
    border-color: #393534;
}

.makers-switch {
    background-repeat: no-repeat;
}

.h-100 {
    height: 100%;
}
</style>

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
                                <label for="" class="form-label">Tipo de servicio</label>
                                <!-- caso donde existan más de 0 tipos de servicios -->
                                <select class="form-select mb-3" v-if="tipos.length > 0" v-model="model.tipo.value"
                                    @change="cargarServicios" id="tipoServicio">
                                    <option selected disabled>Seleccionar</option>
                                    <option v-for="(tipo, i) in tipos" :key="i" :value="tipo.id_tipo_servicio"
                                        class="option" v-text="tipo.tipo_servicio"></option>
                                </select>
                                <!-- caso default-->
                                <select class="form-select mb-3" v-else>
                                    <option selected>No se encontraron tipos de servicio</option>
                                </select>

                            </div>
                            <div class="input-container">
                                <label for="" class="form-label">Servicio</label>
                                <!-- caso donde no sé haya seleccionar tipo de servicio -->
                                <select class="form-select mb-3" v-if="model.tipo.txt === 'Seleccionar'">
                                    <!-- verificar sí el cliente ha seleccionar un tipo de servicio -->
                                    <option selected disabled>Seleccionar</option>
                                </select>
                                <!-- caso donde se haya selecccionar el tipo de servicio -->
                                <select class="form-select mb-3" v-if="model.tipo.txt !== 'Seleccionar'"
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
                                <input v-if="model.tipo.txt === 'Producto'" type="number" class="form-control" id="" min="1"
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
            tipos: [],
            // cargar servicios
            servicios: [],
            model: {
                tipo: {
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
        this.cargarTiposServicios();
    },
    // métodos del componente
    methods: {
        // método para obtener los tipos de servicios
        cargarTiposServicios() {
            axios.get('http://localhost:3000/api/ordenes/detalles/tipos')
                .then(res => { this.tipos = res.data; })
                .catch(e => alert(e));
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
            console.log(this.$route.params.detalle);
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
            console.log(this.$route.params.id + 'b');
            axios.put('http://localhost:3000/api/ordenes/detalles/' + this.$route.params.detalle, this.model.pedido)
                .then(res => {
                    // verificar error                    
                    if (res.data.error) {
                        this.msg = 'Error con algún dato enviado';
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