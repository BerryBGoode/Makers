<style scoped>
.component-render {
    height: 100%;
    position: relative;
}

.buttons-servicio {
    position: absolute !important;
    bottom: 0;
    width: 100%;
}

.mb-39vh {
    margin-bottom: 39vh;
}

.form-1 {
    width: 100%;
}

.form-100 {
    height: 100%;
}
</style>
<template>
    <div class="container servicios component-servicio component-render relative">
        <div class="top">
            <h5 class="bold">
                Servicio
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form class="form-100" @submit.prevent="agregarServicio">
            <div class="container agg-servicio">
                <div class="form-data mb-39vh">
                    <div action="" class="form-1">
                        <div class="load">
                            <div class="mb-3 input-container-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input v-model="servicio.nombre" autocomplete="off" type="text" class="form-control"
                                    id="nombre" required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="precio" class="form-label">Precio</label>
                                <input v-model="servicio.precio" autocomplete="off" type="text" class="form-control"
                                    id="precio" required>
                            </div>
                            <div class="mb-3 input-container-3">
                                <label for="" class="form-label">Tipo de servicio</label>
                                <!-- caso donde existan más de 0 tipos de servicios -->
                                <select class="form-select mb-3" v-if="tipos.length > 0" v-model="servicio.tipo"
                                    @change="cargarServicios" id="tipoServicio">
                                    <option selected disabled>Seleccionar</option>
                                    <option v-for="(tipo, i) in tipos" :key="i" :value="tipo.id_tipo_servicio"
                                        class="option" v-text="tipo.tipo_servicio"></option>
                                </select>
                                <!-- caso default-->
                                <select class="form-select mb-3" v-else>
                                    <option selected>No se encontraron tipos de servicio</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input v-model="servicio.descripcion" autocomplete="off" type="text" class="form-control"
                                id="descripcion" required>
                        </div>
                    </div>
                    <hr>
                </div>
                <hr>
                <div class="buttons-reservacion buttons-servicio form-data">
                    <router-link to="/servicios" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import store from '../../store';
import { notificationError, notificationInfo, notificationSuccess } from '../../components/alert.vue';
import { onlyLtrs, onlyNumb } from '../../validator';

// definir componente 
export default {
    name: 'crearServicio',
    data() {
        return {
            servicio: {
                // entidades de la tabla, que se modificarán desde los inputs
                tipo: 'Seleccionar',
                nombre: '',
                descripcion: '',
                precio: '',
                existencias: 1,
            },
            tipos: [],
            msg: ''
        }
    },
    methods: {
        getTiposServicios() {
            axios.get('http://localhost:3000/api/servicios/tipos', store.state.config)
                .then(res => this.tipos = res.data)
                .catch(e => console.log(e));
        },
        agregarServicio() {
            // validar datos 
            if (!onlyLtrs(this.servicio.descripcion) || !onlyLtrs(this.servicio.nombre)) {
                notificationInfo('Solo se permiten letras');
            }
            else if (!onlyNumb(this.servicio.existencias)) {
                notificationInfo('Solo se permiten número para existencias');
            }
            else if (this.servicio.descripcion && this.servicio.existencias && this.servicio.nombre &&
                this.servicio.precio && (this.servicio.tipo !== 'Seleccionar')) {
                // realizar petición
                axios.post('http://localhost:3000/api/servicios/', this.servicio, store.state.config)
                    .then(res => {
                        notificationSuccess(res.data);
                        // limpiar campos
                        this.servicio = {
                            tipo: 'Seleccionar',
                            nombre: '',
                            descripcion: '',
                            precio: '',
                            existencias: 1,
                        }
                        // redireccionar
                        this.$router.push('/servicios');
                    })
                    .catch(e => { notificationError(e.response.data); })
            } else {
                this.msg = 'No se permiten campos vacíos'
            }
        }
    },
    mounted() {
        this.getTiposServicios();
    }
}

</script>