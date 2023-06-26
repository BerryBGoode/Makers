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
            <div class="form-data">
                <span class="bold">
                    Cliente
                </span>
                <form action="" class="form-2">
                    <label for="">DUI</label>
                    <select class="form-select mb-3" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" @focus="ValidityState" id="nombres"
                                v-model="cliente.nombre" readonly>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" v-model="cliente.apellido" readonly>
                        </div>
                    </div>
                </form>
            </div>
            <hr>
            <div class="form-data">
                <span class="bold">
                    Empleado
                </span>
                <form action="" class="form-2">
                    <label for="">DUI</label>
                    <select class="form-select mb-3" aria-label="Default select example">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
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
                </form>
            </div>
            <hr>
            <div class="form-data">
                <span class="bold">
                    Reservación
                </span>
                <form action="" class="form-2 flex wp sp-bet">
                    <div class="mb-3 flex-col input-container">
                        <label for="">Fecha</label>
                        <input type="date" name="" id="" class="form-control">
                    </div>
                    <div class="mb-3 flex-col input-container">
                        <label for="">Hora</label>
                        <input type="time" name="" id="" class="form-control">
                    </div>
                </form>
            </div>
            <hr>
            <div class="buttons-reservacion form-data">
                <router-link to="/reservaciones" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="button" class="btn btn-makers">Agregar</button>
            </div>
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
                hora: ''
            }
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
                .catch(e => { alert(e) });
        }
    }
}
</script>