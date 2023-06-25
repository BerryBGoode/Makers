<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <span class="bold">Ordenes</span>
            <router-link to="/ordenes/crear" type="button" class="btn btn-makers">
                Agregar
            </router-link>
        </div>
        <hr>
    </div>
</template>
<script>
export default {
    name : 'ordenes'
}

</script>