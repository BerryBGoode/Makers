<template>
    <!-- verificar si existe un empleado -->
    <template v-if="sucursales.length <= 0">
        <sucursal />
    </template>
    <!-- verificar sí existe un sucursal -->
    <template v-else>
        <empleado />
    </template>
</template>
<script>
import axios from 'axios';
import sucursal from './primeraSucursal.vue';
import empleado from './primerEmpleado.vue';

export default {
    name: 'PrimerUso',
    data() {
        return {
            empleados: [],
            sucursales: [],
        }
    },
    methods: {
        // método para verificar existencia de sucursales
        // método para verificar existencia de empleados
    },
    components: { sucursal, empleado }
}
</script>