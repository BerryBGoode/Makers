<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <span class="bold">Cargos</span>
            <router-link to="/empleados/cargos/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
        <!-- Apartir de aquí verificar sí hay datos o servicios -->
        
    </div>
</template>
<script>
export default {
    name: 'cargos'
}

</script>