<style>
.w-70 {
    width: 70%;
}

.mb-15vh {
    margin-bottom: 15vh;
}
</style>

<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <h5 class="bold">
                Cliente
            </h5>
            <span id="msg">{{ msg }}</span>
        </div>
        <hr>
        <form method="post" @submit.prevent="validateCrear">
            <div class="container">
                <div class="form-data">
                    <span class="bold">
                        info.
                        Personal
                    </span>
                    <div class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" class="form-control" id="nombres" v-model="model.cliente.nombres"
                                    @keyup="validInputText(model.cliente.nombres)" required>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" v-model="model.cliente.apellidos"
                                    @keyup="validInputText(model.cliente.apellidos)" required>
                            </div>
                        </div>
                        <label for="dui">DUI</label>
                        <input type="text" class="form-control" id="dui" v-model="model.cliente.dui">
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
                                <input type="text" class="form-control" id="telefono" v-model="model.cliente.telefono"
                                    required>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" v-model="model.cliente.correo">
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data mb-15vh">
                    <span class="bold">
                        Cuenta
                    </span>
                    <div action="" class="form-2 w-70 flex wp sp-bet">
                        <label for="clave">Contraseña</label>
                        <input type="password" class="form-control" id="clave" maxlength="15" minlength="10" v-model="model.cliente.clave"
                            required>
                    </div>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link to="/clientes" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>

                </div>
            </div>

        </form>
    </div>
</template>
<script>
// importando axios para hacer peticiones
import axios from 'axios';
// importando validador de datos
import { onlyLtrs, formatDui, formatEmail } from '../../validator.js';

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
                    this.msg = 'No se permiten números en los nombres'
                }
                // la secuencia que siguen las validaciones es
                // verificar sí no es nulo el valor 
                // para después validar según cada campo
                // validar contraseña mayor a 10 caracteres
                if (cliente.clave) {
                    !(cliente.clave.length > 10) ? this.msg = 'Contraseña debe ser mayor a 10 caracteres' : this.msg = ''; this.validate = true
                }
                // validar formato del correo 
                if (cliente.correo) {
                    (!formatEmail(cliente.correo)) ? this.msg = 'Formato de correo incorrecto' : this.msg = ''; this.validate = true
                }

                // validar dui : al final porque teniene más prioridad al ser una validación personalizada  
                if (cliente.dui) {
                    if (formatDui(cliente.dui)) {
                        this.validate = true;
                        this.msg = '';

                    } else {
                        
                        this.msg = 'Formato de DUI incorrecto'
                        this.validate = false;
                    }
                }

            } else {
                this.msg = 'No se permite campos vacíos';
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
            if ((cliente.nombres && cliente.apellidos && cliente.clave && cliente.telefono) !== '') {
                axios.post('http://localhost:3000/api/clientes', cliente)
                    // sí todo paso de manera correcta
                    .then(res => {
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
                        console.log(res)
                        alert(res.data)
                        // recireccionar a la vista principal
                        if (res.status === 201) this.$router.push('/clientes');
                    })
                    .catch(e => { console.error(e) });
                // limpiar espacio de mensajes de advertencia
            } else {
                this.msg = 'No se permite datos vacíos';
            }

        }
    }
}
</script>