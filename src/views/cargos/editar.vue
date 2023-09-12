<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Cargo
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container agg-servicio">
            <div class="form-data mb-50vh">
                <div class="form-1">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Cargo</label>
                        <input type="text" class="form-control" id="nombre" v-model="cargo.cargo" required>
                    </div>
                </div>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/empleados/cargos" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import { onlyLtrs } from '../../validator';
import store from '../../store';
import { notificationSuccess, notificationError } from '../../components/alert.vue'
// definir componente 
export default {
    name: "crearCargo",
    data() {
        return {
            cargo: {
                cargo: '',
                id_cargo: ''
            },
            msg: ''
        }
    },
    mounted() {
        this.getCargo();
    },
    methods: {
        modificar() {
            if (!onlyLtrs(this.cargo.cargo)) {
                this.msg = 'Solo se permiten letras'
            } else {
                axios.put('http://localhost:3000/api/cargos/' + this.$route.params.id, this.cargo, store.state.config)
                    .then(res => {
                        if (res.data.error) this.msg = res.data.error;
                        else {
                            notificationSuccess(res.data, 2500);
                            this.$router.push('/empleados/cargos');
                        }
                    })
                    .catch(e => {
                        notificationError(e.response);
                    })
            }
        },
        getCargo() {
            axios.get('http://localhost:3000/api/cargos/' + this.$route.params.id, store.state.config)
                .then(res => {
                    this.cargo = res.data
                })
                .catch(e => {
                    notificationError(e);
                })
        }
    }

}

</script>