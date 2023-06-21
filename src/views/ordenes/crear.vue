<style>
.info-orden{
    margin-bottom: 26.5vh;
}
</style>
<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <h5 class="bold">
                Orden
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
                     <!-- verificar sí existe dui del cliente -->
                    <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                    v-if="dui.length > 0" v-model="this.model.ordenes.dui">
                                    <option selected disabled>Seleccionar</option>
                                   <!-- recorrer los datos de clientes -->
                                    <option v-for="(dui, i) in clientes" :key="i" :value="dui.id_clientes">{{
                                        dui.dui }}</option>
                                </select>
                           <!-- sino existe el dui del cliente -->
                                <select class="form-select mb-3" name="error" v-else>
                                    <option selected>No se encontro el dui del cliente</option>
                                </select>

                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <!-- verificar sí existen nombres recuperados -->
                            <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                    v-if="nombres.length > 0" v-model="this.model.clientes.nombres">
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los dato del nombre del cliente -->
                                    <option v-for="(nombres, i) in clientes" :key="i" :value="cargo.id_clientes">{{
                                        cargo.cargo }}</option>
                                </select>
                              <!-- sino existe ningun nombre -->
                              <select class="form-select mb-3" name="error" v-else>
                                    <option selected>No se encontro el nombre </option>
                                </select>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                           <!-- verificar sí existen apellidos recuperados -->
                           <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                    v-if="apellidos.length > 0" v-model="this.model.clientes.apellidos">
                                    <option selected disabled>Seleccionar</option>
                                    <!-- recorrer los dato del nombre del cliente -->
                                    <option v-for="(apellidos, i) in clientes" :key="i" :value="cargo.id_clientes">{{
                                        cargo.cargo }}</option>
                                </select>
                              <!-- sino existe ningun apellido-->
                              <select class="form-select mb-3" name="error" v-else>
                                    <option selected>No se encontro el apellido </option>
                                </select>
                        </div>
                    </div>
                </form>
            </div>
            <hr>
            <div class="form-data info-orden">
                <span class="bold">
                    info. Orden
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



// exportar componente
export default {
    name: 'ordenes',
    data() {
        return {
            // arreglo con info. clientes
            clientes: [],
            // arreglo para obtener datos de horarios
            dui: [],
            nombres: [],
            apellidos: [],
            model: {
                ordenes: {
                    fecha: '',
                    hora: '',
                    dui: 'Seleccionar',
                    nombres: 'Seleccionar',
                    apellidos: 'Seleccionar',
                }
            },
            // mostrarle al cliente mensajes
            msg: ''
        }
    },
    mounted() {
        // cargar sucursales
        this.cargarClienteDui();
        // cargar horarios
        this.cargarObtenerClientes();
    },
    methods: {
        // método para obtener el dui del cliente
        cargarClienteDui() {
            try {
                // hacer petición para obtener dui de clientes
                axios.get('http://localhost:3000/api/ordenes/clientes')
                    .then(res => { this.clientedui = res.data }) // obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener los apellidos y Nombre del Cliente mediante su Dui
        cargarObtenerClientes() {
            try {
                // realizar petición
                axios.get('http://localhost:3000/api/ordenes/clientes')
                    .then(res => { this.clientes = res.data; console.log(res.data) }) //obtener los datos de la petición
                    .catch(e => { console.log(e) }) // caso de error
            } catch (error) {
                console.error(error);
            }
        },

        // método para agregar una nueva orden
        crear() {
            // validar datos
            // realizar petición y enviando datos
            axios.post('http://localhost:3000/api/ordenes', this.model.ordenes)
                .then(res => {
                    // cuando hay un error 400 que no realizo lo que se debía
                    if (res.data.error) {
                        this.msg = 'Error con algún dato enviado';
                        // console.log(res.data)
                    }
                    // cuando si se realizo la tarea deceada y se creo algo 
                    // 201 es usado en método post y put
                    if (res.status === 201 && !res.data.error) {
                        // limpiar valores 
                        this.model.ordenes = {
                            fecha: '',
                            hora: '',
                            dui: 'Seleccionar',
                            nombres: 'Seleccionar',
                            apellidos: 'Seleccionar',
                        }
                        // redireccionar
                        alert('orden agregada')
                        this.$router.push('/ordenes');
                    }
                    // console.log(res)

                    // sí la respuesta fue la esperada, redirección a la vista principal
                    // if (res.status === 201) this.$router.push('/ordenes');
                })
                .catch(e => { alert(e) });

        }
    }
} 

</script>