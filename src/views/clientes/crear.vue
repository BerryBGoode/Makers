<style>
.w-70 {
    width: 70%;
}
</style>

<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Cliente
            </h5>
            <span id="msg">{{ msg }}</span>
        </div>
        <hr>

        <form class="container h-91" @submit.prevent="validateCrear">
            <div class="form-data">
                <span class="bold">
                    info.
                    Personal
                </span>
                <div class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" autocomplete="off" class="form-control" id="nombres"
                                v-model="model.cliente.nombres" @keyup="validInputText(model.cliente.nombres)" required>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" autocomplete="off" class="form-control" id="apellidos"
                                v-model="model.cliente.apellidos" @keyup="validInputText(model.cliente.apellidos)" required>
                        </div>
                    </div>
                    <label for="dui">DUI</label>
                    <input type="text" autocomplete="off" class="form-control" id="dui" v-model="model.cliente.dui">
                </div>
            </div>
            <hr>
            <div class="form-data">
                <span class="bold">
                    Contacto
                </span>
                <div action="" class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="text" autocomplete="off" class="form-control" id="telefono"
                                v-model="model.cliente.telefono" required>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" autocomplete="off" class="form-control" id="correo"
                                v-model="model.cliente.correo">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="mb-17vh form-data">
                <span class="bold">
                    Cuenta
                </span>
                <div action="" class="form-2 w-70 flex wp sp-bet load">
                    <div class="mb3 input-container">
                        <label for="clave">Contraseña</label>
                        <input type="password" autocomplete="off" class="form-control" id="clave"
                            v-model="model.cliente.clave" required minlength="8" maxlength="72">
                    </div>
                    <div class="mb3 input-container">
                        <label for="confirmar">Confirmar contraseña</label>
                        <input type="password" autocomplete="off" class="form-control" id="confirmar"
                            v-model="model.cliente.confirmar" required minlength="8" maxlength="72">
                    </div>


                </div>
            </div>
            <hr>
            <div class="buttons-reservacion padding-buttons form-data">
                <router-link to="/clientes" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="submit" class="btn btn-makers">Agregar</button>

            </div>
        </form>
    </div>
</template>
<script>
// importando axios para hacer peticiones
import axios from 'axios';

// importando validador de datos
import { onlyLtrs, formatDui, formatEmail, password } from '../../validator.js';
import store from '../../store/index.js';
import { notificationError, notificationInfo, notificationSuccess } from '../../components/alert.vue';

// exportando el componente principal
export default {
    name: 'crearCliente',
    data() {
        return {
            // definir modelo con los datos del cliente
            model: {
                cliente: {
                    nombres: '',
                    apellidos: '',
                    dui: '', // valido valores vacíos
                    telefono: '',
                    correo: '', // valido valores vacíos
                    clave: '',
                    confirmar: '',
                    estado: 1
                }
            },
            // variable para mensaje
            msg: '',
            // variable para verificar si todo esta valido
            validate: false
        }
    },
    methods: {
        validInputText(text) {
            if (!onlyLtrs(text)) {
                this.msg = 'Solo se permiten letras';
            } else {
                this.msg = '';
            }
            // limpiar mensaje
            if (text === ' ' || text === '') {
                this.msg = '';
            }
        },
        validateCrear() {
            // e.preventDefault();
            // event.preventDefault();
            // obtener los valores
            let cliente = this.model.cliente;
            // console.log(cliente)
            // validar datos vacíos
            if ((cliente.nombres && cliente.apellidos && cliente.clave && cliente.telefono) !== '') {
                // validar campos alphabeticos
                if (!onlyLtrs(cliente.nombres) || !onlyLtrs(cliente.apellidos)) {
                    notificationInfo('No se permiten números en los nombres');
                }
                // la secuencia que siguen las validaciones es
                // verificar sí no es nulo el valor 
                // para después validar según cada campo
                // validar formato del correo 
                if (cliente.correo) {
                    (!formatEmail(cliente.correo)) ? notificationInfo('Formato de correo incorrecto') : this.msg = ''; this.validate = true
                }

                // validar dui : al final porque teniene más prioridad al ser una validación personalizada  
                if (cliente.dui) {
                    if (formatDui(cliente.dui)) {
                        this.validate = true;
                        this.msg = '';

                    } else {

                        notificationInfo('Formato de DUI incorrecto');
                        this.validate = false;
                    }
                }

            } else {
                notificationInfo('No se permite campos vacíos');
            }
            // después de verificar sí todo está correcto hacer inserción
            if (this.validate !== false) {
                this.crearCliente();
            }
        },
        // método para guardar registro
        crearCliente() {
            // obtener los valores
            let cliente = this.model.cliente;

            // validando q las contraseñas coincidan
            if (cliente.clave !== cliente.confirmar) {
                notificationInfo('Las contraseñas deben coincidir');
            }
            else if (!onlyLtrs(cliente.nombres) || !onlyLtrs(cliente.apellidos)) {
                notificationInfo('Solo se perimten letras');
            }
            // validando la longitud de la clave
            else if (cliente.clave.length < 8) { notificationInfo('Longitud mínima superada') }
            else if (cliente.clave.length > 72) { notificationInfo('Longitud máxima superada') }
            // verificando sí la contraseña contiene datos del usuario
            else if (cliente.clave.includes(cliente.apellidos) ||
                cliente.clave.includes(cliente.correo) ||
                cliente.clave.includes(cliente.dui) ||
                cliente.clave.includes(cliente.nombres) ||
                cliente.clave.includes(cliente.telefono)) {
                notificationInfo(`Por motivos de seguridad recomendamos que la contraseña
                                no contenga datos personales o información fácil de identificar`);
            }
            // validando q la clave tenga los requisitos
            else if (!password(cliente.clave)) {
                notificationInfo(`La contraseña no cumple con los requisitos.
                                Debe contenter al menos una letra mayúscula, una letra minúscula,
                                un número, un carácter especial y ningún espacio`, 9500);
            }
            else if ((cliente.nombres && cliente.apellidos && cliente.clave && cliente.telefono) !== '') {
                axios.post('http://localhost:3000/api/clientes', cliente, store.state.config)
                    // sí todo paso de manera correcta
                    .then(res => {

                        // verificar errores
                        if (res.data.error) this.msg = res.data.error;
                        else {
                            // limpiar modelo con los datos cliente
                            this.model.cliente = {
                                nombres: '',
                                apellidos: '',
                                dui: '',
                                telefono: '',
                                correo: '',
                                clave: '',
                                estado: 1
                            }
                            this.$router.push('/clientes');
                            notificationSuccess(res.data, 3500)
                            // recireccionar a la vista principal
                        }

                    })
                    .catch(e => { notificationError(e.response.data) });
                // limpiar espacio de mensajes de advertencia
            } else {
                this.msg = 'No se permite datos vacíos';
            }

        }
    }
}
</script>