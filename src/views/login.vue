<style>
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
                            <label for="alias" class="form-label">Alias</label>
                            <input type="text" class="form-control" id="alias" v-model="this.model.empleado.alias" required>
                        </div>
                        <div class="mb-3">
                            <label for="clave" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="clave" v-model="this.model.empleado.clave"
                                maxlength="72" minlength="8" required>
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 func">
                    <div class="img-fun align-center">
                        <img :src="model.logo_lc" alt="Logo" draggable="false">
                    </div>

                    <div class="buttons-login">
                        <button type="submit" class="btn btn-makers w-100 bold">Iniciar Sesión</button>
                        <a @click="selectMethod" class="href-makers">Restablecer contraseña</a>
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
import dashboard from './dashboard.vue';
import logo from '../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png'
import { alertInfo, alertQuestion, notificationError, notificationInfo, notificationSuccess } from '../components/alert.vue';
import { mapActions, mapState } from 'vuex';
import { alertRequest } from './recuperacion/form.vue';
import store from '../store';
import Swal from 'sweetalert2';
import empleadoVue from './primerUso/empleado.vue';
import { getBinary } from '../validator';
import { convertToBin } from '../validator';

export default {
    // nombre del componente
    name: "login",
    components: { logo },
    // método que retorna el componente
    data() {
        return {
            model: {
                logo_lc: logo,
                empleado: {
                    correo: '',
                    dui: '',
                    clave: '',
                    alias: '',
                    autenticacion: false
                },
                auth: {
                    state: '',
                    token: '',
                    pin: 44
                }
            },
            msg: '',

        }
    },
    methods: {
        ...mapActions(['actionSucursal']),
        ...mapActions(['actionEmpleado']),
        setSucursal(state) {
            this.actionSucursal(state)
        },
        setEmpleado(state) {
            this.actionEmpleado(state)
        },
        async selectMethod() {
            let notif = await alertQuestion('Seleccione método de recuperación', null, 'Correo electronico', true, 'Mensaje de texto', false);
            let html = `<form class="container p-5 login-container h-100">
                <div class="col h-100 flex wrap login">
                    <div class="row-6 p-3 w-100 form align-center">
                        <div class="children-form">
                            <div class="mb-3">
                                <label for="dui" class="form-label">DUI</label>
                                <input type="text" class="form-control" id="dui_rec" required name="dui">
                            </div>
                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo_rec" required name="correo">
                            </div>
                            <div class="mb-3">
                                <label for="alias" class="form-label">Alias</label>
                                <input type="text" class="form-control" id="alias_rec" maxlength="20" required name="alias">
                            </div>
                        </div>
                    </div>
                </div>
            </form>`;
            if (notif) {
                alertRequest(() => {
                    // extraer los datos
                    let data = {
                        dui: document.getElementById('dui_rec').value,
                        correo: document.getElementById('correo_rec').value,
                        alias: document.getElementById('alias_rec').value
                    }
                    // realizar petición
                    return axios.post('http://localhost:3000/api/auth/recuperacion/correo/', data)
                        .then(res => {
                            Swal.showValidationMessage(
                                res.data
                            )
                        }).catch(rej => {
                            Swal.showValidationMessage(
                                `Request failed: ${rej}`
                            )
                        })

                }, html);
            } else {
                let confirm = await alertRequest(null, null, html);
                console.log(confirm)
            }

        },
        verificarSucursales() {
            if (store.state.sucursales === null) {
                axios.get('http://localhost:3000/api/auth/verificar/sucursal')
                    .then(rows => {
                        // guardar las sucursales encontradas
                        this.setSucursal(rows.data);
                        // verificar sí no hay sucursales para redireccionar al login, sino que verificar la cantidad de empleados registrados
                        // (rows.data <= 0) ? this.$router.push('/primer/sucursal') : this.verficarEmpleados()
                    }).catch(rej => {
                        console.log(rej);
                    })
            }


        },
        verficarEmpleados() {
            if (store.state.empleados === null) {
                axios.get('http://localhost:3000/api/auth/verificar/empleados')
                    .then((rows) => {
                        // obtiendo los valores de la petición
                        this.setEmpleado(rows.data)
                        // verificando la existencia de los empleados, para redireccionara primer empleados, 
                        // sino verificar sí hay autenticación para así o redireccionar al login o a inicio
                        // if (rows.data <= 0) {
                        //     this.$router.push('/primer/empleado')
                        // } else {
                        //     if (localStorage.getItem('auth')) {
                        //         // console.log('s')
                        //         this.$router.push('/inicio');
                        //     }
                        // }
                    }).catch(e => {
                        notificationError(e, 7000);
                    })
            }

        },
        // método para buscar a un empleado con esos datos
        async checkEmpleado() {
            // limpiar mensaje
            this.msg = '';
            // validar datos vacios
            if (!this.model.empleado.correo && !this.model.empleado.clave && !this.model.empleado.dui) {
                this.msg = 'No se permite campos vacíos';

            } else {
                try {
                    // if (await lertQuestion('', null, 'Aceptar', true, 'denegar', false)) {
                    //     this.model.empleado.autenticacion = true;
                    // } else {
                    //     this.model.empleado.autenticacion = false
                    // }
                    let res = await axios.post('http://localhost:3000/api/auth/', this.model.empleado);
                    if (!res.data.auth) this.msg = res.data.msg;
                    // creando token
                    if (res.data.auth !== false) {

                        // segunda autenticación
                        if (this.model.empleado.autenticacion) {
                            let html = `<form class="container p-5 login-container h-100">
                                                <div class="col h-100 flex wrap login">
                                                    <div class="row-6 p-3 w-100 form align-center">
                                                        <div class="children-form">
                                                            <span class="center-text">Se envio un PIN a su correo</span>
                                                            <div class="mb-3">
                                                                <label for="pin" class="form-label">PIN</label>
                                                                <input type="text" class="form-control" id="pin" v-model="model.auth.pin" required>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>`;
                            // formulario para enviar PIN
                            alertRequest(() => {
                                let pin = document.getElementById('pin').value;
                                let obj = {
                                    pin: pin,
                                    dui: this.model.empleado.dui,
                                    correo: this.model.empleado.correo,
                                    alias: this.model.empleado.alias,
                                }
                                // enviando petición
                                return axios.post('http://localhost:3000/api/auth/correo', obj)
                                    .then(response => {
                                        // verificar sí el status es OK para tomar comportamiento por defecto
                                        if (response.statusText === 'OK') {
                                            this.beforeAuth(res.data.auth, res.data.token, res.data)
                                        }
                                    }).catch(rej => {
                                        Swal.showValidationMessage(
                                            `Request failed: ${rej}`
                                        )
                                    })
                            }, html)
                        } else {
                            this.beforeAuth(res.data.auth, res.data.token, res.data, res.data.id)
                        }

                    }

                } catch (error) {
                    notificationError(error);
                }

            }
        },
        async beforeAuth(state, token, modif, id) {
            // asginar estado de la autenticación
            this.model.auth.state = state;
            this.model.auth.token = token
            //guardando token
            localStorage.setItem('auth', token);
            // asignar token al estado general
            store.state.config.headers.authorization = token;
            // verificar sí ya pasaron la cantidad de dias establecidos para restablecer contraseña
            if (modif === false) {
                // mostrar notificacion
                await notificationSuccess('Sesión iniciada correctamente', 2500);
                this.$router.push('/inicio')
            }
            else {
                await alertInfo('Restablecimiento de contraseña', 'Aceptar', null, 'Se ha redireccionado para cambiar la contraseña, debido ha que han pasado 90 días en los cuales se le comienda actualizar su contraseña')
                this.$router.push('/restablecer=' + id);
            }
        }
    },
    mounted() {
        this.verificarSucursales();
    }
}

</script>