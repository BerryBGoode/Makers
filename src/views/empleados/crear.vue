<style>
.width-auto {
    width: auto;
}

.width-35 {
    width: 35%;
}

.input-container-3 {
    width: 31%;
}

.mb-9vh {
    margin-bottom: 9vh;
}
</style>

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
                    <div class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" v-model="this.model.empleado.nombres" class="form-control" id="nombres" required>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" v-model="this.model.empleado.apellidos"
                                    id="apellidos" required>
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container-3">
                                <label for="dui" class="form-label">DUI</label>
                                <input type="text" class="form-control" id="dui" v-model="this.model.empleado.dui" required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" v-model="this.model.empleado.correo"
                                    required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" v-model="this.model.empleado.telefono"
                                    required>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data mb-9vh">
                    <span class="bold">
                        Especificaciones
                    </span>

                    <div class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="sucursales" class="form-label">Sucursal</label>
                                <!-- verifiacr sí existen sucursales recuperadas -->
                                <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                                    v-if="sucursales.length > 0" v-model="this.model.empleado.sucursal" required>
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los datos de las sucursales -->
                                    <option v-for="(sucursal, i) in sucursales" :key="i" :value="sucursal.id_sucursal">{{
                                        sucursal.direccion }}</option>
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
                                <input type="text" class="form-control" id="planilla" v-model="this.model.empleado.planilla"
                                    required>
                            </div>
                            <div class="mb-3 width-35 input-container">
                                <label for="clave" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="clave" v-model="this.model.empleado.clave"
                                    maxlength="15" minlength="10" required>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="buttons-reservacion form-data">
                    <hr>
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
                    apellidos: '',
                    dui: '',
                    clave: '',
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
                axios.get('http://localhost:3000/api/empleados/sucursales')
                    .then(res => { this.sucursales = res.data }) // obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los horarios que puede tener un empleado
        cargarHorarios() {
            try {
                // realizar petición
                axios.get('http://localhost:3000/api/empleados/horarios')
                    .then(res => { this.horarios = res.data; console.log(res.data) }) //obtener los datos de la petición
                    .catch(e => { console.log(e) }) // caso de error
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los cargos que puede tener un empleado
        cargarCargos() {
            // realizar petición
            axios.get('http://localhost:3000/api/empleados/cargos')
                // cuando pase todo correctamente
                .then(res => { this.cargos = res.data }) // cuando todo salga correcto asignar valores a arreglo
                .catch(e => { console.error(e) }) // mostrar mensaje de error
        },
        // método para agregar un nuevo empleado
        crear() {
            // validar datos
            // realizar petición y enviando datos
            axios.post('http://localhost:3000/api/empleados', this.model.empleado)
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
                            planilla: '',
                            telefono: '',
                            correo: '',
                            sucursal: 'Seleccionar',
                            cargo: 'Seleccionar',
                            horario: 'Seleccionar',
                        }
                        // redireccionar
                        alert('Empleado agregado')
                        this.$router.push('/empleados');
                    }
                    console.log(res)                    

                    // sí la respuesta fue la esperada, redirección a la vista principal
                    // if (res.status === 201) this.$router.push('/empleados');
                })
                .catch(e => { alert(e) });

        }
    }
} 
</script>