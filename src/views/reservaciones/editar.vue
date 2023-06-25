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
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Reservaciones
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="modificarReservacion">
            <div class="container">
                <div class="form-data mb-40vh">
                    <div class="form-1">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="fecha" class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="fecha" v-model="this.model.reservacion.fecha">
                            </div>
                            <div class="mb-3 input-container">
                                <label for="hora" class="form-label">Hora</label>
                                <input type="time" class="form-control" id="hora" v-model="this.model.reservacion.hora">
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="form-data mb-9vh">
                    <span class="bold">
                        Especificaciones
                    </span>

                    <form action="" class="form-2 w-70">
                        <div class="load">
                            <div class="mb-3-input-container">
                                <label for="cliente" class="form-label">Cliente</label>
                                <!-- Verificar si existen clientes -->
                                <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                    v-if="clientes.length > 0" v-model="this.model.reservacion.cliente">
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los datos de los clientes -->
                                    <option v-for="(cliente, i) in clientes" :key="i" :value="cliente.id_cliente">{{
                                        cliente.nombre
                                    }}</option>
                                </select>
                                <!-- si no existen clientes -->
                                <select class="form-select mb-3" name="error" v-else>
                                    <option selected> No se encontraron clientes </option>
                                </select>
                            </div>
                            <div class="mb-3-input-container">
                                <label for="empleado" class="form-label">Empleado</label>
                                <!-- Verificar si existen empleados -->
                                <select class="form-select mb-3" aria-label="Default select example" id="enpleados"
                                    v-if="empleados.length > 0" v-model="this.model.reservacion.empleado">
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los datos de los empleados -->
                                    <option v-for="(empleado, i) in empleados" :key="i" :value="empleado.id_empleado">{{
                                        empleado.nombre }}</option>
                                </select>
                                <!-- si no existen empleados -->
                                <select class="form-select mb-3" name="error" v-else>
                                    <option selected> No se encontraron empleados </option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link to="/reservaciones" class="btn btn-makers">
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
            msg: ''
        }
    },
    mounted() {
        //cargar clientes
        this.cargarClientes();
        //cargar empleados
        this.cargarEmpleados();
        //cargar reservación solicitada para obtener parametro id de la url
        this.getReservacion(this.$route.param.id);
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