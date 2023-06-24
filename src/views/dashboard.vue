<style></style>

<template>
    <aside>
        <!-- sidebar component -->
        <sidebar />
    </aside>
    <main>
        <div class="container container-main">
            <!-- división entre buscador -->
            <div class="container container-top">
                <buscador />
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
import buscador from "../components/buscador.vue";
// coomponente de la cuenta
import cuenta from "../components/cuenta.vue";
import { RouterLink, RouterView } from "vue-router";
// exportar componente hijo
export default {
    // nombre del componente
    name: "dashboard",
    components: { sidebar, buscador, cuenta },
    // props que pudiera recibir el componente
    props: {},
    // método que retorna el componente
    data() {
        return {
            text: 'Dashboard de inicio'
        }
    }
}

</script>