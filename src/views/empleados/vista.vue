<style>
.card-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
}

.data {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    height: 85%;
    overflow-y: auto;
}

.h-86 {
    height: 86%;
}

.more-info {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: stretch;
}
</style>
<template>
    <div class="container tipos component-servicio">
        <span class="bold">
            Cargos
        </span>
        <router-link to="/empleados/cargos" type="button" class="btn btn-makers">
            Ver
        </router-link>
    </div>

    <div class="container servicios component-servicio h-86">
        <div class="top">
            <span class="bold">Empleados</span>
            <router-link to="/empleados/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>

        <div class="data p-2" v-if="buscador.length > 0">

            <div class="card" v-for="empleado in buscador" :key="empleado.id_empleado">
                <div class="card-body">
                    <div class="row fila">
                        <div class="col-md-4">
                            <h5 class="card-title bold mb-1">{{ empleado.nombres }} {{ empleado.apellidos }}</h5>                            
                            <span class="card-text mb-0 smaller">{{ empleado.correo }}</span>
                            <p class="card-text mb-0 smaller">{{ empleado.dui }} </p>
                            <p class="card-text mb-0 smaller"> {{ empleado.telefono }} </p>
                            <p class="card-text mb-0 smaller"> <span class="bold">$</span>{{ empleado.planilla }} </p>
                        </div>
                        <div class="col-md-6 more-info">
                            <span class="bold card-title">{{ empleado.alias }}</span>
                            <span>{{ empleado.cargo }}</span>
                            <span>{{ empleado.nombre_sucursal }}</span>
                            <span>{{ empleado.horario }}</span>
                        </div>
                        <div class="col-md-2 card-buttons">
                            <div class="buttons">

                                <router-link :to="{ path: '/empleados/editar/' + empleado.id_empleado }">
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


                                <svg @click.prevent="eliminarEmpleado(empleado.id_empleado)" width="40" height="40"
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

        <div class="data p-2" v-else-if="empleados.length === 0">
            <span class="bold">
                No se encontraron existencias
            </span>
        </div>

        <div class="data p-2" v-if="buscador.length === 0 && empleados.length > 0">
            <span class="bold">
                No se encontraron resultados
            </span>
        </div>

    </div>
</template>
<script>
// importar axios para realizar peticiones
import axios from 'axios';


export default {
    name: 'empleados',
    props: { datos: { type: String } },
    data() {
        return {
            // arreglo para guardar los empleados
            empleados: [],
            // arreglo para guardar los datos a buscar
            buscador: [],
            config: {
                headers: {
                    authorization: this.$cookies.get('auth')
                }
            }
        }
    },
    methods: {
        // método para obtener los empleados
        getEmpledos() {
            // hacer petición
            axios.get('http://localhost:3000/api/empleados', this.config)
                .then(res => { this.empleados = res.data; this.buscador = res.data })
                .catch(e => { alert(e) })

        },
        // método para eliminar el empleado seleccionado
        eliminarEmpleado(idempleado) {
            // validar la respuesta del usuario
            if (confirm('Desea eliminar a este empleado?')) {
                // realizar petición                
                axios.delete('http://localhost:3000/api/empleados/' + idempleado)
                    .then(res => {
                        // mostrar mensaje
                        (res.data.error) ? alert(res.data.error) : alert(res.data);
                        // cargar los empleados
                        this.getEmpledos();
                    })
                    .catch(e => { alert(e.response.data.error) })
            }
        },
        buscar(dato) {    
            // constante con los datos filtrados del arreglo con los empleados (en limipios)
            const EMPLEADOS = this.empleados.filter((empleado) => {
                // retornar los datos que pasen la condición
                return (
                    // convertir cada dato de los que se puede buscar en minusculas   
                    // (dato) texto del input
                    empleado.nombres.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.apellidos.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.nombre_sucursal.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.dui.indexOf(dato) !== -1 ||
                    empleado.correo.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.horario.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.planilla.toString().indexOf(dato) !== -1 ||
                    empleado.cargo.toLowerCase().indexOf(dato) !== -1 ||
                    empleado.telefono.indexOf(dato) !== -1
                    // parametros por los que se puede buscar
                )
            })
            // asignar esos datos filtrados al arreglo que se muestran en card
            this.buscador = EMPLEADOS;
        }
    },
    mounted() {
        this.getEmpledos();
    },
    watch: {
        datos(now) {
            // verificar sí el input esta vacío o tiene espacios para mostrar por defecto
            // sino, mostrar el filtrado
            (now.trim() === '') ? this.buscador = this.empleados : this.buscar(now);
        }
    }
}

</script>