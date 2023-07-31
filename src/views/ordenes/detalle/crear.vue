<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Pedido
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form class="container h-91 relative" @submit.prevent="crearDetalle">

            <div class="form-data">
                <form action="" class="form-1">
                    <div class="load">
                        <div class=" input-container">
                            <label for="" class="form-label">Sucursal</label>
                            <select class="form-select mb-3" v-if="sucursales.length > 0" v-model="model.sucursal.value"
                                @change="cargarServicios" id="sucursal">
                                <option selected disabled>Seleccionar</option>
                                <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal"
                                    class="option" v-text="sucursal.nombre_sucursal"></option>
                            </select>
                            <select class="form-select mb-3" v-else>
                                <option selected>No se encontraron sucursales</option>
                            </select>

                        </div>
                        <div class="input-container">
                            <label for="" class="form-label">Servicio</label>

                            <select class="form-select mb-3" v-if="model.sucursal.value === 'Seleccionar'">
                                <option selected disabled>Seleccionar</option>
                            </select>

                            <select class="form-select mb-3" v-if="model.sucursal.value !== 'Seleccionar'"
                                v-model="model.pedido.servicio" @change.prevent="select">
                                <option selected disabled>Seleccionar</option>
                                <option selected disabled v-if="servicios <= 0">Sucursal sin servicios</option>
                                <option v-for="(servicio, i) in servicios" :key="i" :value="servicio.id_detalle"
                                    :data-tipo_servicio="servicio.tipo_servicio" :data-cantidad="servicio.cantidad">
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
                            <input type="number" class="form-control" id="" min="1" :max="100"
                                v-model="model.pedido.descuento">

                        </div>
                        <div class="mb-3 input-container">
                            <label for="" class="form-label">Cantidad</label>
                            <input type="number" class="form-control" id="" min="1" :max="input.stock"
                                v-model="model.pedido.cantidad" :readonly="input.read">

                        </div>
                    </div>
                </form>
            </div>
            <hr>
            <div class="buttons-reservacion padding-buttons bottom-0 form-data">
                <RouterLink :to="{ path: '/ordenes/' + this.$route.params.orden + '/detalles' }" class="btn btn-makers">
                    Cancelar
                </RouterLink>
                <button type="submit" class="btn btn-makers">Agregar</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import { RouterLink } from 'vue-router'
export default {
    // nombre del componente
    name: "crearDetalle",
    components: { RouterLink },
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
                read: true,
                stock: ''
            },
            msg: ''
        }
    },
    mounted() {
        this.cargarSucursales();
    },
    // métodos del componente
    methods: {
        // método para validar el tipo de servicio para así cambiar estado de los inputs
        select(event) {
            // habilitar la edición de cantidad
            this.input.read = false;
            // obtener el tipo de servicio según el servicio seleccionado
            // igualmente verificar sí el tipo de servicio es producto        
            if (event.target.options[event.target.selectedIndex].dataset.tipo_servicio === 'Producto') {
                // asignar las existencias al input según el producto seleccionado
                this.input.stock = event.target.options[event.target.selectedIndex].dataset.cantidad
            } else {
                // limpiar exitencias
                this.input.stock = '';
            }

        },
        // método para obtener las sucursales
        cargarSucursales() {
            try {
                // hacer petición para obtener sucursales y horarios
                axios.get('http://localhost:3000/api/empleados/sucursales')
                    .then(res => { this.sucursales = res.data }) // obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los servicios según el tipo 
        cargarServicios(event) {
            // recear valor texto de select servicio
            this.model.pedido.servicio = 'Seleccionar'
            // obtener el id del tipo
            this.model.sucursal.value = event.target.value;
            // obtener el texto del option para evaluar la cantidad
            this.model.sucursal.txt = event.target.options[event.target.selectedIndex].text;
            // realizar petición
            axios.get('http://localhost:3000/api/ordenes/detalles/productos' + this.model.sucursal.value)
                .then(res => { this.servicios = res.data; })
                .catch(e => alert(e));
        },
        crearDetalle() {
            this.msg = '';
            // validar datos, evaluar casos erroneos
            if (this.model.pedido.servicio === 'Seleccionar' || this.model.sucursal.value === 'Seleccionar' ||
                this.model.pedido.descuento <= -1 || this.model.pedido.descuento >= 101 ||
                this.model.pedido.cantidad <= -1 || ((this.input.stock) ? this.model.pedido.cantidad > this.input.stock : this.model.pedido.cantidad) >= 1) {
                this.msg = 'Datos invalidos'
                
            } else {

                // asignar por defecto sí es un servicio el seleccionado y no agregado descuento ni cantidad
                if (!this.model.pedido.cantidad && !this.model.pedido.descuento && this.model.sucursal.txt !== 'Producto') {
                    this.model.pedido.cantidad = 1;
                    this.model.pedido.descuento = 0;
                }
                // verificar sí hay cantidad establecediar cuando es un producto para asignar por defecto
                if (!this.model.pedido.cantidad && this.model.sucursal.txt !== 'Producto') {
                    this.model.pedido.cantidad = 1;
                }
                // verificar sí se establecio un descuento, sino establecer 0
                if (!this.model.pedido.descuento) {
                    this.model.pedido.descuento = 0;
                }

                // realizar petición
                axios.post('http://localhost:3000/api/ordenes/detalles/', this.model.pedido)
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
                                orden: this.$route.params.orden
                            }
                            this.msg = '';
                            alert(res.data);
                            // redireccionar
                            this.$router.push('/ordenes/' + this.$route.params.orden + '/detalles');
                        }
                    })
                    .catch(e => {                        
                        alert(e.response.data.error);
                    });
            }
        }
    }
}
</script>