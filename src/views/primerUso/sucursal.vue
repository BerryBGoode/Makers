<style scoped>
.logo-button {
    /* justify-content: space-around; */
    gap: 0px !important;
}
</style>
<template>
    <section class="flex items-center w-100 h-100 ">
        <form class="container p-5 login-container" @submit.prevent="registrarPrimeraSucursal">
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="direccion" class="form-label">Direccion</label>
                            <input type="text" class="form-control" id="direccion" v-model="sucursal.direccion" required>
                        </div>
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre de sucursal</label>
                            <input type="text" class="form-control" id="nombre" v-model="sucursal.nombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="telefono" class="form-label">Telefono</label>
                            <input type="text" class="form-control" id="telefono" v-model="sucursal.tel" required>
                        </div>
                        <div class="mb-3">
                            <label for="cargo" class="form-label">Cargo principal</label>
                            <input type="text" class="form-control" id="cargo" v-model="cargo.cargo" required>
                        </div>
                        <div class="mb-3">
                            <label for="hora" class="form-label">Horario</label>
                            <div class="load">
                                <input type="time" v-model="sucursal.inicio" id="apertura" class="form-control w-45"
                                    required>
                                <input type="time" v-model="sucursal.cierre" id="cierre" class="form-control w-45" required>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 logo-button func">
                    <div class="img-fun align-center">
                        <img :src="banner" alt="Logo"
                            srcset="../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
                            draggable="false">
                    </div>

                    <div class="buttons-login">
                        <button type="submit" class="btn btn-makers w-100 bold">Registrar</button>
                    </div>
                </div>
            </div>
        </form>
    </section>
</template>
<script>
import axios from 'axios';
import {
    notificationSuccess, notificationError,
    alertInfo, notificationInfo
} from '../../components/alert.vue';
import { mapActions, mapState } from 'vuex';
import logo from '../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';

export default {
    name: 'sucursal',
    components: { logo },
    data() {
        return {
            banner: logo,
            // sucursales: [],
            sucursal: {
                nombre: '',
                direccion: '',
                tel: '',
                inicio: '',
                cierre: '',
                path: this.$route.path
            },
            cargo: {
                cargo: '',
            },
        }
    },
    methods: {
        ...mapActions(['actionEmpleado']),
        ...mapActions(['actionSucursal']),
        setSucursal(state) {
            this.actionSucursal(state)
        },
        setEmpleado(state) {
            this.actionEmpleado(state)
        },
        registrarPrimeraSucursal() {
            // validando campos vacíos
            if (!this.sucursal.cierre || !this.sucursal.direccion || !this.sucursal.inicio ||
                !this.sucursal.nombre || !this.sucursal.tel) {
                notificationError('No se permiten campos vacíos', 5000, 'Aceptar');
            }
            // validar que la hora tenga lógica            
            else if (this.sucursal.inicio >= this.sucursal.cierre) {
                notificationError('Horario ilogico', 5000, 'Aceptar')
            }
            else {
                // realizar petición
                axios.post('http://localhost:3000/api/sucursales/', this.sucursal)
                    .then(res => {
                        // verificar sí la api manda un error al realizar la inserción
                        if (res.data.error) {
                            // para mostrar el cliente el error 
                            notificationError(res.data.error, 7000)
                        } else {
                            // las siguientes 2 líneas, realiza el método para crear el cargo 
                            // registro de cargo a la entidad respectiva
                            this.registrarCargo(Object.assign(this.cargo, this.sucursal))
                            // y el nuevo registro de horarioa la respectiva entidad
                            this.registrarHorario(this.sucursal.inicio, this.sucursal.cierre, this.sucursal.path)
                            // notificar el proceso exitoso
                            notificationSuccess(res.data, 2000, 'Aceptar');
                            // agregar al estado general 1 sucursal para poder acceder a la de primer empleado
                            this.setSucursal(1);
                            // agregar una sucursal al estado general  \
                            setTimeout(() => {
                                this.$router.push('/primer/empleado')
                            }, 1500)

                        }

                    })
            }
        },
        // método para agrega primer horario
        registrarHorario(inicio, cierre, path) {
            // verificar que el horario de inicio sea menor al de cierre y que ambos tengan algún valor
            if (inicio < cierre && (inicio && cierre)) {
                let horario = {
                    inicio: inicio,
                    cierre: cierre,
                    path: path
                }
                // realizar petición
                axios.post('http://localhost:3000/api/horarios/', horario)
                    .then(res => {
                        // verificar síno hay errores
                        if (!res.data.error) {
                            this.sucursal = {
                                inicio: '',
                                cierre: '',
                            }

                        }
                    })
                    .catch(e => { notificationError(e.response.data); console.log(e) });

            } else {
                notificationInfo('Horario ilogico', 5000, 'Aceptar');
            }
        },
        // método para agrega primer cargo
        registrarCargo(cargo) {
            axios.post('http://localhost:3000/api/cargos', cargo)
                .then(res => {
                    // verificar síno hay errores
                    if (!res.data.error) {
                        this.cargo = {
                            cargo: ''
                        }

                    }
                })
                .catch(e => {
                    notificationError(e.response.data);
                })
        },
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificar/empleados')
                .then((rows) => {
                    // obtiendo los valores de la petición
                    this.empleados = rows.data;
                    // setteando la cantidad de empleados que existen
                    this.setEmpleado(this.empleados.length);
                    // verificando la existencia de los empleados, para redireccionara primer empleados, 
                    // sino verificar sí hay autenticación para así o redireccionar al login o a inicio
                    if (this.empleados.length <= 0) {
                        this.$router.push('/primer/empleado')
                    } else {
                        if (!localStorage.getItem('auth')) {
                            this.$router.push('/login')
                        }
                    }
                }).catch(e => {
                    notificationError(e, 7000);
                })
        }
    },
    computed: {
        ...mapState({
            sucursales: state => state.sucursales,
        })
    },
    mounted() {
        // verificar la cantidad de sucursales para mostrar o no el mensaje
        if (this.sucursales <= 0) {
            // mostrar alerta sobre lo que ocurré en el sistema
            alertInfo('Se ha detectado la inexistencia de empleados y sucursales', 'Aceptar')
        }
    }
}
</script>