<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Empleado
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="crear">

            <div class="container">
                <div class="form-data">
                    <span class="bold">
                        info.
                        Personal
                    </span>
                    <div class="w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" autocomplete="off" v-model="this.model.empleado.nombres"
                                    class="form-control" id="nombres" required>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" autocomplete="off" class="form-control"
                                    v-model="this.model.empleado.apellidos" id="apellidos" required>
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container-3">
                                <label for="dui" class="form-label">DUI</label>
                                <input type="text" autocomplete="off" class="form-control" id="dui"
                                    v-model="this.model.empleado.dui" required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" autocomplete="off" class="form-control" id="correo"
                                    v-model="this.model.empleado.correo" required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" autocomplete="off" class="form-control" id="telefono"
                                    v-model="this.model.empleado.telefono" required>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data">
                    <span class="bold">
                        Especificaciones
                    </span>

                    <div class="w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="sucursales" class="form-label">Sucursal</label>
                                <!-- verifiacr sí existen sucursales recuperadas -->
                                <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                                    v-if="sucursales.length > 0" v-model="this.model.empleado.sucursal" required>
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los datos de las sucursales -->
                                    <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal">{{
                                        sucursal.nombre_sucursal }}</option>
                                </select>
                                <!-- sino existen sucursales -->
                                <select class="form-select mb-3" name="error" v-else>
                                    <option selected>No se encontraron sucursales</option>
                                </select>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="cargos" class="form-label">Cargo</label>
                                <!-- verifiacr sí existen sucursales recuperadas -->
                                <select class="form-select mb-3" aria-label="Default select example" id="cargos"
                                    v-if="cargos.length > 0" v-model="this.model.empleado.cargo" required>
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los datos de las sucursales -->
                                    <option v-for="(cargo, i) in cargos" :key="i" :value="cargo.id_cargo">{{
                                        cargo.cargo }}</option>
                                </select>
                                <!-- sino existen sucursales -->
                                <select class="form-select mb-3" name="error" v-else>
                                    <option selected>No se encontraron sucursales</option>
                                </select>
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container width-auto">
                                <label for="horario" class="form-label">Horarios</label>
                                <!-- verificar sí existen horarios -->
                                <select class="form-select mb-3" aria-label="Default select example" id="horario"
                                    v-if="horarios.length > 0" v-model="this.model.empleado.horario" required>
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los hotarios encontrados -->
                                    <option v-for="(horario, i) in horarios" :key="i" :value="horario.id_horario">
                                        {{ horario.inicio }} - {{ horario.cierre }}

                                    </option>
                                </select>
                                <select class="mb-3 form-select" v-else>
                                    <option>No se encontraron horarios</option>
                                </select>
                            </div>
                            <div class="mb-3 width-35 input-container">
                                <label for="planilla" class="form-label">Planilla</label>
                                <input type="text" autocomplete="off" class="form-control" id="planilla"
                                    v-model="this.model.empleado.planilla" required>
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 width-32">
                                <label for="alias" class="form-label">Alias</label>
                                <input type="text" autocomplete="off" class="form-control" id="alias"
                                    v-model="this.model.empleado.alias" maxlength="50" required>
                            </div>
                            <div class="mb-3 width-32">
                                <label for="clave" class="form-label">Contraseña</label>
                                <input type="password" autocomplete="off" class="form-control" id="clave"
                                    v-model="this.model.empleado.clave" required>
                            </div>
                            <div class="mb-3 width-32">
                                <label for="confirmar" class="form-label">Confirmar contraseña</label>
                                <input type="password" autocomplete="off" class="form-control" id="confirmar"
                                    v-model="this.model.empleado.confirmar" required>
                            </div>
                        </div>
                    </div>

                </div>
                <hr>
                <div class="padding-buttons buttons-reservacion form-data">
                    <router-link to="/empleados" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
