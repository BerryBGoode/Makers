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
            <form class="container p-5 login-container" @submit.prevent="registrarPrimerEmpleado">
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
                                    <label for="telefono" class="form-label">Teléfono</label>
                                    <input type="text" v-model="empleado.telefono" class="form-control" id="telefono"
                                        required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" v-model="empleado.correo" class="form-control" id="correo" required>
                            </div>
                            <div class="load">
                                <div class="mb-3 input-container">
                                    <label for="planilla" class="form-label">Planilla</label>
                                    <input type="text" v-model="empleado.planilla" class="form-control" id="planilla"
                                        required>
                                </div>
                                <div class="mb-3 input-container">
                                    <label for="alias" class="form-label">Alias</label>
                                    <input type="text" v-model="empleado.alias" class="form-control" id="alias" required>
                                </div>

                            </div>

                            <div class="load">
                                <div class="mb-3 input-container">
                                    <label for="clave" class="form-label">Contraseña</label>
                                    <input type="password" v-model="empleado.clave" class="form-control" id="clave"
                                        required>
                                </div>
                                <div class="mb-3 input-container">
                                    <label for="confirmar" class="form-label">Confirmar contraseña *</label>
                                    <input type="password" v-model="empleado.confirmar" class="form-control" id="confirmar"
                                        required>
                                </div>

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
    alertInfo, notificationInfo
} from '../components/alert.vue';
import { mapActions } from 'vuex';
import logo from '../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';


export default {
    components: { logo },
    data() {
        return {
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
                telefono: '',
                alias: '',
                clave: '',
                confirmar: '',
                planilla: ''
            },
            f_empleado: 0,
        }
    },
    methods: {
        ...mapActions(['actionEmpleado']),
        nuevoEstadoEmpleado(estado) {
            this.actionEmpleado(estado)
        },

        // método para los empleados sí hay empleados registrados con el objetivo de mostrar el registro de primer empleado o primera sucursal
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificar/empleados')
                .then((rows) => {
                    // asignar los empleados encontrados a un arreglo para validar sí existen empleados
                    this.empleados = rows.data;
                    // verificar sí no existen sucursales registradas
                    if (this.sucursales.length <= 0) { alertInfo('Se ha detectado la inexistencia de empleados y sucursales', 'Aceptar'); }
                    // sino, verificar sí no existen empleados registrados
                    else if (this.empleados.length <= 0) { alertInfo('Se ha detectado la inexistencia de empleados', 'Aceptar'); }
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
            /** 
             * TODO: Validar que el horario sea lógico
             * */
            if (this.sucursal.inicio > this.sucursal.cierre) {
                notificationInfo('Horario ilogico', 5000, 'Aceptar')
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
                            notificationSuccess(res.data, 3500, 'Aceptar');
                            // las siguientes 2 líneas, realiza el método para crear el cargo 
                            // registro de cargo a la entidad respectiva
                            this.registrarCargo(this.cargo)
                            // y el nuevo registro de horarioa la respectiva entidad
                            this.registrarHorario(this.sucursal.inicio, this.sucursal.cierre)
                            // verificar otra vez sí existen sucursales
                            this.verificarSucursales();
                            // verificar sí hay empleados registrados después de 5500 mls para poder leer mensaje
                            setTimeout(() => {
                                this.verficarEmpleados()
                            }, 2500)
                        }

                    })
            }
            else notificationInfo('No se permiten campos vacíos', 7500, 'Aceptar')

        },
        // método para agrega primer cargo
        registrarCargo(cargo) {
            axios.post('http://localhost:3000/api/cargos', cargo)
                .then(res => {
                    if (res.data.error) notificationInfo(res.data.error, 5000, 'Aceptar');
                })
                .catch(e => {
                    notificationError(e.response.data.error);
                })
        },
        // método para agrega primer horario
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

                        }
                    })
                    .catch(e => { notificationError(e); console.log(e) });

            } else {
                notificationInfo('Horario ilogico', 5000, 'Aceptar');
            }
        },
        // método para obtener datos dependientes antes de hacer el registro
        async registrarPrimerEmpleado() {
            // validar datos                
            if (this.empleado.clave !== this.empleado.confirmar) { notificationInfo('Las constraseñas no coinciden', 5000, 'Aceptar'); }
            else if (!this.empleado.alias && !this.empleado.apellidos && !this.empleado.clave,
                !this.empleado.clave && !this.empleado.confirmar &&
                !this.empleado.correo && !this.empleado.dui,
                !this.empleado.nombres && !this.empleado.telefono) { notificationInfo('No se permiten campos vacíos', 5000, 'Aceptar'); }
            else {
                // obtener los id necesarios para registrar a un empleado
                let datos = await axios.get('http://localhost:3000/api/auth/get/primerempleado')
                // verificar sí se obtuvieron los datos necesarios
                if (datos) {
                    // fusionar con el objeto con los datos del empleado
                    this.empleado = Object.assign(this.empleado, datos.data)
                    // enviar registro al servidor
                    axios.post('http://localhost:3000/api/empleados', Object.assign(this.empleado, datos.data))
                        .then((res) => {
                            // redireccionar al login
                            // por medio del envio o cambio de valor de un estado global para 
                            // detectar el cambio en el componente principal y así volver a verificar
                            // la cantidad de sucursales y empleados
                            this.f_empleado = 1;
                            // mostrar mensaje de error sí encuentra
                            (res.data.error) ? notificationInfo(res.data.error, 5000, 'Aceptar') : alertInfo(res.data, 'Aceptar', 6500, 'Ahora procedera a iniciar sesión con el empleado creado');
                        }).catch(e => {
                            // mostrar mensaje de exception sí encuentra
                            (e.response) ? notificationInfo(e.response, 5000, 'Aceptar') : notificationInfo(e, 5000, 'Aceptar')
                        })
                }

            }

        }
    },
    mounted() {
        this.verificarSucursales();
        this.verficarEmpleados();

    },
    watch: {
        f_empleado(now) {
            this.nuevoEstadoEmpleado(now);
        }
    }
}
</script>