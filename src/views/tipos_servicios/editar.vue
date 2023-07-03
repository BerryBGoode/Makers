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
                        <input type="text" class="form-control" id="tipo" v-model="tipos.tipo" required>
                    </div>
                </form>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/servicios/tipos" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="submit" class="btn btn-makers">Agregar</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import { onlyLtrs } from '../../validator'
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
                this.msg = 'Solo se permiten letras'
            } else {
                axios.put('http://localhost:3000/api/tipos/' + this.$route.params.id, this.tipos)
                    .then(res => {
                        if (res.data.error) {
                            alert(res.data.error)
                        } else {
                            alert(res.data);
                            this.$router.push('/servicios/tipos');
                        }
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        },
        getTipo() {

            // obtener de la ruta el parametro llamada id
            axios.get('http://localhost:3000/api/tipos/' + this.$route.params.id)
                .then(res => {
                    this.tipos = {
                        tipo: res.data.tipo_servicio
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    },
    mounted() {
        this.getTipo();
    }
}

</script>