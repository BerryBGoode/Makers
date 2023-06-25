<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <span class="bold">Tipos de servicios</span>
            <router-link to="/servicios/tipos/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
        <!-- Apartir de aquí verificar sí hay datos o servicios -->

    </div>
</template>
<script>
export default {
    name: 'tipos'
}

</script>