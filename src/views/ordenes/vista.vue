<style>
.more-info {
    justify-content: center;
}

.btn-table {
    background: #231F1E;
}

.data {
    gap: 5px !important;
}
</style>
<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <span class="bold">Ordenes</span>
            <router-link to="/ordenes/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
        <template v-if="!load">
            <load />
        </template>
        <template v-else>
            <div class="data p-2" v-if="ordenes.length > 0">
                <div class="card fadeIn" v-for="(orden, i) in filters" :key="i">
                    <div class="card-body">
                        <div class="row fila">
                            <div class="col-md-5">
                                <h5 class="card-title bold mb-1">{{ orden.nombres }} {{ orden.apellidos }}</h5>
                                <span class="card-text mb-0 smaller">{{ orden.dui }}</span>
                            </div>
                            <div class="col-md-3">
                                <span>{{ orden.fecha }}</span>
                            </div>
                            <div class="col-md-1 more-info">

                                <router-link class="btn btn-makers btn-table"
                                    :to="{ path: '/ordenes/' + orden.id_orden + '/detalles/' }">

                                    Pedidos
                                </router-link>

                            </div>
                            <div class="col-md-1 more-info">

                                <!-- editar -->
                                <div v-if="orden.factura">
                                    <router-link class="btn btn-makers btn-table"
                                        :to="{ path: '/ordenes/' + orden.id_orden + '/factura/editar/' + orden.factura }">
                                        Factura
                                    </router-link>
                                </div>
                                <!-- crear -->
                                <div v-else>
                                    <router-link class="btn btn-makers btn-table"
                                        :to="{ path: '/ordenes/' + orden.id_orden + '/factura/crear' }">
                                        Crear
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-md-2 card-buttons">
                                <div class="buttons">
                                    <router-link :to="{ path: '/ordenes/editar/' + orden.id_orden }">
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

                                    <svg @click.prevent="eliminarOrden(orden.id_orden)" width="40" height="40"
                                        class="button" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </template>

    </div>
</template>
<script>
import axios from 'axios'
import { mapState } from 'vuex'
import store from '../../store'
import { notificationError, notificationQuestion, notificationSuccess } from '../../components/alert.vue'
import load from '../../components/load.vue'


export default {
    name: 'ordenes',
    data() {
        return {
            ordenes: [],
            filters: [],
            load: false
        }
    },
    components: { load },
    methods: {
        // metodo para cargar las ordenes
        getOrdenes() {
            axios.get('http://localhost:3000/api/ordenes/', store.state.config)
                .then(res => {
                    this.ordenes = res.data;
                    this.filters = res.data;
                })
                .catch(e => notificationError(e.response.data))
                .finally(() => this.load = true)
        },
        async eliminarOrden(orden) {
            if (await notificationQuestion('Desea eliminar esta orden?', 7500)) {
                axios.delete('http://localhost:3000/api/ordenes/' + orden, store.state.config)
                    .then(res => {
                        notificationSuccess(res.data);
                        // cargar
                        this.getOrdenes();
                    })
                    .catch(e => {
                        notificationSuccess(e.response.data)
                    })
            }
        },
        buscar(dato) {
            // crear constante que va ahacer igual a los datos en limpio filtrados según los especificado
            const ORDENES = this.ordenes.filter((orden) => {
                return (
                    // retornar los que cumplan la condición de que cualquier caracter similiar
                    // con la cadena de texto
                    orden.nombres.toLowerCase().indexOf(dato) !== -1 ||
                    orden.apellidos.toLowerCase().indexOf(dato) !== -1 ||
                    orden.dui.indexOf(dato) !== -1 || orden.fecha.indexOf(dato) !== -1
                )
            })
            // asignar al arreglo
            this.filters = ORDENES;
        }

    },
    mounted() {
        this.getOrdenes();
    },
    watch: {
        buscador() {
            // verificar sí el filters esta vacío 
            (this.buscador.trim() === '') ? this.filters = this.ordenes : this.buscar(this.buscador);
        }
    },
    computed: {
        ...mapState({
            buscador: state => state.buscador.toLowerCase()
        })
    }

}

</script>