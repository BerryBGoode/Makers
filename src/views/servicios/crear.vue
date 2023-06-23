<style>
.component-render {
    height: 100%;
}

.buttons-servicio {
    position: relative;
    bottom: 0;
}

.mb-39vh {
    margin-bottom: 39vh;
}

.form-1 {
    width: 100%;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Servicio
            </h5>
        </div>
        <hr>
        <div class="container agg-servicio">
            <div class="form-data mb-39vh">
                <form action="" class="form-1">
                    <div class="load">
                        <div class="mb-3 input-container-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input v-model="servicio.nombre" type="text" class="form-control" @focus="ValidityState"
                                id="nombre">
                        </div>
                        <div class="mb-3 input-container-3">
                            <label for="precio" class="form-label">Precio</label>
                            <input v-model="servicio.precio" type="text" class="form-control" id="precio">
                        </div>
                        <div class="mb-3 input-container-3">
                            <label for="" class="form-label">Tipo de servicio</label>
                            <!-- caso donde existan más de 0 tipos de servicios -->
                            <select class="form-select mb-3" v-if="tipos.length > 0" v-model="servicio.tipo"
                                @change="cargarServicios" id="tipoServicio">
                                <option selected disabled>Seleccionar</option>
                                <option v-for="(tipo, i) in tipos" :key="i" :value="tipo.id_tipo_servicio" class="option"
                                    v-text="tipo.tipo_servicio"></option>
                            </select>
                            <!-- caso default-->
                            <select class="form-select mb-3" v-else>
                                <option selected>No se encontraron tipos de servicio</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <input v-model="servicio.descripcion" type="text" class="form-control" id="descripcion">
                    </div>
                </form>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/servicios" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="button" class="btn btn-makers">Agregar</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

// definir componente 
export default {
    name: "crearServicio",
    data() {
        return {
            servicio: {
                // entidades de la tabla, que se modificarán desde los inputs
                tipo: 'Seleccionar',
                nombre: '',
                descripcion: '',
                precio: '',
                existencias: 1,
                estado: 1
            },
            tipos: []
        }       
    },
    methods : {
        getServicios(){
            axios.get('http://localhost:3000/api/servicios/tipos')
                .then(res => this.tipos = res.data)
                .catch(e => console.log(e));
        }
    },
    mounted() {
        this.getServicios();
    }
}

</script>