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
    <template v-if="token">
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
    <template v-else>
        <login />
    </template>
</template>


<!-- setup solo se utiliza en el componente principal,
  para comprimir el código, porque es el que almacena más contenido
-->
<script>
// componente sidebar
import sidebar from "./components/sidebar.vue";
// componente buscador
import buscador from "./components/buscador.vue";
// coomponente de la cuenta
import cuenta from "./components/cuenta.vue";
import login from "./views/login.vue";
// importando componentes para enrutar
import { RouterLink, RouterView } from "vue-router";
// espacio para importar componentes hijos
export default {
    components: { sidebar, buscador, cuenta, RouterLink, RouterView, login },
    data() {
        return {
            token: false
        }
    }

}
</script>
