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
                Reservación
            </h5>
        </div>
        <hr>
        <div class="container">
            <form @submit.prevent="modificarReservacion">
                <div class="form-data">
                    <span class="bold">
                        Cliente
                    </span>
                    <div class="form-2">
                        <label for="">DUI</label>
                        <select class="form-select mb-3" aria-label="Default select example" v-if="clientes.length > 0"
                            v-model="model.reservacion.cliente" @change="getCliente">
                            <option selected>Seleccionar</option>
                            <option v-for="(cliente, i) in clientes" :key="i" :value="cliente.id_cliente">{{
                                cliente.dui }}
                            </option>
                        </select>
                        <select class="form-select mb-3" aria-label="Default select example" v-else>
                            <option selected>No se encontraron datos</option>
                        </select>

                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" class="form-control" id="nombres" v-model="cliente.nombre" readonly>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" v-model="cliente.apellido" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data">
                    <span class="bold">
                        Empleado
                    </span>
                    <div class="form-2">
                        <label for="">DUI</label>
                        <select class="form-select mb-3" aria-label="Default select example" v-if="empleados.length > 0"
                            v-model="model.reservacion.empleado" @change="getEmpleado">
                            <option selected>Seleccionar</option>
                            <option v-for="empleado in empleados" :key="empleado.id_empleado" :value="empleado.id_empleado">
                                {{
                                    empleado.dui }}
                            </option>

                        </select>
                        <select class="form-select mb-3" aria-label="Default select example" v-else>
                            <option selected>No se encontraron datos</option>
                        </select>
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombres" class="form-label">Nombres</label>
                                <input type="text" class="form-control" id="nombres" v-model="empleado.nombre" readonly>
                            </div>
                            <div class="mb-3 input-container">
                                <label for="apellidos" class="form-label">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" v-model="empleado.apellido" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data">
                    <span class="bold">
                        Reservación
                    </span>
                    <div class="form-2 flex wp sp-bet">
                        <div class="mb-3 flex-col input-container">
                            <label for="">Fecha</label>
                            <input type="date" name="" id="" class="form-control" v-model="model.reservacion.fecha">
                        </div>
                        <div class="mb-3 flex-col input-container">
                            <label for="">Hora</label>
                            <input type="time" name="" id="" class="form-control" v-model="model.reservacion.hora">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link to="/reservaciones" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
                </div>
            </form>
        </div>
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
            msg: '',

            // obj con datos del cliente
            cliente: {
                id: '',
                nombre: '',
                apellido: '',
                dui: 'Seleccionar'
            },
            // obj con datos del empleado
            empleado: {
                id: '',
                nombre: '',
                apellido: '',
                dui: 'Seleccionar'
            },
            // obj con datos de la reservación
            reservacion: {
                fecha: '',
                hora: ''
            }
        }
    },
    mounted() {
        //cargar clientes
        this.cargarClientes();
        //cargar empleados
        this.cargarEmpleados();
        this.getReservacion(this.$route.params.id)
    },
    methods: {
        getCliente() {
            axios.get('http://localhost:3000/api/reservaciones/clientes/' + this.model.reservacion.cliente)
                .then(res => { this.cliente.nombre = res.data.nombres; this.cliente.apellido = res.data.apellidos })
                .catch(e => { console.log(e) });
        },
        getEmpleado() {
            console.log(this.empleado.dui)
            axios.get('http://localhost:3000/api/reservaciones/empleados/' + this.model.reservacion.empleado)
                .then(res => { this.empleado.nombre = res.data.nombres; this.empleado.apellido = res.data.apellidos })
                .catch(e => { console.log(e) })
        },
        //método para obtener los clientes
        cargarClientes() {
            try {
                //hacer petición para obtener clientes
                axios.get('http://localhost:3000/api/reservaciones/clientes')
                    .then(res => {
                        this.clientes = res.data;
                        console.log(this.clientes)
                    }) //obtener los datos de la petición
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
        //metodo para obtener los datos de la reservación seleecionada
        getReservacion(idreservacion) {
            axios.get('http://localhost:3000/api/reservaciones/' + idreservacion)
                .then(res => {
                    //guardar en una constante los datos obtenidos
                    const RESERVACION = res.data;
                    //asignar a cada uno
                    this.model.reservacion = {
                        fecha: RESERVACION.fecha,
                        hora: RESERVACION.hora,
                        cliente: RESERVACION.id_cliente,
                        empleado: RESERVACION.id_empleado
                    }
                    this.cliente = {
                        nombre: RESERVACION.cliente_n,
                        apellido: RESERVACION.cliente_a
                    }
                    this.empleado = {
                        nombre: RESERVACION.empleado_n,
                        apellido: RESERVACION.empleado_a
                    }

                })
                .catch(e => {
                    //validar reservacion inexistente
                    alert(e.response.data.error);
                })
        },
        //método para agregar una reservación
        //método para modificar los datos de la reservación
        modificarReservacion() {
            //obtener idreservacion, del parametro establecido en index de routes ddedl front llamado: 'id'
            let idreservacion = this.$route.params.id;
            //TODO: validar datos

            //realizar petición al servidor
            axios.put('http://localhost:3000/api/reservaciones/' + idreservacion, this.model.reservacion)
                .then(res => {
                    //cuando hay un error 400 que no realizó lo que se debía
                    if (res.data.errir) {
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
                        alert(res.data);
                        this.msg = '';
                        this.$router.push('/reservaciones');
                    }
                })
                .catch(e => { alert(e.response.data.error) });
        }
    }
}
</script>