// importar axios para realizar peticiones
import axios from 'axios';
import { onlyLtrs, onlyNumb, password } from '../../validator'
import store from '../../store';
import { notificationError, notificationInfo, notificationSuccess } from '../../components/alert.vue';
// exportar componente
export default {
    name: 'crearEmpleado',
    data() {
        return {
            // arreglo con info. sucursales
            sucursales: [],
            // arreglo para obtener datos de horarios
            horarios: [],
            cargos: [],
            model: {
                empleado: {
                    nombres: '',
                    alias: '',
                    apellidos: '',
                    dui: '',
                    clave: '',
                    confirmar: '',
                    planilla: '',
                    telefono: '',
                    correo: '',
                    sucursal: 'Seleccionar',
                    cargo: 'Seleccionar',
                    horario: 'Seleccionar',
                }
            },
            // mostrarle al cliente mensajes
            msg: ''
        }
    },
    mounted() {
        // cargar sucursales
        this.cargarSucursales();
        // cargar horarios
        this.cargarHorarios();
        this.cargarCargos();
    },
    methods: {
        // método para obtener las sucursales
        cargarSucursales() {
            try {
                // hacer petición para obtener sucursales y horarios
                axios.get('http://localhost:3000/api/empleados/sucursales', store.state.config)
                    .then(res => { this.sucursales = res.data }) // obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data, 3500) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los horarios que puede tener un empleado
        cargarHorarios() {
            try {
                // realizar petición
                axios.get('http://localhost:3000/api/empleados/horarios', store.state.config)
                    .then(res => { this.horarios = res.data; }) //obtener los datos de la petición
                    .catch(e => { notificationError(e.response.data, 3500) }) // caso de error
            } catch (error) {
                notificationError(error, 3500);
            }
        },
        // método para obtener los cargos que puede tener un empleado
        cargarCargos() {
            // realizar petición
            axios.get('http://localhost:3000/api/empleados/cargos', store.state.config)
                // cuando pase todo correctamente
                .then(res => { this.cargos = res.data }) // cuando todo salga correcto asignar valores a arreglo
                .catch(e => { notificationError(e.response.data, 3500) }) // mostrar mensaje de error
        },
        // método para agregar un nuevo empleado
        crear() {

            this.msg = '';
            // verificando sí las contraseñas coincidan
            if (this.model.empleado.clave !== this.model.empleado.confirmar) {
                notificationInfo('Las contraseñas deben coincidir')
            }
            // verificando sí siguen la longitud esperada
            else if (!onlyLtrs(this.model.empleado.alias) || !onlyLtrs(this.model.empleado.apellidos) || !onlyLtrs(this.model.empleado.nombres)) {
                notificationInfo('Solo se permiten letras');
            }
            else if (!onlyNumb(this.model.empleado.planilla)) {
                notificationInfo('Solo se permiten números para la planilla');
            }
            else if (this.model.empleado.clave.length < 8) { notificationInfo('Longitud mínima superada') }
            else if (this.model.empleado.clave.length > 72) { notificationInfo('Longitud máxima superada') }
            // verificando sí la contraseña contiene datos del usuario
            else if (this.model.empleado.clave.includes(this.model.empleado.alias) || this.model.empleado.clave.includes(this.model.empleado.apellidos) ||
                this.model.empleado.clave.includes(this.model.empleado.cargo) || this.model.empleado.clave.includes(this.model.empleado.correo) ||
                this.model.empleado.clave.includes(this.model.empleado.dui) || this.model.empleado.clave.includes(this.model.empleado.nombres) ||
                this.model.empleado.clave.includes(this.model.empleado.sucursal) || this.model.empleado.clave.includes(this.model.empleado.telefono)) {
                notificationInfo(`Por motivos de seguridad recomendamos que la contraseña
                                no contenga datos personales o información fácil de identificar`);
            }
            // verificando sí siguen con el formato adecuando
            else if (!password(this.model.empleado.clave)) {
                notificationInfo(`La contraseña no cumple con los requisitos.
                                Debe contenter al menos una letra mayúscula, una letra minúscula,
                                un número, un carácter especial y ningún espacio`, 9500);
            }
            else if (this.model.empleado.alias && this.model.empleado.apellidos && this.model.empleado.telefono &&
                this.model.empleado.cargo !== 'Seleccionar' && this.model.empleado.sucursal !== 'Seleccionar' && this.model.empleado.horario !== 'Seleccionar'
                && this.model.empleado.dui && this.model.empleado.clave && this.model.empleado.correo &&
                this.model.empleado.planilla && this.model.empleado.confirmar) {
                // realizar petición y enviando datos
                axios.post('http://localhost:3000/api/empleados', this.model.empleado, store.state.config)
                    .then(res => {
                        // cuando hay un error 400 que no realizo lo que se debía
                        if (res.data.error) {
                            this.msg = res.data.error;
                        }
                        // cuando si se realizo la tarea deceada y se creo algo 
                        // 201 es usado en método post y put
                        if (res.status === 201 && !res.data.error) {
                            // limpiar valores 
                            this.model.empleado = {
                                nombres: '',
                                apellidos: '',
                                dui: '',
                                clave: '',
                                confirmar: '',
                                planilla: '',
                                telefono: '',
                                correo: '',
                                sucursal: 'Seleccionar',
                                cargo: 'Seleccionar',
                                horario: 'Seleccionar',
                            }
                            // redireccionar
                            notificationSuccess('Empleado agregado', 3500)
                            this.$router.push('/empleados');
                        }

                        // sí la respuesta fue la esperada, redirección a la vista principal
                        // if (res.status === 201) this.$router.push('/empleados');
                    })
                    .catch(e => { notificationError(e.response.data) });

            } else {
                notificationError('No se permiten campos vacíos');
            }
        }
    }
} 
</script>