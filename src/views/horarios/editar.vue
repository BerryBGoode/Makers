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
            <form @submit.prevent="modificarHorario">
                <div class="form-data mb-52vh">
                    <div action="" class="form-1">
                        <div class="load">
                            <div class="mb-3 flex-col input-container">
                                <label for="apertura" class="form-label">Apertura</label>
                                <input type="time" name="apertura" id="apertura" class="form-control"
                                    v-model="horario.inicio" required>
                            </div>
                            <div class="mb-3 flex-col input-container">
                                <label for="cierre" class="form-label">Cierre</label>
                                <input type="time" name="cierre" id="cierre" class="form-control" required
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
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
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
        getHorario() {
            axios.get('http://localhost:3000/api/horarios/' + this.$route.params.id)
                .then(res => {
                    // cargar los datos
                    this.msg = '';
                    this.horario.cierre = res.data.cierre;
                    this.horario.inicio = res.data.inicio;

                  
                })
                .catch(e => {alert(e.response.data.error); console.log(e)})
        },
        modificarHorario() {
            // verificar que el horario de inicio sea menor al de cierre y que ambos tengan algún valor
            if (this.horario.inicio < this.horario.cierre && (this.horario.inicio && this.horario.cierre)) {
                // realizar petición
                axios.put('http://localhost:3000/api/horarios/'+ this.$route.params.id, this.horario)
                    .then(res => {
                        // verificar síno hay errores
                        if (!res.data.error) {
                            alert(res.data);
                            this.horario = {
                                inicio: '',
                                cierre: '',
                            },
                                this.msg = '';
                            this.$router.push('/horarios');
                        }
                    })
                    .catch(e => { alert(e.response.data.error); console.log(e) });

            } else {
                this.msg = 'Horario ilogico';
            }
        }
    },
    mounted() {
        this.getHorario();
    }
}

</script>