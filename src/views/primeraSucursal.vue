<style scoped>
.logo-button {
    /* justify-content: space-around; */
    gap: 0px !important;
}
</style>
<template>
    <template v-if="sucursales.length <= 0">
        <section class="flex items-center w-100 h-100 ">
            <form class="container p-5 login-container" @submit.prevent="registrarPrimeraSucursal">
                <span class="msg">{{ msg }}</span>
                <div class="col h-100 flex wrap login">
                    <div class="row-6 p-3 w-50 form align-center">
                        <div class="children-form">
                            <div class="mb-3">
                                <label for="direccion" class="form-label">Direccion</label>
                                <input type="text" class="form-control" id="direccion" v-model="sucursal.direccion"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
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
                                    <input type="time" v-model="sucursal.cierre" id="cierre" class="form-control w-45"
                                        required>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row-6 p-3 w-50 logo-button func">
                        <div class="img-fun align-center">
                            <img :src="banner" alt="Logo"
                                srcset="../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
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
    <template v-else>
        <section class="flex items-center w-100 h-100">
            <form class="container p-5 login-container">
                <span class="msg">{{ msg }}</span>
                <div class="col h-100 flex wrap login">
                    <div class="row-6 p-3 w-50 form align-center">
                        <div class="children-form">
                            <div class="load">
                                <div class="mb-3 input-container">
                                    <label for="nombres" class="form-label">Nombres</label>
                                    <input type="text" v-model="empleado.nombres" class="form-control" id="nombres"
                                        required>
                                </div>
                                <div class="mb-3 input-container">
                                    <label for="apellidos" class="form-label">Apellidos</label>
                                    <input type="text" v-model="empleado.apellidos" class="form-control" id="apellidos"
                                        required>
                                </div>
                            </div>

                            <div class="load">
                                <div class="mb-3 input-container">
                                    <label for="dui" class="form-label">DUI</label>
                                    <input type="text" v-model="empleado.dui" class="form-control" id="dui" required>
                                </div>
                                <div class="mb-3 input-container">
                                    <label for="correo" class="form-label">Correo</label>
                                    <input type="email" v-model="empleado.correo" class="form-control" id="correo" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" v-model="empleado.telefono" class="form-control" id="telefono" required>
                            </div>

                        </div>
                    </div>
                    <div class="row-6 p-3 w-50 logo-button func">
                        <div class="img-fun align-center">
                            <img :src="banner"
                                srcset="../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
                                alt="Logo" draggable="false">
                        </div>

                        <div class="buttons-login">
                            <button type="submit" class="btn btn-makers w-100 bold">Registrar</button>
                        </div>
                    </div>
                </div>

            </form>
        </section>
    </template>
</template>
<script>
import axios from 'axios';
import {
    notificationSuccess, notificationError,
    alertInfo
} from '../components/alert.vue';
import logo from '../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';


export default {
    components: { logo },
    data() {
        return {
            msg: '',
            banner: logo,
            empleados: [],
            sucursales: [],
            sucursal: {
                nombre: '',
                direccion: '',
                tel: '',
                inicio: '',
                cierre: ''
            },
            cargo: {
                cargo: '',
            },
            empleado: {
                nombres: '',
                apellidos: '',
                dui: '',
                correo: '',
                telefono: ''
            }
        }
    },
    methods: {
        // mét-odo para los empleados sí hay empleados registrados con el objetivo de mostrar el registro de primer empleado o primera sucursal
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificar/empleados')
                .then((rows) => {
                    this.empleados = rows.data;

                    (this.sucursales.length <= 0) ? alertInfo('Se ha detectado la inexistencia de empleados y sucursales', 'Aceptar')
                        : alertInfo('Se ha detectado la inexistencia de empleados', 'Aceptar')
                }).catch(e => {
                    notificationError(e.reponse.data.error, 7000);
                })
        },
        // método para obtener las sucursales registradas con el objetivo de mostrar el registro de primer empleado o primera sucursal
        verificarSucursales() {
            axios.get('http://localhost:3000/api/auth/verificar/sucursal')
                .then(rows => {
                    // guardar las sucursales encontradas
                    this.sucursales = rows.data;
                }).catch(rej => {
                    console.log(rej);
                })

        },
        registrarPrimeraSucursal() {

            // validar que la hora tenga lógica
            if (this.sucursal.inicio > this.sucursal.cierre) {
                this.msg = 'Horario ilogico'
            }
            // validando datos vacios
            else if (this.sucursal.direccion && this.sucursal.tel && this.sucursal.nombre &&
                this.sucursal.inicio && this.sucursal.cierre) {
                // realizar petición
                axios.post('http://localhost:3000/api/sucursales/', this.sucursal)
                    .then(res => {
                        // verificar sí la api manda un error al realizar la inserción
                        if (res.data.error) {
                            // para mostrar el cliente el error 
                            notificationError(res.data.error, 7000)
                        } else {
                            // notificar el proceso exitoso
                            notificationSuccess(res.data, 7000, 'Aceptar');
                            // las siguientes 2 líneas, realiza el método para crear el cargo 
                            // registro de cargo a la entidad respectiva
                            this.registrarCargo(this.cargo)
                            // y el nuevo registro de horarioa la respectiva entidad
                            this.registrarHorario(this.sucursal.inicio, this.sucursal.cierre)
                            // verificar otra vez sí existen sucursales
                            this.verificarSucursales();
                            // verificar sí hay empleados registrados
                            this.verficarEmpleados();
                        }

                    })
            }
            else this.msg = 'No se permiten campos vacíos'

        },
        registrarCargo(cargo) {
            axios.post('http://localhost:3000/api/cargos', cargo)
                .then(res => {
                    if (res.data.error) this.msg = res.data.error;
                    else { this.msg = '' }
                })
                .catch(e => {
                    notificationError(e.response.data.error);
                })
        },
        registrarHorario(inicio, cierre) {
            // verificar que el horario de inicio sea menor al de cierre y que ambos tengan algún valor
            if (inicio < cierre && (inicio && cierre)) {
                let horario = {
                    inicio: inicio,
                    cierre: cierre
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
                            this.msg = '';

                        }
                    })
                    .catch(e => { notificationError(e); console.log(e) });

            } else {
                this.msg = 'Horario ilogico';
            }
        }

    },
    mounted() {
        this.verificarSucursales();
        this.verficarEmpleados();

    }
}
</script>