<style>

</style>

<template>
    <span>{{text}}</span>
</template>
<script>
// componente sidebar
import sidebar from "../components/sidebar.vue";
// componente buscador
import buscador from "../components/buscador.vue";
// coomponente de la cuenta
import cuenta from "../components/cuenta.vue";
import login from "../views/login.vue";
// exportar componente hijo
export default  {
    // nombre del componente
    name : "dashboard",
    // props que pudiera recibir el componente
    props : {},
    // método que retorna el componente
    data () {
        return {
            text : 'Dashboard de inicio'
        }
    }
}

</script>