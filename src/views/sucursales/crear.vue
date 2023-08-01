<style>
.w-45 {
    width: 45%;
}

.mb-30vh {
    margin-bottom: 30vh;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Sucursal
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container agg-servicio">
            <form @submit.prevent="agregarSucursal">
                <div class="form-data mb-30vh">
                    <div class="form-1">
                        <div class="mb-3">
                            <label for="direccion" class="form-label">Direccion</label>
                            <input type="text" class="form-control" id="direccion" required v-model="sucursal.direccion">
                        </div>

                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" required v-model="sucursal.nombre">
                        </div>

                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" required v-model="sucursal.tel">
                            </div>
                            <div class="mb-3 flex-col input-container">
                                <label for="hora" class="form-label">Horario</label>
                                <div class="load">
                                    <input type="time" name="" id="apertura" class="form-control w-45" required
                                        v-model="sucursal.inicio">
                                    <input type="time" name="" id="cierre" class="form-control w-45" required
                                        v-model="sucursal.cierre">
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
                <hr>
                <div class="buttons-reservacion buttons-servicio form-data">
                    <router-link to="/sucursales" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { onlyLtrs } from '../../validator'
// definir componente 
export default {
    name: "crearSucursal",
    data() {
        return {
            sucursal: {
                direccion: '',
                nombre: '',
                tel: '',
                inicio: '',
                cierre: ''
            },
            msg: ''
        }
    },
    methods: {
        agregarSucursal() {

            // validar que la hora tenga lógica
            if (this.sucursal.inicio > this.sucursal.cierre) {
                this.msg = 'Horario ilogico'
            }
            else if (this.sucursal.direccion && this.sucursal.tel && onlyLtrs(this.sucursal.nombre) &&
                this.sucursal.inicio && this.sucursal.cierre) {
                // realizar petición
                axios.post('http://localhost:3000/api/sucursales/', this.sucursal)
                    .then(res => {
                        if (res.data.error) {
                            alert(res.data.error)
                            console.log(res.data.error)
                        } else {
                            alert(res.data);
                            this.$router.push('/sucursales');
                        }

                    })
            }
            else this.msg = 'No se permiten campos vacíos'
        }
    }
}

</script>