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
import { mapState, mapActions } from 'vuex';
import { RouterView } from 'vue-router';
import store from './store/';
import { alertInfo } from './components/alert.vue';


export default {
    name: 'app',
    components: { dashboard, login, cookies, axios, primerUso, store, RouterView },
    data() {
        let storage = window.addEventListener('storage', (e) => {
            if (e.key === 'auth' && e.oldValue !== e.newValue) {
                alertInfo('Acto sospechoso', 'Aceptar', 7500, 'Debido a actividad sospechosa se ha redireccionado')
                this.$router.push('/login');
            }

        })

        return {
            auth: localStorage.getItem('auth'),
            storage: '',
            sucursales: [],
            empleados: [],


        }
    },
    methods: {
        // obtiendo la acción para poder asignar valores a los estados
        // para obtener la acción que asignar valores a el estado sucursales
        ...mapActions(['actionSucursal']),
        // obteniendo la acción para asignar valores al estado empleados
        ...mapActions(['actionEmpleado']),
        // estos métodos asignar el valor a la acción o ejecutan la acción para enviar valores al estado
        setSucursal(data) {
            this.actionSucursal(data)
        },
        setEmpleado(data) {
            this.actionEmpleado(data)
        },
        // método para evaludar sí existe un cookie en el evento padre
        // así ir verificando y actualizar el valor de la cookie cuando exista
        checkTokenCookie() {

        },
        checkTokenStorage() {
            const STORAGE = this.getTokenStorage('auth');
            this.storage = STORAGE !== null;

            this.storage = this.getTokenStorage('auth');

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
                    this.setSucursal(this.sucursales.length);
                    // verificar sí no hay sucursales para redireccionar al login, sino que verificar la cantidad de empleados registrados
                    (this.sucursales.length <= 0) ? this.$router.push('/primer/sucursal') : this.verficarEmpleados()
                }).catch(rej => {
                    console.log(rej);
                })

        },
        verficarEmpleados() {
            axios.get('http://localhost:3000/api/auth/verificar/empleados')
                .then((rows) => {
                    // obtiendo los valores de la petición
                    this.empleados = rows.data;
                    // verificando la existencia de los empleados, para redireccionara primer empleados, 
                    // sino verificar sí hay autenticación para así o redireccionar al login o a inicio
                    (this.empleados.length <= 0) ? this.$router.push('/primer/empleado') : (localStorage.getItem('auth')) ? this.$router.push('/inicio') : this.$router.push('/login')
                }).catch(e => {
                    notificationError(e.reponse.data.error, 7000);
                })
        }
    },
    mounted() {
        // verificar sí existe una cookie cuando cargue el componente         
        this.checkTokenCookie();
        this.verficarEmpleados();
        this.verificarSucursales();
        this.checkTokenStorage();
    },
    watch: {
        // realizar las siguientes acciones cuando se modifique el valor que verífica sí existe una cookie
        // para así identificar que vista mostrar
        // state(now) {
        //     // volver a verificar sí existe la cookie cada 20segundos
        //     setInterval(() => {
        //         this.checkTokenCookie();
        //     }, 10)

        // },

        auth(now, old) {
            console.log(now)
            console.log(old)
        },
        empleado() {
            this.verificarSucursales();
        },

    },
    computed: {
        ...mapState({
            empleado: state => state.empleados,

        }),

    },

}
</script>
