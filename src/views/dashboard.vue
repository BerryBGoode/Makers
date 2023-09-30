<style scoped>
.content {
    margin-top: 3vh;
    height: 87vh;
}
</style>

<template>
    <aside>

        <sidebar />
    </aside>
    <main>
        <div class="container container-main">
            <div class="container container-top">
                <buscador @getBuscar="validateBuscar" />
                <cuenta />
            </div>
            <div class="content container">
                <RouterView />
            </div>
        </div>
    </main>
</template>
<script>
// componente sidebar
import sidebar from '../components/sidebar.vue';
// componente buscador
import buscador from '../components/buscador.vue';
// coomponente de la cuenta
import cuenta from '../components/cuenta.vue';
import { RouterLink, RouterView } from 'vue-router';
import { notificationInfo } from '../components/alert.vue';
// exportar componente hijo
export default {
    // nombre del componente
    name: 'dashboard',
    components: { sidebar, buscador, cuenta },
    // método que retorna el componente
    data() {
        return {
            datos: '',
            //Define una variable para almacenar el temporizador del usuario
            inactividad: null,
        }
    },
    created() {
        //Crear evento para detectar actividad del usuario
        // window.addEventListener('mousemove', this.reinicioContador);
        // window.addEventListener('keydown', this.reinicioContador);

        //inicia el contador de actividad
        // this.iniciarContador();
    },

    beforeDestroy() {
        //linpiar los eventos antes de destruir el componente
        // window.removeEventListener('mousemove', this.reinicioContador);
        // window.removeEventListener('keydown', this.reinicioContador);
    },
    methods: {
        // metodo para asignar el valor de la prop a enviar el valor recibido del buscador
        validateBuscar(now) {
            // enviar datos el componente de la vista
            this.datos = now
        },
        //Funcion para reiniciar el temporizador de inactividad
        reinicioContador() {
            clearTimeout(this.inactividad);
            this.iniciarContador();
        },
        //funcion para iniciar el temporizador de inactividad
        iniciarContador() {
            this.inactividad = setTimeout(() => {
                //Logica para cerrar sesion automaticamente
                //por inactividad se redirige al login y se cierra sesion
                // remover token de autenticación
                localStorage.clear();
                this.$router.push('/login');
                notificationInfo('Sesion cerrada por inactividad.');
            }, 300000)
        }
    },
}

</script>