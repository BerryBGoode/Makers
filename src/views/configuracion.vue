<style>
.mb-4vh {
    margin-bottom: 4vh;
}
</style>

<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Configuración
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container">
            <div class="form-data">
                <span class="bold">
                    info.
                    Personal
                </span>
                <div class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres" v-model="empleado.nombres">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" v-model="empleado.apellidos">
                        </div>
                    </div>
                    <label for="dui">DUI</label>
                    <input type="text" class="form-control" id="dui" v-model="empleado.dui">
                </div>
            </div>
            <hr>

            <div class="form-data">
                <span class="bold">
                    Contacto
                </span>
                <div class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="telefono" v-model="empleado.telefono">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" v-model="empleado.correo">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="form-data mb-4vh">
                <span class="bold">
                    Cuenta
                </span>

                <div class="form-2 w-70">
                    <div class="mb-3">
                        <label for="alias" class="form-label">Alias</label>
                        <input type="text" class="form-control" id="alias" v-model="empleado.alias" maxlength="50" required>
                    </div>

                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="clave" class="form-label">Nueva contraseña</label>
                            <input type="password" class="form-control" id="clave" v-model="empleado.clave">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="clave" class="form-label">Confirmar contraseña</label>
                            <input type="password" class="form-control" id="clave" v-model="empleado.confirmar">
                        </div>


                    </div>
                </div>

            </div>
            <hr>
            <div class="buttons-reservacion form-data padding-buttons">
                <button type="button" @click.prevent="cerrarSesion" class="btn btn-makers">Cerrar sesión</button>
                <button type="button" @click="back" class="btn btn-makers">Volver </button>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies';
import { alertQuestion, notificationError, notificationInfo, notificationSuccess } from '../components/alert.vue';
import { mapState, mapActions } from 'vuex';
import store from '../store';
// exportar componente
export default {
    name: 'configuracion',
    data() {
        return {

            empleado: {
                nombres: '',
                apellidos: '',
                dui: '',
                telefono: '',
                correo: '',
                clave: '',
                confirmar: '',
                alias: '',

            },
            msg: '',
            lastpath: '',
        }
    },
    methods: {
        ...mapActions(['actionUsuario']),
        ...mapActions(['actionAccess']),
        setUsuario(usuario) {
            this.actionUsuario(usuario);
        },
        setAccess(state) {
            this.actionAccess(state);
        },
        async cerrarSesion() {
            if (await alertQuestion('Desea cerrar sesión?', null, 'Aceptar', null, null, true)) {
                localStorage.removeItem('auth');
                this.$router.push({ name: 'login' });
                notificationSuccess('Sesión cerrada correctamente', 5000, null);
            }

        },
        // método para redireccionar a página anterior
        back() {
            // redireccionar a página anterior
            this.$router.go(-1);
        },
        getEmpleado() {
            axios.get('http://localhost:3000/api/auth/config', store.state.config)
                .then(res => {
                    // obtener datos
                    let empleado = res.data;
                    // asignar                    
                    this.empleado = {
                        alias: empleado.alias,
                        nombres: empleado.nombres,
                        apellidos: empleado.apellidos,
                        correo: empleado.correo,
                        dui: empleado.dui,
                        telefono: empleado.telefono
                    }
                })
        },
        modificar() {
            // verificar la coincidencia de contraseñas
            if (this.empleado.clave !== this.empleado.confirmar) {
                notificationInfo('Las contraseñas deben coincidir');
            }
            // verificar campos vacíos
            else if (!this.empleado.alias || !this.empleado.apellidos || !this.empleado.correo || !this.empleado.dui ||
                !this.empleado.nombres || !this.empleado.telefono) {
                notificationInfo('No se permiten campos vacíos');
            }
            else {
                axios.put('http://localhost:3000/api/auth/', this.empleado, store.state.config)
                    .then(res => {
                        // enviar al estado general el nuevo nombre de usuario que cargará en el componente de cuenta
                        this.setUsuario(this.empleado.alias)
                        // cuando si se realizo la tarea deceada y se creo algo 
                        // 201 es usado en método post y put
                        if (res.status === 201) {
                            // limpiar valores 
                            this.empleado = {
                                alias: '',
                                nombres: '',
                                apellidos: '',
                                dui: '',
                                telefono: '',
                                correo: '',
                                clave: '',
                            }
                            // redireccionar

                            this.msg = '';
                            this.$router.go(-1);
                            // emitir info que se modifico algo, a componente de cuenta
                        }

                        notificationSuccess(res.data, 3500, 'Aceptar')
                    })
                    .catch(e => {
                        notificationInfo(e.response.data)
                    })
            }
        }
    },
    mounted() {
        this.getEmpleado();
    },
} 
</script>