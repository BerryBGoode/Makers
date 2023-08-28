<style scoped>
.logo-button {
    /* justify-content: space-around; */
    gap: 0px !important;
}
</style>
<template>
    <template v-if="empleados.length <= 0">
        <section class="flex items-center w-100 h-100 ">
            <form class="container p-5 login-container">
                <span class="msg">{{ msg }}</span>
                <div class="col h-100 flex wrap login">
                    <div class="row-6 p-3 w-50 form align-center">
                        <div class="children-form">
                            <div class="mb-3">
                                <label for="direccion" class="form-label">Direccion</label>
                                <input type="text" class="form-control" id="direccion" required>
                            </div>
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Telefono</label>
                                <input type="text" class="form-control" id="telefono" required>
                            </div>
                            <div class="mb-3">
                                <label for="cargo" class="form-label">Cargo principal</label>
                                <input type="text" class="form-control" id="cargo" required>
                            </div>
                            <div class="mb-3">
                                <label for="hora" class="form-label">Horario</label>
                                <div class="load">
                                    <input type="time" name="" id="apertura" class="form-control w-45" required>
                                    <input type="time" name="" id="cierre" class="form-control w-45" required>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row-6 p-3 w-50 logo-button func">
                        <div class="img-fun align-center">
                            <img :src="banner" alt="Logo"
                                srcset="./assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
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
                            <div class="mb-3">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" class="form-control" id="nombres" required>
                            </div>
                            <div class="mb-3">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" required>
                            </div>


                            <div class="mb-3">
                                <label for="dui" class="form-label">DUI</label>
                                <input type="text" class="form-control" id="dui" required>
                            </div>
                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" required>
                            </div>

                        </div>
                    </div>
                    <div class="row-6 p-3 w-50 logo-button func">
                        <div class="img-fun align-center">
                            <img :src="banner" alt="Logo"
                                srcset="./assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png"
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
</template>
<script>
import axios from 'axios';
import {
    notificationSuccess, notificationError,
    alertInfo
} from './components/alert.vue';
import logo from './assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png';


export default {
    components: { logo },
    data() {
        return {
            msg: '',
            banner: logo,
            empleados: []
        }
    },
    methods: {
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificarempleados')
                .then((rows) => {
                    this.empleados = rows.data;
                    (this.empleados.length <= 0) ? alertInfo('Se ha detectado la inexistencia de empleados y sucursales', 'Aceptar')
                        : alertInfo('Se ha detectado la inexistencia de empleados', 'Aceptar')
                }).catch(e => {
                    notificationError(e.reponse.data.error, 7000);
                })
        }
    },
    mounted() {
        this.verficarEmpleados();
    }
}
</script>