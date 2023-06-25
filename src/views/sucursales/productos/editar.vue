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
            <form @submit.prevent="modificarProducto">
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
                        <button type="submit" class="btn btn-makers">Agregar cambios</button>
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
    name: "editarProductoSucursal",
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
        // llamar aquí los método al cargar la página
        this.cargarProductos();
        this.cargar(this.$route.params.detalle);
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
        cargar(detalle) {
            axios.get('http://localhost:3000/api/sucursales/productos/detalle/' + detalle)
                .then(res => {
                    // cargar los valores
                    // const DETALLE = res.data[0];
                    // console.log(DETALLE);
                    this.model.producto = {
                        producto: res.data.id_servicio,
                        cantidad: res.data.cantidad
                    }
                })
                .catch(e => { alert(e) })
        },
        modificarProducto() {
            // obtener el id del detalle
            let id = this.$route.params.detalle;
            // validar datos
            // realizar petición
            axios.put('http://localhost:3000/api/sucursales/productos/' + id, this.model.producto)
                .then(res => {
                    // verificar errores
                    if (res.data.error) {
                        this.msg = 'Error con algún dato enviado'
                    }
                    // verificar sí se realizo la tarea como se deceaba
                    // status = 201 en post y put
                    if (res.status === 201 && !res.data.error) {
                        // limipiar campos
                        this.model.producto = {
                            cantidad: '',
                            producto: 'Seleccionar'
                        }
                        // redireccionar
                        alert('Detalle modificado');
                        this.msg = '';
                        this.$router.push('/sucursales/'+this.$route.params.id+'/productos');
                    }
                })
                .catch(err => { alert(err)})
        }

    }
}

</script>