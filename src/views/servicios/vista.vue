<style>
.tipos {
    background: #231F1E;
    padding: .7% .9%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bold {
    font-weight: bold;
}

.top {
    padding: 1%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.servicios {
    background: #231F1E;
    padding: 0 .5%;
}

.main {
    display: flex;
    flex-direction: column;
    gap: 5%;
}

.component-servicio {
    margin-top: 2.5%;
    border-radius: 7px;
}

.btn-makers {
    background: #393534;
    color: white;
}

.btn-makers:hover {
    background: #504c4a;
}

.btn-makers:active {
    border-color: #b4b0af !important;
    color: #b4b0af !important;
}
</style>
<template>
    <!-- <div class="main"> -->
    <div class="container tipos component-servicio">
        <span class="bold">
            Tipos de servicios
        </span>
        <router-link to="/servicios/tipos" type="button" class="btn btn-makers">
            Ver
        </router-link>
    </div>

    <div class="container servicios component-servicio h-86">
        <div class="top">
            <span class="bold">Servicios</span>
            <router-link to="/servicios/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
        
        <!-- Apartir de aquí verificar sí hay datos o servicios -->
        <div class="data p-2" v-if="servicios.length > 0">
            <!-- recorrer los clientes encontrados -->

            <div class="card" v-for="(servicio, i) in buscador" :key="i">
                <div class="card-body">
                    <div class="row fila">
                        <div class="col-md-5">
                            <h5 class="card-title bold mb-1">{{ servicio.nombre_servicio }}</h5>
                            <span class="card-text mb-0 smaller"> {{ '$ ' + servicio.precio }}</span>
                            <p class="card-text mb-0 smaller">{{ servicio.descripcion }} </p>
                            <!-- <p class="card-text mb-0 smaller"> {{ cliente.telefono }} </p> -->
                        </div>
                        <div class="col-md-4">
                            <span>{{ servicio.tipo_servicio }}</span>
                        </div>
                        <div class="col-md-2 card-buttons">
                            <div class="buttons">
                                <router-link :to="{ path: '/servicios/editar/' + servicio.id_servicio }">
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

                                <svg @click.prevent="eliminarServicio(servicio.id_servicio)" width="40" height="40"
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

                            </div>

                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div class="data p-2" v-else-if="servicios.length === 0">
            <span class="bold">
                No se encontraron existencias
            </span>
        </div>
        <div class="data p-2" v-if="buscador.length === 0 && servicios.length > 0">
            <span class="bold">
                No se encontraron resultados
            </span>
        </div>
    </div>
    <!-- </div> -->
</template>
<script>
import axios from 'axios'
export default {
    name: 'servicios',
    props: { datos: { type: String } },
    data() {
        return {
            servicios: [],
            buscador: []
        }
    },
    methods: {
        getServicios() {
            axios.get('http://localhost:3000/api/servicios/')
                .then(res => {
                    this.servicios = res.data;
                    this.buscador = res.data
                })
                .catch(e => alert(e));
        },
        eliminarServicio(servicio) {
            // verificar sí el usuario lo decea eliminar
            if (confirm('Desea eliminar este servicio?')) {
                // realizar petición
                axios.delete('http://localhost:3000/api/servicios/' + servicio)
                    .then(res => {
                        // verificar errores
                        (res.data.error) ? alert(res.data.error) : alert(res.data);

                        // cargar
                        this.getServicios();
                    })
                    .catch(e => { alert(e); console.log(e) })
            }
        },
        buscar(dato) {
            // crear un arreglo con los datos filtrados
            const SERVICIOS = this.servicios.filter(servicio => {
                // retornar o filtrar los que cumplan la condición
                return (
                    servicio.descripcion.toLowerCase().indexOf(dato) !== -1 ||
                    servicio.nombre_servicio.toLowerCase().indexOf(dato) !== -1 ||
                    servicio.precio.indexOf(dato) !== -1||
                    servicio.tipo_servicio.toLowerCase().indexOf(dato) !== -1
                )
            })
            // asignar al buscador
            this.buscador = SERVICIOS;
        }
    },
    mounted() {
        this.getServicios();
    },
    watch: {
        datos(now) {
            // verificar sí el nuevo valor tiene datos vacios sin incluir espacios, para limpiar buscador
            // o realizar busqueda
            (now.trim() === '') ? this.buscador = this.servicios : this.buscar(now);
        }
    }
}

</script>
