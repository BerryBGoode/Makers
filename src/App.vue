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

<!-- espacio para las plantillas -->
<template>
    <!-- verificar sí no existen una autenticación -->
    <template v-if="!auth">
        <!-- getCookie es evento donde se enviando datos al componente padre -->
        <login @getCookie="validateCookie" />
    </template>
    <template v-else>
        <dashboard />
    </template>
</template>


<!-- setup solo se utiliza en el componente principal,
  para comprimir el código, porque es el que almacena más contenido
-->
<script>
import cookies from 'vue-cookies';
import dashboard from './views/dashboard.vue';
import login from './views/login.vue'
// espacio para importar componentes hijos
export default {
    name: 'app',
    components: { dashboard, login },
    data() {
        return {
            auth: '',
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
        checkCookie() {
            // obtener el valor de la cookie para autenticación
            const COOKIE = this.getCookie('auth');
            // asignar el valor de la cookie el elemento que se evalua para mostrar la vista
            // de login o dashboard, síno tiene valor le asignará null para mostrar login
            this.auth = COOKIE !== null;
        },
        // método para obtener el valor de la cookie
        getCookie(cookie) {
            return this.$cookies.get(cookie);
        }
    },
    mounted() {
        // verificar sí existe una cookie cuando cargue el componente         
        this.checkCookie();
    },
    watch: {
        // realizar las siguientes acciones cuando se modifique el valor que verífica sí existe una cookie
        // para así identificar que vista mostrar
        auth(now) {
            // verificar sí el valor fue modificado
            if (now) {
                // volver a verificar sí existe la cookie cada 20segundos
                setTimeout(() => {
                    this.checkCookie();
                }, 25000);
            }
        }
    }
}
</script>
