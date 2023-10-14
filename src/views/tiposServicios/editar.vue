<style>
.mb-50vh {
    margin-bottom: 50vh;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Tipo de servicio
            </h5>
            <span> {{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container agg-servicio">
            <div class="form-data mb-50vh">
                <form action="" class="form-1">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Tipo de servicio</label>
                        <input type="text" autocomplete="off" class="form-control" id="tipo" v-model="tipos.tipo" required>
                    </div>
                </form>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/servicios/tipos" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import { onlyLtrs } from '../../validator'
import store from '../../store'
import { notificationError, notificationInfo, notificationSuccess } from '../../components/alert.vue'
// definir componente 
export default {
    name: "crearTipoServicio",
    data() {
        return {
            tipos: {
                tipo: ''
            },
            msg: ''
        }
    },
    methods: {
        modificar() {
            if (!onlyLtrs(this.tipos.tipo)) {
                notificationInfo('Solo se permiten letras');
            } else {
                axios.put('http://localhost:3000/api/tipos/' + this.$route.params.id, this.tipos, store.state.config)
                    .then(res => {
                        notificationSuccess(res.data);
                        this.$router.push('/servicios/tipos');
                    })
                    .catch(e => {
                        notificationError(e.response.data);
                    })
            }
        },
        getTipo() {

            // obtener de la ruta el parametro llamada id
            axios.get('http://localhost:3000/api/tipos/' + this.$route.params.id, store.state.config)
                .then(res => {
                    this.tipos = {
                        tipo: res.data.tipo_servicio
                    };
                })
                .catch(e => {
                    notificationError(e.response.data);
                })
        }
    },
    mounted() {
        this.getTipo();
    }
}

</script>