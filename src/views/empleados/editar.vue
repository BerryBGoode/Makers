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
        <form @submit.prevent="modificarEmpleado">

            <div class="container">
                <div class="form-data">
                    <span class="bold">
                        info.
                        Personal
                    </span>
                    <form action="" class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" v-model="this.model.empleado.nombres" class="form-control" id="nombres">
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" v-model="this.model.empleado.apellidos"
                                    id="apellidos">
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container-3">
                                <label for="dui" class="form-label">DUI</label>
                                <input type="text" class="form-control" id="dui" v-model="this.model.empleado.dui">
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="correo" class="form-label">Correo</label>
                                <input type="email" class="form-control" id="correo" v-model="this.model.empleado.correo">
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono"
                                    v-model="this.model.empleado.telefono">
                            </div>
                        </div>
                    </form>
                </div>
                <hr>
                <div class="form-data mb-9vh">
                    <span class="bold">
                        Especificaciones
                    </span>

                    <form action="" class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="sucursales" class="form-label">Sucursal</label>
                                <!-- verifiacr sí existen sucursales recuperadas -->
                                <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                                    v-if="sucursales.length > 0" v-model="this.model.empleado.sucursal">
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
                                    v-if="cargos.length > 0" v-model="this.model.empleado.cargo">
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
                                    v-if="horarios.length > 0" v-model="this.model.empleado.horario">
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
                            <div class="mb-3 input-container width-35">
                                <label for="planilla" class="form-label">Planilla</label>
                                <input type="text" class="form-control" id="planilla"
                                    v-model="this.model.empleado.planilla">
                            </div>
                            <div class="mb-3 width-35 input-container">
                                <label for="alias" class="form-label">Alias</label>
                                <input type="text" class="form-control" id="alias" v-model="this.model.empleado.alias"
                                    maxlength="50" required>
                            </div>
                            <div class="mb-3 input-container width-35">
                                <label for="clave" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="clave" readonly>
                            </div>
                        </div>
                    </form>

                </div>
                <hr>
                <div class="padding-buttons buttons-reservacion form-data">
                    <router-link to="/empleados" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
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
    name: 'editarEmpleado',
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
                    alias: '',
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
        // cargar cargos
        this.cargarCargos();
        // cargar empleado solicitado, obtener parametro id de la url
        this.getEmpleado(this.$route.params.id);
    },
    methods: {
        // método para obtener las sucursales
        cargarSucursales() {
            try {
                // hacer petición para obtener sucursales y horarios
                axios.get('http://localhost:3000/api/empleados/sucursales')
                    .then(res => { this.sucursales = res.data }) // obtener los datos de la petición
                    .catch(e => { alert(e.response.data.error) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los horarios que puede tener un empleado
        cargarHorarios() {
            try {
                // realizar petición
                axios.get('http://localhost:3000/api/empleados/horarios')
                    .then(res => { this.horarios = res.data; }) //obtener los datos de la petición
                    .catch(e => { alert(e.response.data.error) }) // caso de error
            } catch (error) {
                console.error(error);
            }
        },
        // método para cargar los cargos que puede tener un cliente
        cargarCargos() {
            // realizar petición
            axios.get('http://localhost:3000/api/empleados/cargos')
                // cuando pase todo correctamente
                .then(res => { this.cargos = res.data }) // cuando todo salga correcto asignar valores a arreglo
                .catch(e => { console.error(e) }) // mostrar mensaje de error
        },
        // método para obtener los datos del empleado seleccionado
        getEmpleado(idempleado) {
            axios.get('http://localhost:3000/api/empleados/' + idempleado)
                .then(res => {
                    // cargar los datos                    
                    // guardar en una constante los datos obtenidos
                    const EMPLEADO = res.data;
                    // asignar a cada uno
                    this.model.empleado = {
                        alias: EMPLEADO.alias,
                        nombres: EMPLEADO.nombres,
                        apellidos: EMPLEADO.apellidos,
                        dui: EMPLEADO.dui,
                        correo: EMPLEADO.correo,
                        planilla: EMPLEADO.planilla,
                        telefono: EMPLEADO.telefono,
                        sucursal: EMPLEADO.id_sucursal,
                        cargo: EMPLEADO.id_cargo,
                        horario: EMPLEADO.id_horario
                    }
                    
                })
                .catch(e => {
                    // validar empleado inexistente
                    alert(e.response.data.error);
                })
        },
        // método para modificar los datos del cliente
        modificarEmpleado() {
            
            // obtener idempleado, del parametro establecido en index de routes del front llamado :'id'
            let idempleado = this.$route.params.id;
            // TODO: validar datos


            // realizar petición al servidor
            axios.put('http://localhost:3000/api/empleados/' + idempleado, this.model.empleado)
                .then(res => {
                    // cuando hay un error 400 que no realizo lo que se debía
                    if (res.data.error) {
                        this.msg = res.data.error;
                        
                        // console.log(res.data)
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
                        alert('Empleado modificado')
                        this.msg = '';
                        this.$router.push('/empleados');
                    }
                })
                .catch(e => { alert(e.response.data.error);});
        }
    }
} 
</script>