<!-- El scoped solo se utiliza en el componenete principal para comprimir estos estilos
y asi hacer menos pesado el componente principal a renderizar -->
<style scoped>
/* espacio para los estilos */
aside {
    float: left;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 1.5em;

    padding: 1.5%;
    height: 100%;
}

main {
    background: #393534;
    margin: 5px 5px 5px 12.7%;
    width: 100vw;
    height: fit-content;
    border-radius: 30px;
    z-index: 100;
}

.container-main {
    width: 100vw;
    height: 98.7vh;
    padding: 1% 1% 1% 1%;
}

.container-top {
    height: 5.5%;
    display: flex;
    gap: 2%;
}

.h-100 {
    height: 100%;
}
</style>


<template>
    <!-- <template v-if="access === null">
        <login />
    </template>
    <template v-else>
        <dashboard />
    </template> -->
    <router-view />
</template>
<script>
//  setup solo se utiliza en el componente principal,
//   para comprimir el código, porque es el que almacena más contenido

import cookies from 'vue-cookies';
import dashboard from './views/dashboard.vue';
import login from './views/login.vue';
import axios from 'axios';
import primerUso from './views/primerUso.vue';
import { mapState } from 'vuex';
import { RouterView } from 'vue-router';
import store from './store/';


export default {
    name: 'app',
    components: { dashboard, login, cookies, axios, primerUso, store, RouterView },
    data() {

        let state = store.state.access;
        return {
            auth: '',
            storage: '',
            sucursales: [],
            empleados: [],
            access: state
        }
    },
    methods: {
        // método del evento del login para evaluar 
        // cuando se crea la cookie
        validateCookie() {
            this.auth = true;
        },
        // método para evaludar sí existe un cookie en el evento padre
        // así ir verificando y actualizar el valor de la cookie cuando exista
        checkTokenCookie() {
            // obtener el valor de la cookie para autenticación
            const COOKIE = this.getCookie('auth');
            // asignar el valor de la cookie el elemento que se evalua para mostrar la vista
            // de login o dashboard, síno tiene valor le asignará null para mostrar login
            this.auth = COOKIE !== null;
        },
        chechTokenStorage() {
            const STORAGE = this.getTokenStorage('auth');
            this.storage = STORAGE !== null;
        },
        // método para obtener el valor de la cookie
        getCookie(cookie) {
            return this.$cookies.get(cookie);
        },
        getTokenStorage(token) {
            return localStorage.getItem(token)
        },
        verificarSucursales() {
            axios.get('http://localhost:3000/api/auth/verificar/sucursal')
                .then(rows => {
                    // guardar las sucursales encontradas
                    this.sucursales = rows.data;
                }).catch(rej => {
                    console.log(rej);
                })

        },
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificar/empleados')
                .then((rows) => {
                    this.empleados = rows.data;

                    // (this.empleados.length <= 0) ? alertInfo('Se ha detectado la inexistencia de empleados y sucursales', 'Aceptar')
                    // : alertInfo('Se ha detectado la inexistencia de empleados', 'Aceptar')
                }).catch(e => {
                    notificationError(e.reponse.data.error, 7000);
                })
        }
    },
    mounted() {
        // verificar sí existe una cookie cuando cargue el componente         
        this.checkTokenCookie();
        this.chechTokenStorage();
        this.verficarEmpleados();
        this.verificarSucursales();
    },
    watch: {
        // realizar las siguientes acciones cuando se modifique el valor que verífica sí existe una cookie
        // para así identificar que vista mostrar
        auth(now) {
            // verificar sí el valor fue modificado
            if (now) {
                // volver a verificar sí existe la cookie cada 20segundos
                setInterval(() => {
                    this.checkTokenCookie();
                }, 10)
            }
        },
        empleado() {
            this.verificarSucursales();
            this.verficarEmpleados();
        },

    },
    computed: {
        ...mapState({
            empleado: state => state.empleados,
        }),

    },

}
</script>
