<style>
.xd {
    color: #423d3b;
}
</style>
<template>
    Primer uso
    <div class="">

    </div>
</template>
<script>
import {
    notificationSuccess, notificationError,
    notificationQuestion, alertInfo
} from './components/alert.vue';


export default {
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {
        alertInfo('Se ha detectado que no existen sucursales registradas', 'Aceptar');
    }
}
</script>