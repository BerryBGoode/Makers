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
            <form @submit.prevent="modificarSucursal">
                <div class="form-data mb-30vh">
                    <div class="form-1">
                        <div class="mb-3">
                            <label for="direccion" class="form-label">Direccion</label>
                            <input type="text" class="form-control" id="direccion" required v-model="sucursal.direccion">
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nit" class="form-label">NIT</label>
                                <input type="text" class="form-control" id="nit" required v-model="sucursal.nit">
                            </div>
                            <div class="mb-3 input-container">
                                <label for="nrc" class="form-label">NRC</label>
                                <input type="text" class="form-control" id="nrc" required v-model="sucursal.nrc">
                            </div>
                        </div>
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" required v-model="sucursal.tel">
                            </div>
                            <div class="mb-3 flex-col input-container">
                                <label for="hora" class="form-label">Hora</label>
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
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
// definir componente 
export default {
    name: "crearSucursal",
    data() {
        return {
            sucursal: {
                direccion: '',
                nit: '',
                nrc: '',
                tel: '',
                inicio: '',
                cierre: ''
            },
            msg: ''
        }
    },
    methods: {
        modificarSucursal() {            
            // validar campos vacíos
            if (this.sucursal.direccion && this.sucursal.nit && this.sucursal.nrc && this.sucursal.tel &&
                this.sucursal.inicio && this.sucursal.cierre && (this.sucursal.inicio < this.sucursal.cierre)) {
                // realizar petición
                axios.put('http://localhost:3000/api/sucursales/'+this.$route.params.id, this.sucursal)
                    .then(res => {
                        console.log(res)
                        if (res.data.error) {
                            alert(res.data.error)
                            console.log(res.data.error)
                        } else {
                            alert(res.data);
                            this.$router.push('/sucursales');
                        }

                    })
                    .catch(e => {alert(e); console.log(e)})
            }
            else this.msg = 'No se permiten campos vacíos'
            // validar que la hora tenga lógica
            if (this.sucursal.inicio > this.sucursal.cierre) {
                this.msg = 'Horario ilogico'             
            }
        },
        // método para obtener los datos de una sucursal
        getSucursal() {
            // realizar petición
            
            axios.get('http://localhost:3000/api/sucursales/'+ this.$route.params.id)
                .then(res => {
                    console.log(res.data);
                    const SUCURSAL = res.data;
                    let horario = SUCURSAL.horario.split(' - ');
                    let h_inicio = horario[0].split(' ')[0];
                    let h_cierre = horario[1].split(' ')[0];
                    this.sucursal = {
                        inicio: h_inicio,
                        cierre: h_cierre,
                        nit: SUCURSAL.nit,
                        nrc: SUCURSAL.nrc,
                        direccion: SUCURSAL.direccion,
                        tel: SUCURSAL.telefono
                    }
                })
                .catch(e => {
                    alert(e);
                    console.log(e)
                })
        }
    },
    mounted(){
        this.getSucursal();
    }
}

</script>