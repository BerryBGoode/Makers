<!-- scoped significa q solo se aplicará a este componente -->
<style scoped>
.data {
    gap: 5px;
}
</style>
<template>
    <!-- <div class="main"> -->
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <span class="bold">Productos</span>
            <router-link to="/productos/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>

        <template v-if="!isload">
            <load />
        </template>
        <template v-else>
            <div class="data p-2" v-if="productos.length > 0">
                <!-- recorrer los clientes encontrados -->

                <div class="card fadeIn " v-for="(producto, i) in filters" :key="i">
                    <div class="card-body">
                        <div class="row fila">
                            <div class="col-md-3">
                                <h5 class="card-title bold mb-1">{{ producto.nombre_servicio }}</h5>
                                <span class="card-text mb-0 smaller">{{ '$ ' + producto.precio }}</span>
                                <p class="card-text mb-0 smaller">{{ producto.descripcion }} </p>
                            </div>
                            <div class="col-md-1 img">
                                <img :src="path + producto.img" class="img-producto" />
                            </div>
                            <div class="col-md-3 existencias">
                                <span>Existencias: </span>
                                <span class="bold">
                                    {{ producto.existencias }}
                                </span>
                            </div>
                            <div class="col-md-2 card-buttons">
                                <div class="buttons">
                                    <router-link :to="{ path: '/productos/editar/' + producto.id_servicio }">
                                        <svg width="40" height="40" class="button" viewBox="0 0 40 40" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15 36.6673H25C33.3333 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3333 3.33398 25 3.33398H15C6.66668 3.33398 3.33334 6.66732 3.33334 15.0007V25.0007C3.33334 33.334 6.66668 36.6673 15 36.6673Z"
                                                stroke="white" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M22.0571 10.0869L10.3944 22.2482C9.95039 22.7112 9.50638 23.6217 9.41757 24.2854L8.78116 28.9307C8.54435 30.6129 9.68398 31.7859 11.2972 31.5544L15.7521 30.8907C16.3738 30.7981 17.247 30.3351 17.7058 29.8722L29.3685 17.7109C31.3814 15.612 32.3286 13.1735 29.3685 10.0869C26.4084 7.00028 24.07 7.988 22.0571 10.0869Z"
                                                stroke="white" stroke-width="2" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M20.3847 11.8301C21.3763 15.5186 24.144 18.4046 27.6961 19.454"
                                                stroke="white" stroke-width="2" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </router-link>

                                    <svg @click.prevent="eliminarProducto(producto.id_servicio, producto.img)" width="40"
                                        height="40" class="button" viewBox="0 0 40 40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 36.6673H25C33.3333 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3333 3.33398 25 3.33398H15C6.66668 3.33398 3.33334 6.66732 3.33334 15.0007V25.0007C3.33334 33.334 6.66668 36.6673 15 36.6673Z"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M30.6667 12.7758C26.72 12.3798 22.7496 12.1758 18.7911 12.1758C16.4445 12.1758 14.0978 12.2958 11.7511 12.5358L9.33334 12.7758"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M15.8519 11.564L16.1126 9.992C16.3022 8.852 16.4445 8 18.4474 8H21.5526C23.5556 8 23.7096 8.9 23.8874 10.004L24.1482 11.564"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M28.1185 16.5684L27.3481 28.6523C27.2177 30.5363 27.1111 32.0003 23.8044 32.0003H16.1955C12.8889 32.0003 12.7822 30.5363 12.6518 28.6523L11.8815 16.5684"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="data p-2" v-else-if="productos.length === 0">
                <span class="bold">
                    No se encontraron existencias
                </span>
            </div>
            <div class="data p-2" v-if="filters.length === 0 && productos.length > 0">
                <span class="bold">
                    No se encontraron resultados
                </span>
            </div>
        </template>
    </div>
    <!-- </div> -->
</template>
<script>
import axios from 'axios';
import { mapState } from 'vuex';
import store from '../../store';
import { notificationError, notificationQuestion, notificationSuccess } from '../../components/alert.vue';
import load from '../../components/load.vue';

export default {
    name: 'productos',
    components: { load },
    data() {
        return {
            // arreglo vacío para guardar datos
            productos: [],
            filters: [],
            // propiedad para determinar sí la petición se termino de realizar
            isload: false,
            path: 'http://localhost:3000/'
        }
    },
    methods: {
        unlinkImg(img) {
            if (img != 0) {
                // instanciando clase para empaquetar imagen
                let form = new FormData();
                // empaquetando imagen juntos con su nombre para guardarla en la api
                form.append('productoimg', img)
                axios.delete('http://localhost:3000/api/upload/imgproducto/' + img)
                    .then(res => { console.log(res) })
                    .catch(rej => { console.log(rej) })
            }
        },
        // método para obtener los productos
        getProductos() {
            // realizar petición
            axios.get('http://localhost:3000/api/productos/', store.state.config)
                .then(res => {
                    this.productos = res.data;
                    this.filters = res.data;
                })
                .catch(e => notificationError(e.response.data))
                .finally(() => { this.isload = true });
        },
        async eliminarProducto(producto, img) {

            // esperar confirmación
            if (await notificationQuestion('Desea eliminar este producto?', 7500)) {
                // realizar petición
                axios.delete('http://localhost:3000/api/productos/' + producto, store.state.config)
                    .then(res => {
                        notificationSuccess(res.data);
                        // eliminando imagen
                        this.unlinkImg(img);

                        // cargar
                        this.getProductos();
                    })
                    .catch(e => { notificationError(e.response.data) })
            }
        },
        buscar(dato) {
            // constante donde se guardan los productos filtrados
            const PRODUCTOS = this.productos.filter(producto => {
                // retornar los que cumplan la condición

                return (
                    producto.descripcion.toLowerCase().indexOf(dato) !== -1 ||
                    // this.productos.existencias.indexOf(dato) !== -1 ||
                    producto.existencias.toString().indexOf(dato) !== -1 ||
                    producto.nombre_servicio.toLowerCase().indexOf(dato) !== -1 ||
                    producto.precio.indexOf(dato) !== -1
                )
            })
            // asignar a los datos que se muestran, los filtrados
            this.filters = PRODUCTOS;
        }
    },
    mounted() {
        this.getProductos();
    },
    watch: {
        buscador() {
            // verificar sí actualmente el componente se encontra con texto ignorando los espacios vacíos
            (this.buscador.trim() === '') ? this.filters = this.productos : this.buscar(this.buscador);
        }
    },
    computed: {
        ...mapState({
            buscador: state => state.buscador.toLowerCase()
        })
    }
}

</script>