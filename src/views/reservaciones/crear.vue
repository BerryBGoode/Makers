<style>
hr,
.form-data {
    margin: 0 1rem;
}

.form-data {
    padding: 1.5% 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.form-select {
    background: transparent url(../../assets/img/arrow.png) no-repeat right 0.75rem center;
    color: white;
    border: solid 1px rgb(118, 118, 118);
}

option {
    color: #212529;
}

.form-select:focus,
.form-control:focus {
    border-color: #b4b0af;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(84, 84, 84, 0.48);
}

.form-control,
.form-control:focus {
    color: white !important;
    border: none;
    background: #403C3B;
}

.form-2 {
    width: 50%;
}

.input-container {
    width: 48%;
}

.load {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.flex {
    display: flex;
}

.wp {
    flex-wrap: wrap;
}

.sp-bet {
    justify-content: space-between;
}

.buttons-reservacion {
    display: flex;
    justify-content: flex-end;
    gap: 5%;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    background-image: url(../../assets/img/calendar.png);
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 1;
}

input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    background-image: url(../../assets/img/time.png);
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 1;
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
        <form @submit.prevent="crearReser">

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
                            <div class="mb-3 input-container width-35">
                                <label for="clave" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="clave" readonly>
                            </div>
                        </div>
                    </form>

                </div>
                <hr>
                <div class="buttons-reservacion form-data">
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
//importar axios para realizar peticiones
import axios from 'axios';
//exportar componenete
export default {
    // nombre del componente
    name: "crearReservacion",
    // funciones que retornará el componente
    data() {
        return {
            //arreglo con info. cliente
            clientes: [],
            //arreglo para obtener datos de empleado
            empleados: [],
            model: {
                reservacion: {
                    fecha: '',
                    hora: '',
                    cliente: 'Seleccionar',
                    empleado: 'Seleccionar',
                }
            },
            //mostrar el mensaje
            msg: ''

            /* obj con datos del cliente
            cliente: {
                id: '',
                nombre: '',
                apellido: ''
            },
            // obj con datos del empleado
            empleado: {
                id: '',
                nombre: '',
                apellido: ''
            },
            // obj con datos de la reservación
            reservacion: {
                fecha: '',
                hora: ''*/
        }
    },
    mounted() {
        //cargar clientes
        this.cargarClientes();
        //cargar empleados
        this.cargarEmpleados();
    },
    methods: {
        //método para obtener los clientes
        cargarClientes() {
            try {
                //hacer petición para obtener clientes
                axios.get('http://localhost:3000/api/reservaciones/clientes')
                    .then(res => { this.clientes = res.data }) //obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        //método para obtener los empleados de las reservaciones
        cargarEmpleados() {
            try {
                //hacer petición para obtener empleados
                axios.get('http://localhost:3000/api/reservaciones/empleados')
                    .then(res => { this.empleados = res.data }) //obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        //método para agregar una reservación
        crearReser() {
            //validar datos
            //realizar petición y enviar datos
            axios.post('http://localhost:3000/api/reservaciones', this.model.reservacion)
            .then(res => {
                //cuando exista el error 400 es que no realizó lo que se debía
                if (res.data.error) {
                    this.msg = res.data.error;
                }
                //cuando si se realizó la tarea deseada y se creó algo
                //201 es usado en método post y put
                if (res.status === 201 && !res.data.error) {
                    //limpiar valores
                    this.model.reservacion = {
                        fecha: '',
                        hora: '',
                        cliente: 'Seleccionar',
                        empleado: 'Seleccionar',
                    }
                    //redireccionar
                    alert('Reservación agregada correctamente')
                    this.$router.push('/reservaciones');
                }
                console.log(res)

                //si la respuesta es la esperada, redireccionará a la vista principal
            })
            .catch(e =>  { alert(e) });
        }
    }
}
</script>