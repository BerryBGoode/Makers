<style>
.data {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    height: 85%;
    overflow-y: auto;
}

.card-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cliente {
    height: 20%;
}

.smaller {
    font-size: smaller;
}

.card {
    background: #393534;
    color: #b4b0af;
}

.buttons {
    gap: 5%;
    display: flex;
    justify-content: center;
}

.fila {
    justify-content: space-between;
}

.button {
    cursor: pointer;
}

.btn-makers-revert {
    background-color: #231F1E;
    color: #fff;
}

.btn-makers-revert:hover {
    background-color: #181615;
}

.buttons-historial {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>

<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <span class="bold">Clientes</span>
            <router-link to="/clientes/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
        <template v-if="!isload">
            <load />
        </template>
        <template v-else>

            <div class="data p-2" v-if="clientes.length > 0">
                <!-- recorrer los clientes encontrados -->

                <div class="card fadeIn" v-for="(cliente, i) in filters" :key="i">
                    <div class="card-body">
                        <div class="row fila">
                            <div class="col-md-4">
                                <h5 class="card-title bold mb-1">{{ cliente.nombres }} {{ cliente.apellidos }}</h5>
                                <span class="card-text mb-0 smaller">{{ cliente.correo }}</span>
                                <p class="card-text mb-0 smaller">{{ cliente.dui }} </p>
                                <p class="card-text mb-0 smaller"> {{ cliente.telefono }} </p>
                            </div>
                            <div class="col-md-1">
                                <span>ordenes: </span>
                                <span class="bold">{{ cliente.consumo }}</span>
                            </div>
                            <div class="col-md-3 buttons-historial">
                                <button class="btn btn-makers-revert"
                                    @click="historialCompras(cliente.id_cliente)">Compras</button>
                                <button class="btn btn-makers-revert"
                                    @click="historialRerservaciones(cliente.id_cliente)">Reservaciones</button>
                            </div>
                            <div class="col-md-2 card-buttons">
                                <div class="buttons">
                                    <router-link :to="{ path: '/clientes/editar/' + cliente.id_cliente }">
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

                                    <svg @click="eliminarCliente(cliente.id_cliente)" width="40" height="40" class="button"
                                        viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
// importar axios para hacer las peticiones
import axios from 'axios';
import { mapState } from 'vuex';
import { generateTablePDF } from '../reports';
import { notificationError, notificationInfo, notificationQuestion, notificationSuccess } from '../../components/alert.vue';
import store from '../../store';
import load from '../../components/load.vue';

// exportando componente
export default {
    name: 'clientes',
    components: { load },
    data() {
        return {
            // arreglo con los clientes
            clientes: [],
            filters: [],
            // propidad para identificar cuando una petición se termino de realizar
            isload: false
        }
    },
    // mounted se llaman los métodos que se quiere ejecutar en el load 
    mounted() {
        this.obtenerClientes();
        this.filters = this.clientes;
    },
    // definir método aquí
    methods: {
        // método para obtener los clientes
        async obtenerClientes() {
            // hacer la petición con promesas
            axios.get('http://localhost:3000/api/clientes/', store.state.config)
                .then(res => {
                    // obtener los datos
                    if (res.status === 200) {
                        this.clientes = res.data;
                        this.filters = res.data
                    }
                    if (res.status === 401) {
                        notificationError(res.data.error)
                    }
                })
                .catch(e => { notificationInfo(e.response.data); })
                .finally(this.isload = true)
        },
        // metodo para eliminar el cliente seleccionado
        async eliminarCliente(idcliente) {
            // esperar confirmación
            if (await notificationQuestion('Desea eliminar a este cliente?', 3000)) {
                axios.delete('http://localhost:3000/api/clientes/' + idcliente, store.state.config)
                    .then(res => {
                        // mostrar notificación
                        notificationSuccess(res.data);
                        // cargar
                        this.obtenerClientes();
                    })
                    .catch(e => {
                        notificationError(e.response.data);
                    })
            }
        },
        buscar(dato) {
            // declarar un objeto que contenga los datos filtrados del arreglo donde estan los clientes
            const CLIENTES = this.clientes.filter((item) => {
                // retornar algo sí el resultado coincide con el valor enviado del watch
                return (
                    item.nombres.toLowerCase().indexOf(dato) !== -1 || item.apellidos.toLowerCase().indexOf(dato) !== -1 ||
                    item.correo.toLowerCase().indexOf(dato) !== -1 || item.dui.toLowerCase().indexOf(dato) !== -1 ||
                    item.telefono.toLowerCase().indexOf(dato) !== -1 || item.consumo.toString().indexOf(dato) !== -1
                );
            });
            // asignar los registros encontrados al arreglo que los muestra
            this.filters = CLIENTES;
        },
        async historialCompras(id) {
            try {
                // realizando la petición sobre las ordenes que tiene el cliente
                const COMPRAS = await axios.get('http://localhost:3000/api/reportes/historialcompras/' + id, store.state.config)
                // sí se realizo con exito que obtenga los datos de la petición
                const ROWS = COMPRAS.data;
                // definiendo los headers para el reporte
                let names = ['Nombres', 'Apellidos', 'Fecha', 'Hora'];
                // extrayendo los datos de la petición
                const VALUES = ROWS.map(row => [row.nombres, row.apellidos, row.fecha, row.hora])
                // creando reporte
                generateTablePDF('compras', 'Historial de compras', names, VALUES);
            } catch (error) {
                notificationError(error.response.data)
            }
        },
        async historialRerservaciones(id) {
            try {
                // realizando la petición sobre las ordenes que tiene el cliente
                const RESERVACIONES = await axios.get('http://localhost:3000/api/reportes/historialreservaciones/' + id, store.state.config)
                // sí se realizo con exito que obtenga los datos de la petición
                const ROWS = RESERVACIONES.data;
                // definiendo los headers para el reporte
                let names = ['Cliente', 'Dui', 'Empleado', 'Dui', 'Fecha', 'Hora'];
                // extrayendo los datos de la petición
                const VALUES = ROWS.map(row => [row.Cliente, row.DuiCliente, row.Empleado, row.DuiEmpleado, row.fecha, row.hora])
                // creando reporte
                generateTablePDF('reservaciones', 'Historial de reservaciones', names, VALUES);
            } catch (error) {
                notificationError(error.response.data)
            }
        }
    },
    watch: {
        // se ejecuta cada ves que cambia un valor de texto en el buscador
        buscador() {
            // obtener los datos enviados del padre para hacer busqueda
            // verificar sí no viene vació para cargar los datos sin filtro 
            //      sí el texto del bucador no tiene nada, cargar los datos normalmente
            //      síno realizar método de busqueda
            (this.buscador.trim() === '') ? this.filters = this.clientes : this.buscar(this.buscador)
        }
    },
    computed: {
        ...mapState({
            buscador: state => state.buscador.toLowerCase()
        })
    }
}

</script>