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
                Producto sucursal
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container router-view">
            <form @submit.prevent="crear">
                <div class="form-data mb-24-2vh">
                    <span class="bold">
                        Producto
                    </span>
                    <form action="" class="form-2">
                        <label for="" class="form-label">Producto</label>
                        <!-- verifica sí existen productos -->
                        <select class="form-select mb-3" aria-label="Default select example" v-if="productos.length > 0"
                            v-model="this.model.producto.producto">
                            <option selected disabled>Seleccionar</option>
                            <!-- recorrre los productos encontrados -->
                            <option v-for="(producto, i) in productos" :key="i" :value="producto.id_servicio">{{
                                producto.nombre_servicio }}</option>
                        </select>
                        <select class="mb-3 form-select" v-else>
                            <option>No se encontraron productos</option>
                        </select>
                        <div class="mb-3">
                            <label for="" class="form-label">Cantidad</label>
                            <!-- en max obtener la existencias del producto -->
                            <input type="number" class="form-control" id="" min="1" max=""
                                v-model="this.model.producto.cantidad">
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
            productos: [],
            model: {
                producto: {
                    // sucursal va a ser igual al parametro de la url
                    sucursal: this.$route.params.id,
                    producto: 'Seleccionar',
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
                    this.productos = res.data;
                })
                .catch(e => { console.log(e) })
        },
        crear() {
            console.log(this.model.producto)
            // validar datos
            axios.post('http://localhost:3000/api/sucursales/productos/', this.model.producto)
                .then(res => {
                    // cuando hay un error que no realizo lo que se debía
                    if (res.data.error) {
                        this.msg = 'Error con algún dato enviado';
                        // console.log(res.data)
                    }else{
                        this.msg = '';
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