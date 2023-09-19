<style>
.mb-52vh {
    margin-bottom: 52vh;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Horario
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container agg-servicio">
            <form @submit.prevent="agregarHorario">
                <div class="form-data mb-52vh">
                    <div action="" class="form-1">
                        <div class="load">
                            <div class="mb-3 flex-col input-container">
                                <label for="apertura" class="form-label">Apertura</label>
                                <input type="time" autocomplete="off" name="apertura" id="apertura" class="form-control"
                                    v-model="horario.inicio" required>
                            </div>
                            <div class="mb-3 flex-col input-container">
                                <label for="cierre" class="form-label">Cierre</label>
                                <input type="time" autocomplete="off" name="cierre" id="cierre" class="form-control" required
                                    v-model="horario.cierre">
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
                <hr>
                <div class="buttons-reservacion buttons-servicio form-data">
                    <router-link to="/horarios" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import store from '../../store';
import { notificationError, notificationSuccess } from '../../components/alert.vue';
// definir componente 
export default {
    name: "crearHorario",
    data() {
        return {
            horario: {
                inicio: '',
                cierre: '',
            },
            msg: ''
        }
    },
    methods: {
        agregarHorario() {
            // verificar que el horario de inicio sea menor al de cierre y que ambos tengan algún valor
            if (this.horario.inicio < this.horario.cierre && (this.horario.inicio && this.horario.cierre)) {
                // realizar petición
                axios.post('http://localhost:3000/api/horarios/', this.horario, store.state.config)
                    .then(res => {
                        notificationSuccess(res.data);
                        this.horario = {
                            inicio: '',
                            cierre: '',
                        };
                        this.msg = '';
                        this.$router.push('/horarios');

                    })
                    .catch(e => { notificationError(e.respose.data); console.log(e) });

            } else {
                this.msg = 'Horario ilogico';
            }
        }
    }
}

</script>