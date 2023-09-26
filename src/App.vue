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
    <load v-if="!isloadempleados || !isloadsucursales" />
    <router-view v-else />
</template>
<script>
//  setup solo se utiliza en el componente principal,
//   para comprimir el código, porque es el que almacena más contenido

import cookies from 'vue-cookies';
import dashboard from './views/dashboard.vue';
import login from './views/login.vue';
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { RouterView } from 'vue-router';
import store from './store/';
import { alertInfo, notificationError } from './components/alert.vue';
import load from './components/load.vue';


export default {
    name: 'app',
    components: { dashboard, login, RouterView, load, store },
    data() {
        // validaciones del DOM

        // validar que cuando se modifique o elimine el storage redireccionar al login 
        let state = window.addEventListener('storage', e => {
            if (e.key === 'auth' && e.oldValue !== e.newValue) {
                this.$router.push('/login')
                alertInfo('Acto sospechoso', 'Aceptar', 7500, 'Debido a actividad sospechosa se ha redireccionado')
            }
        })
        // validar que no se puedan hacer algunas acciones en los inputs
        window.addEventListener('keyup', event => {
            // verificar sí el input es de tipo password 
            if (event.target.type === 'password') {
                event.target.value = event.target.value.trim();
            }
        })
        // evento que previene que el usuario pueda utilizar la tecla ctrl en los inputs
        window.addEventListener('keydown', event => {
            // validar que desahiblite la tecla ctrl
            if (event.ctrlKey) {
                // Deshabilitar la tecla Ctrl
                event.preventDefault();
                return;
            }
        })

        return {
            auth: localStorage.getItem('auth'),
            storage: '',
            sucursales: [],
            empleados: [],
            state,
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
    },
    mounted() {
        // verificar sí existe una cookie cuando cargue el componente         
        this.checkTokenStorage();
    },
    computed: {
        ...mapState({
            isloadempleados: state => state.empleadosload,
            isloadsucursales: state => state.sucursalesload
        })
    }

}
</script>
