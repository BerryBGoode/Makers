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
// exportar componente hijo
export default {
    // nombre del componente
    name: 'dashboard',
    components: { sidebar, buscador, cuenta },
    // método que retorna el componente
    data() {
        return {
            datos: ''
        }
    },
    methods: {
        // metodo para asignar el valor de la prop a enviar el valor recibido del buscador
        validateBuscar(now) {
            // enviar datos el componente de la vista
            this.datos = now
        }
    },
}

</script>