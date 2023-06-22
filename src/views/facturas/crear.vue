<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <h5 class="bold">
                Factura
            </h5>
        </div>
        <hr>
        <div class="container">
            <div class="form-data">
                <span class="bold">
                    Empleado
                </span>
                <form action="" class="form-2">
                    <label for="clientes" class="form-label">DUI</label>
                    <!-- verificar sí existe dui del cliente -->
                    <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                        v-if="clientes.length > 0" v-model="this.model.factura.dui">
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
                            <label for="clientes" class="form-label">Nombres</label>
                            <!-- verificar sí existen nombres recuperados -->
                            <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                v-if="clientes.length > 0" v-model="this.model.clientes.nombres">
                                <option selected disabled>Seleccionar</option>
                                <!-- recorrer los dato del nombre del cliente -->
                                <option v-for="(nombres, i) in clientes" :key="i" :value="nombres.id_clientes">{{
                                    nombres.nombres }}</option>
                            </select>
                            <!-- sino existe ningun nombre -->
                            <select class="form-select mb-3" name="error" v-else>
                                <option selected>No se encontro el nombre </option>
                            </select>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="clientes" class="form-label">Apellidos</label>
                            <!-- verificar sí existen apellidos recuperados -->
                            <select class="form-select mb-3" aria-label="Default select example" id="clientes"
                                v-if="clientes.length > 0" v-model="this.model.clientes.apellidos">
                                <option selected disabled>Seleccionar</option>
                                <!-- recorrer los dato del nombre del cliente -->
                                <option v-for="(apellidos, i) in clientes" :key="i" :value="apellidos.id_clientes">{{
                                    apellidos.apellidos }}</option>
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
            <div class="form-data mb-30vh">
                <span class="bold">
                    Sucursal
                </span>
                <form action="" class="form-2 flex wp sp-bet">
                    <label for="dirección" class="form-label">Dirección</label>
                    <!-- verificar sí existe una dirección -->
                    <select class="form-select mb-3" aria-label="Default select example" id="sucursales"
                        v-if="sucursales.length > 0" v-model="this.model.facturas.sucursal">
                        <option selected disabled>Seleccionar</option>
                        <!-- recorrer los datos de la dirección -->
                        <option v-for="(dirección, i) in sucursales" :key="i" :value="dirección.id_sucursal">{{
                            dirección.dirección }}</option>
                    </select>
                    <!-- sino existen sucursales -->
                    <select class="form-select mb-3" name="error" v-else>
                        <option selected>No se encontraron ninguna Dirección de una sucursal</option>
                    </select>
                </form>
            </div>
            <hr>
            <div class="buttons-reservacion form-data">
                <router-link to="/facturas" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="button" class="btn btn-makers">Agregar</button>
            </div>
        </div>
    </div>
</template>

<script>
// importar axios para realizar peticiones
import axios from 'axios';
// exportar componente
export default {
    // nombre del componente
    name: "crearFactura",
    // funciones que retornará el componente
    data() {
        return {
            // arreglo con info. sucursales
            sucursales: [],
            // arreglo con info. sucursales
            clientes: [],
            model: {
                factura: {
                    dui: 'Seleccionar',
                    nombres: 'Seleccionar',
                    apellidos: 'Seleccionar',
                    Dirección: 'Seleccionar',
                    sucursal: 'Seleccionar',
                }
            },
            // mostrarle al cliente mensajes
            msg: ''
        }
    },
    mounted() {
        // cargar clientes
        this.cargarClientes();
        // cargar sucursales
        this.cargarSucursales();

    },
    // métodos del componente
    methods: {
        // método para obtener las sucursales
        cargarClientes() {
            try {
                // hacer petición para obtener facturas y clientes
                axios.get('http://localhost:3000/api/facturas/clientes')
                    .then(res => { this.sucursales = res.data }) // obtener los datos de la petición
                    .catch(e => { console.log(e) })
            } catch (error) {
                console.error(error);
            }
        },
        // método para obtener la sucursal para la factura
        cargarSucursales() {
            // realizar petición
            axios.get('http://localhost:3000/api/facturas/sucursal')
                // cuando pase todo correctamente
                .then(res => { this.cargos = res.data }) // cuando todo salga correcto asignar valores a arreglo
                .catch(e => { console.error(e) }) // mostrar mensaje de error
        },

        // método para agregar una nueva factura
        crear() {
            // validar datos
            // realizar petición y enviando datos
            axios.post('http://localhost:3000/api/facturas', this.model.factura)
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
                        this.model.factura = {
                            dui: 'Seleccionar',
                            nombres: 'Seleccionar',
                            apellidos: 'Seleccionar',
                            Direccion: 'Seleccionar',
                            sucursal: 'Seleccionar',
                        }
                        // redireccionar
                        alert('Factura agregada')
                        this.$router.push('/facturas');
                    }
                    // console.log(res)

                    // sí la respuesta fue la esperada, redirección a la vista principal
                    // if (res.status === 201) this.$router.push('/empleados');
                })
                .catch(e => { alert(e) });

        }
    }
}





</script>