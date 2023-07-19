<style>
.login-container {
    border: solid 2px #676767;
    background-color: #2c2828;
    border-radius: 7px;
    height: 75%;
}

.items-center {
    align-items: center;
}

.wrap {
    flex-wrap: wrap;
}

.children-form {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.href-makers {
    color: #909090;
}

.buttons-login {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.func {
    gap: 50px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
}

.msg {
    position: absolute;
}

@media screen and (max-width: 725px) {
    .login {
        flex-direction: column;
    }

    .func,
    .form {
        height: 50%;
        width: 100% !important;
    }
}
</style>

<template>
    <section class="flex items-center w-100 h-100 ">
        <form class="container p-5 login-container" @submit.prevent="checkEmpleado">
            <span class="msg">{{ msg }}</span>
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="dui" class="form-label">DUI</label>
                            <input type="text" class="form-control" id="dui" v-model="this.model.empleado.dui" required>
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" v-model="this.model.empleado.correo"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="clave" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="clave" v-model="this.model.empleado.clave"
                                maxlength="15" minlength="10" required>
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 func">
                    <div class="img-fun align-center">
                        <img :src="model.logo_lc" alt="Logo">
                    </div>

                    <div class="buttons-login">
                        <button type="submit" class="btn btn-makers w-100 bold">Iniciar Sesión</button>
                        <a href="" class="href-makers">Restablecer contraseña</a>
                    </div>
                </div>
            </div>
        </form>
    </section>
</template>
<script>
// importar axios para hacer peticiones
import axios from 'axios';
// importar para configurar rutas
import { createRouter, createWebHistory } from 'vue-router'
// importar componente a reenviar
import inicio from './inicio.vue';
import dashboard from './dashboard.vue';
import logo from '../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png'



export default {
    // nombre del componente
    name: "login",
    components: {logo},
    // método que retorna el componente
    data() {
        return {            
            model: {
                logo_lc: logo,
                empleado: {
                    correo: '',
                    clave: '',
                    dui: ''
                },
                auth: {
                    state: '',
                    token: '',
                }
            },
            msg: '',
            router: createRouter({
                history: createWebHistory(),
                routes: [
                    { path: '/', component: dashboard },
                    { path: '/inicio', component: inicio }

                ]
            })

        }
    },
    methods: {
        // método para buscar a un empleado con esos datos
        checkEmpleado() {
            // limpiar mensaje
            this.msg = '';
            // validar datos vacios
            if (!this.model.empleado.correo && !this.model.empleado.clave && !this.model.empleado.dui) {
                this.msg = 'No se permite campos vacíos';
            } else {
                // realizar petición
                axios.post('http://localhost:3000/api/auth', this.model.empleado)
                    .then(res => {
                        // verificar estado de autenticación
                        if (!res.data.auth) this.msg = res.data.msg;
                        // creando token
                        if (res.data.auth !== false) {
                            this.model.auth.state = res.data.auth; this.model.auth.token = res.data.token
                            this.crearCookie(res.data.token)
                            this.msg = res.data.msg
                            this.$router.push(inicio)
                        }
                    })
                    .catch(e => {
                        alert(e)
                    })
            }
        },
        crearCookie(token) {

            // creando cookie
            this.$cookies.set('auth', token, { experies: '1d' });
            // evitar datos a componente padre, especificando el nombre que se pondrá el evento de este
            // componente realiza y el dato
            this.$emit('getCookie', this.$cookies.get('auth'))

        },        
    }

}

</script>