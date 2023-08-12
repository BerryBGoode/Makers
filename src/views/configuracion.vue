<style>
.mb-14vh {
    margin-bottom: 14vh;
}
</style>

<template>
    <div class="container servicios component-servicio h-100">
        <div class="top">
            <h5 class="bold">
                Configuración
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <form @submit.prevent="modificar" class="container">
            <div class="form-data">
                <span class="bold">
                    info.
                    Personal
                </span>
                <div class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres" v-model="empleado.nombres">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" v-model="empleado.apellidos">
                        </div>
                    </div>
                    <label for="dui">DUI</label>
                    <input type="text" class="form-control" id="dui" v-model="empleado.dui">
                </div>
            </div>
            <hr>

            <div class="form-data">
                <span class="bold">
                    Contacto
                </span>
                <div class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="telefono" v-model="empleado.telefono">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" v-model="empleado.correo">
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="form-data mb-14vh">
                <span class="bold">
                    Cuenta
                </span>

                <div class="form-2 w-70">

                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="alias" class="form-label">Alias</label>
                            <input type="text" class="form-control" id="alias" v-model="empleado.alias" maxlength="50" required>
                        </div>
                        <div class="mb-3 input-container">
                            <label for="clave" class="form-label">Nueva contraseña</label> <label class="form-label">*no
                                obligatorio</label>
                            <input type="password" class="form-control" id="clave" v-model="empleado.clave">
                        </div>


                    </div>
                </div>

            </div>
            <hr>
            <div class="buttons-reservacion form-data padding-buttons">
                <button type="button" @click.prevent="cerrarSesion" class="btn btn-makers">Cerrar sesión</button>
                <button type="button" @click="back" class="btn btn-makers">Volver </button>
                <button type="submit" class="btn btn-makers">Agregar cambios</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import cookies from 'vue-cookies';
import { mapState, mapActions } from 'vuex';
// exportar componente
export default {
    name: 'configuracion',
    data() {
        return {
            
            empleado: {
                nombres: '',
                apellidos: '',
                dui: '',
                telefono: '',
                correo: '',
                clave: '',
                alias: ''
            },
            config: {
                headers: {
                    authorization: this.$cookies.get('auth')
                }
            },
            msg: '',
            lastpath: '',
        }
    },
    methods: {
        ...mapActions(['actionUsuario']),
        setUsuario(usuario) {
            this.actionUsuario(usuario);
        },
        cerrarSesion() {
            if (confirm('Desea cerrar sesión?')) {
                this.$cookies.remove('auth');
                localStorage.removeItem('auth')
            }
        },
        // método para redireccionar a página anterior
        back() {
            // redireccionar a página anterior
            this.$router.go(-1);
        },
        getEmpleado() {
            axios.get('http://localhost:3000/api/auth/config', this.config)
                .then(res => {
                    // obtener datos
                    let empleado = res.data;
                    // asignar                    
                    this.empleado = {
                        alias: empleado.alias,
                        nombres: empleado.nombres,
                        apellidos: empleado.apellidos,
                        correo: empleado.correo,
                        dui: empleado.dui,
                        telefono: empleado.telefono
                    }
                })
        },
        modificar() {
            axios.put('http://localhost:3000/api/auth/', this.empleado, this.config)
                .then(res => {
                    if (res.data.error) {
                        this.msg = res.data.error;

                        // console.log(res.data)
                    }
                    this.setUsuario(this.empleado.alias)
                    // cuando si se realizo la tarea deceada y se creo algo 
                    // 201 es usado en método post y put
                    if (res.status === 201 && !res.data.error) {
                        // limpiar valores 
                        this.empleado = {
                            alias: '',  
                            nombres: '',
                            apellidos: '',
                            dui: '',
                            telefono: '',
                            correo: '',
                            clave: '',
                        }
                        // redireccionar

                        this.msg = '';
                        this.$router.push('/');
                        // emitir info que se modifico algo, a componente de cuenta
                    }

                    alert(res.data)
                })
                .catch(e => {
                    console.log(e);
                })
        }
    },
    mounted() {
        this.getEmpleado();
    },    
} 
</script>