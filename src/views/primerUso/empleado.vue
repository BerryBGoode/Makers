<style scoped>
.logo-button {
    /* justify-content: space-around; */
    gap: 0px !important;
}
</style>
<template>
    <section class="flex items-center w-100 h-100">
        <form class="container p-5 login-container" @submit.prevent="registrarPrimerEmpleado">
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" v-model="empleado.nombres" class="form-control" id="nombres" required>
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
                                <input type="text" v-model="empleado.telefono" class="form-control" id="telefono" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" v-model="empleado.correo" class="form-control" id="correo" required>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="planilla" class="form-label">Planilla</label>
                                <input type="text" v-model="empleado.planilla" class="form-control" id="planilla" required>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="alias" class="form-label">Alias</label>
                                <input type="text" v-model="empleado.alias" class="form-control" id="alias" required>
                            </div>

                        </div>

                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="clave" class="form-label">Contraseña</label>
                                <input type="password" v-model="empleado.clave" class="form-control" id="clave" required>
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
                            srcset="../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
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
<script>
import axios from 'axios';
import {
    notificationSuccess, notificationError,
    alertInfo, notificationInfo
} from '../../components/alert.vue';
import { mapState, mapActions } from 'vuex';
import logo from '../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';

export default {
    name: 'empleado',
    components: { logo },
    data() {
        return {
            banner: logo,
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
        }
    },
    methods: {
        ...mapActions(['actionSucursal']),
        setSucursal(state) {
            this.actionSucursal(state)
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
                            // mostrar mensaje de error sí encuentra
                            (res.data.error) ? notificationInfo(res.data.error, 5000, 'Aceptar') : alertInfo(res.data, 'Aceptar', 6500, 'Ahora procedera a iniciar sesión con el empleado creado');
                            // redireccionar al login                            
                            this.$router.push('/login');
                        }).catch(e => {
                            // mostrar mensaje de exception sí encuentra
                            (e.response) ? notificationInfo(e.response, 5000, 'Aceptar') : notificationInfo(e, 5000, 'Aceptar')
                        })
                }

            }

        },
        // método para obtener las sucursales registradas con el objetivo de mostrar el registro de primer empleado o primera sucursal
        verificarSucursales() {
            axios.get('http://localhost:3000/api/auth/verificar/sucursal')
                .then(rows => {
                    // enviar las sucursales encontradas
                    this.setSucursal(rows.data.length)
                }).catch(rej => {
                    console.log(rej);
                })

        },
    },
    computed: {
        ...mapState({
            empleados: state => state.empleados,
            sucursales: state => state.sucursales
        })
    },
    mounted() {
        this.verificarSucursales();
        // mostrar mensaje de proceder a crear primer empleado solo cuando ya exista al menos 1 sucursal y 0 empleados
        if (this.sucursales >= 1 && this.empleados <= 0) {
            alertInfo('Se ha detectado la inexistencia de empleados', 'Aceptar')
        }
        console.log(this.empleados)
        console.log(this.sucursales)
    }
}
</script>