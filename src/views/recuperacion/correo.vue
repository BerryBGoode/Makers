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
        <form class="container p-5 login-container w-50" @submit.prevent="restablecer">

            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-100 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="clave" class="form-label">Nueva contraseña</label>
                            <input type="password" class="form-control" id="clave" required v-model="empleado.clave">
                        </div>
                        <div class="mb-3">
                            <label for="confirmar" class="form-label">Confirmar contraseña</label>
                            <input type="password" class="form-control" id="confirmar" required
                                v-model="empleado.confirmar">
                        </div>

                    </div>
                    <div class="buttons-login">
                        <button type="submit" class="btn btn-makers w-100 bold">Restablecer</button>
                    </div>
                </div>
            </div>
        </form>
    </section>
</template>
<script>
import axios from 'axios';
import { password } from '../../validator';
import { alertInfo, notificationInfo, notificationSuccess } from '../../components/alert.vue';
export default {
    data() {
        return {
            empleado: {
                clave: '',
                confirmar: '',
                alias: '',
                nombres: '',
                apellidos: '',
                correo: '',
                dui: '',
                telefono: ''
            },
            config: {
                headers: {
                    authorization: this.$route.params.id
                }
            }
        }

    },
    methods: {
        getEmpleado() {
            axios.get('http://localhost:3000/api/auth/restablecer', this.config)
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
                }).catch(e => {
                    notificationInfo(e.response.data);
                })
        },
        async restablecer() {
            if (this.empleado.clave !== this.empleado.confirmar) {
                notificationInfo('Las contraseñas deben coincidir')
            }
            // verificando sí siguen la longitud esperada
            else if (this.empleado.clave.length < 8) { notificationInfo('Longitud mínima superada') }
            else if (this.empleado.clave.length > 72) { notificationInfo('Longitud máxima superada') }
            // verificando sí la contraseña contiene datos del usuario
            else if (this.empleado.clave.includes(this.empleado.alias) || this.empleado.clave.includes(this.empleado.apellidos) ||
                this.empleado.clave.includes(this.empleado.correo) ||
                this.empleado.clave.includes(this.empleado.dui) || this.empleado.clave.includes(this.empleado.nombres) ||
                this.empleado.clave.includes(this.empleado.sucursal) || this.empleado.clave.includes(this.empleado.telefono)) {
                notificationInfo(`Por motivos de seguridad recomendamos que la contraseña
                                no contenga datos personales o información fácil de identificar`);
            }
            // verificando sí siguen con el formato adecuando
            else if (!password(this.empleado.clave)) {
                notificationInfo(`La contraseña no cumple con los requisitos.
                                Debe contenter al menos una letra mayúscula, una letra minúscula,
                                un número, un carácter especial y ningún espacio`, 9500);
            } else {

                axios.post('http://localhost:3000/api/auth/restablecer', this.empleado, this.config)
                    .then(res => {
                        notificationSuccess(res.data, 3500, 'Aceptar');
                        alertInfo('Aceptar', true, 4500, 'Ahora que la contraseña se restablecio correctamente, intente iniciar sesión')
                        this.$router.push('/login')
                    }).catch(e => {
                        console.log(e)
                        notificationInfo(e.response.data);
                    })
            }
        }
    },
    mounted() {
        this.getEmpleado();
    }
}
</script>