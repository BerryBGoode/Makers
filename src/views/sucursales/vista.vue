<style scoped>
.more-info {
    justify-content: center;
}

.btn-table {
    background: #231F1E;
}
</style>
<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <span class="bold">Sucursales</span>
            <router-link to="/sucursales/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>

        <div class="data p-2" v-if="sucursales.length > 0">
            <!-- recorrer los clientes encontrados -->

            <div class="card" v-for="(sucursal, i) in filters" :key="i">
                <div class="card-body">
                    <div class="row fila">
                        <div class="col-md-8">
                            <h5 class="card-title bold mb-1">{{ sucursal.nombre_sucursal }}</h5>
                            <p class="card-text mb-0 smaller"> {{ sucursal.direccion }} </p>
                            <span class="card-text mb-0 smaller">{{ sucursal.inicio }} - {{ sucursal.cierre }}</span>
                            <p class="card-text mb-0 smaller">{{ sucursal.telefono }} </p>
                            <p class="card-text mb-0 smaller"> {{ sucursal.nit }} </p>
                        </div>
                        <div class="col-md-1 more-info">

                            <router-link class="btn btn-makers btn-table"
                                :to="{ path: '/sucursales/' + sucursal.id_sucursal + '/productos' }">
                                Servicios
                            </router-link>
                        </div>
                        <div class="col-md-2 card-buttons">
                            <div class="buttons">

                                <router-link :to="{ path: '/sucursales/editar/' + sucursal.id_sucursal }">
                                    <svg width="40" height="40" class="button" viewBox="0 0 40 40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15 36.6673H25C33.3333 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3333 3.33398 25 3.33398H15C6.66668 3.33398 3.33334 6.66732 3.33334 15.0007V25.0007C3.33334 33.334 6.66668 36.6673 15 36.6673Z"
                                            stroke="white" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path
                                            d="M22.0571 10.0869L10.3944 22.2482C9.95039 22.7112 9.50638 23.6217 9.41757 24.2854L8.78116 28.9307C8.54435 30.6129 9.68398 31.7859 11.2972 31.5544L15.7521 30.8907C16.3738 30.7981 17.247 30.3351 17.7058 29.8722L29.3685 17.7109C31.3814 15.612 32.3286 13.1735 29.3685 10.0869C26.4084 7.00028 24.07 7.988 22.0571 10.0869Z"
                                            stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                        <path d="M20.3847 11.8301C21.3763 15.5186 24.144 18.4046 27.6961 19.454"
                                            stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </svg>
                                </router-link>


                                <svg @click.prevent="eliminarSucursal(sucursal.id_sucursal)" width="40" height="40"
                                    class="button" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15 36.6673H25C33.3333 36.6673 36.6667 33.334 36.6667 25.0007V15.0007C36.6667 6.66732 33.3333 3.33398 25 3.33398H15C6.66668 3.33398 3.33334 6.66732 3.33334 15.0007V25.0007C3.33334 33.334 6.66668 36.6673 15 36.6673Z"
                                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M30.6667 12.7758C26.72 12.3798 22.7496 12.1758 18.7911 12.1758C16.4445 12.1758 14.0978 12.2958 11.7511 12.5358L9.33334 12.7758"
                                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M15.8519 11.564L16.1126 9.992C16.3022 8.852 16.4445 8 18.4474 8H21.5526C23.5556 8 23.7096 8.9 23.8874 10.004L24.1482 11.564"
                                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path
                                        d="M28.1185 16.5684L27.3481 28.6523C27.2177 30.5363 27.1111 32.0003 23.8044 32.0003H16.1955C12.8889 32.0003 12.7822 30.5363 12.6518 28.6523L11.8815 16.5684"
                                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                <div class="container-graph">
                                    <button @click.prevent="ProducSucursales(sucursal.id_sucursal)">Generar pdf</button>    
                                </div>

                            </div> 

                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div class="data p-2" v-else-if="sucursales.length === 0">
            <span class="bold">
                No se encontraron existencias
            </span>
        </div>
        <div class="data p-2" v-if="filters.length === 0 && sucursales.length > 0">
            <span class="bold">
                No se encontraron resultados
            </span>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { mapState } from 'vuex';
// componente para vista
export default {
    name: 'reservaciones',
    data() {
        return {
            // para cargar las sucursales
            sucursales: [],
            filters: []
        }
    },
    methods: {
        // método para cargar las 
        getSucursales() {
            axios.get('http://localhost:3000/api/sucursales/')
                .then(res => {
                    this.sucursales = res.data;
                    this.filters = res.data;
                })
                .catch(e => { alert(e); console.log(e) })
        },
        eliminarSucursal(sucursal) {
            // esperar confirmación
            if (confirm('Desea eliminar esta sucursal?')) {
                axios.delete('http://localhost:3000/api/sucursales/' + sucursal)
                    .then(res => {
                        // verificar errores
                        (res.data.error) ? alert(res.data.error) : alert(res.data);
                        // cargar
                        this.getSucursales();
                    })
                    .catch(e => {
                        alert(e);
                        console.log(e)
                    })
            }
        },
        buscar(dato) {
            const SUCURSALES = this.sucursales.filter(sucursal => {
                return (
                    sucursal.direccion.toLowerCase().indexOf(dato) !== -1 ||
                    sucursal.cierre.indexOf(dato) !== -1 ||
                    sucursal.inicio.indexOf(dato) !== -1 ||
                    sucursal.telefono.indexOf(dato) !== -1 ||
                    sucursal.nombre_sucursal.toLowerCase().indexOf(dato) !== -1
                )
            })
            this.filters = SUCURSALES;
        },
        async ProducSucursales() {
            // realizar petición según el reporte
            try {
                // llamar la función asicrona para obtener los datos de la petición
                const PRODUCTOS = await axios.get('http://localhost:3000/api/reportes/prodsucursal');
                // obtener la 'data' de la función asicrona
                const ROWS = PRODUCTOS.data;
                // declarando datos para poner en el header de la tabla
                const colNames = ['Nombre sucursal', 'Nombre producto', 'Cantidad'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.nombre_sucursal, row.nombre_servicio, row.cantidad]);
                // llamando al método para generar reportes
                generateTablePDF('ProducSucursales', 'Porductos por sucursales', colNames, colData)

            } catch (e) {
                alert(e.response.data.error)
            }
        }
    },
    mounted() {
        this.getSucursales();
    },
    watch: {
        buscador() {
            // verificar si el filters tiene datos vacíos
            // o tiene datos a buscar
            (this.buscador.trim() === '') ? this.filters = this.sucursales : this.buscar(this.buscador)
        }
    },
    computed: {
        ...mapState({
            buscador: state => state.buscador.toLowerCase()
        })
    }
}

</script>