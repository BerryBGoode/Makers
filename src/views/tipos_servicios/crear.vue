<style>
.mb-50vh{
    margin-bottom: 50vh;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Tipo de servicio
            </h5>
        </div>
        <hr>
        <div class="container agg-servicio">
            <div class="form-data mb-50vh">
                <form action="" class="form-1">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Tipo de servicio</label>
                        <input type="text" class="form-control" id="nombre">
                    </div>                
                </form>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/servicios/tipos" class="btn btn-makers">
                    Cancelar
                </router-link>
                <button type="button" class="btn btn-makers">Agregar</button>
            </div>
        </div>
    </div>
</template>
<script>
// definir componente 
export default {
    name: "crearTipoServicio",
    data () {
        return {

        }
    }
}

</script>