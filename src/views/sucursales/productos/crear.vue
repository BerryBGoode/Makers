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
            <form @submit.prevent="crear">
                <div class="form-data mb-24-2vh">
                    <span class="bold">
                        Servicio
                    </span>
                    <form action="" class="form-2">
                        <label for="" class="form-label">Servicio</label>
                        <!-- verifica sí existen productos -->
                        <select class="form-select mb-3" aria-label="Default select example" v-if="servicios.length > 0"
                            v-model="this.model.servicio.servicio">
                            <option selected disabled>Seleccionar</option>
                            <!-- recorrre los productos encontrados -->
                            <option v-for="(servicio, i) in servicios" :key="i" :value="servicio.id_servicio">{{
                                servicio.nombre_servicio }}</option>
                        </select>
                        <select class="mb-3 form-select" v-else>
                            <option>No se encontraron productos</option>
                        </select>
                        <div class="mb-3">
                            <label for="" class="form-label">Cantidad</label>
                            <!-- en max obtener la existencias del producto -->
                            <input type="number" class="form-control" id="" min="1" max=""
                                v-model="this.model.servicio.cantidad">
                        </div>
                    </form>
                </div>
                <div class="bottom">
                    <hr>
                    <div class="buttons-reservacion form-data">
                        <router-link :to="{ path: '/sucursales/' + this.$route.params.id + '/productos' }"
                            class="btn btn-makers">
                            Cancelar
                        </router-link>
                        <button type="submit" class="btn btn-makers">Agregar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    // nombre del componente
    name: "crearProductoSucursal",
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
            msg: ''
        }
    },
    mounted() {
        this.cargarProductos();
    },
    // métodos del componente
    methods: {
        cargarProductos() {
            // realizar petición
            axios.get('http://localhost:3000/api/sucursales/productos/productos')
                .then(res => {
                    this.servicios = res.data;
                })
                .catch(e => { console.log(e) })
        },
        crear() {
            console.log(this.model.producto)
            // validar datos
            axios.post('http://localhost:3000/api/sucursales/productos/', this.model.servicio)
                .then(res => {
                    // cuando hay un error que no realizo lo que se debía
                    if (!res.data.error) {
                        this.msg = 'Error con algún dato enviado';
                        // console.log(res.data)
                    }else{
                        this.msg = res.data.error;
                    }
                    // cuando si se realizo la tarea deceada y se creo algo 
                    // 201 es usado en método post y put
                    if (res.status === 201 && !res.data.error) {
                        // limpiar valores 
                        this.model.producto = {
                            cantidad: '',                                                
                            producto: 'Seleccionar',
                        }
                        // redireccionar
                        alert('Producto agregado')
                        this.$router.push('/sucursales/'+this.$route.params.id+'/productos');
                    }
                })
                .catch(err => {
                    alert(err)
                })
        }
    }
}

</script>