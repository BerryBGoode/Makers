<style>
.component-render {
    height: 100%;
}


.form-1 {
    width: 100%;
}

.w-25 {
    width: 25%;
}

.mb-40vh {
    margin-bottom: 40vh !important;
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
// exportar componente
export default {
    name: 'editarSucursal',
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
        //cargar reservación solicitada para obtener parametro id de la url
        this.getReservacion(this.$route.params.id);
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
        //metodo para obtener los datos de la reservación seleecionada
        getReservacion(idreservacion) {
            axios.get('http://localhost:3000/api/reservaciones/' + idreservacion)
                .then(res => {
                    //guardar en una constante los datos obtenidos
                    const RESERVACION = res.data[0];
                    //asignar a cada uno
                    this.model.reservacion = {
                        fecha: RESERVACION.fecha,
                        hora: RESERVACION.hora,
                        cliente: RESERVACION.id_cliente,
                        empleado: RESERVACION.id_empleado
                    }
                    console.log(RESERVACION)
                })
                .catch(e => {
                    //validar reservacion inexistente
                    alert(e);
                })
        },
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
                        alert('Empleado modificado')
                        this.msg = '';
                        this.$router.push('/reservaciones');
                    }
                })
                .catch(e => { alert(e) });
        }
    }
}
</script>