<style>
.mb-52vh{
    margin-bottom: 52vh;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Horario
            </h5>
        </div>
        <hr>
        <div class="container agg-servicio">
            <div class="form-data mb-52vh">
                <form action="" class="form-1">
                    <div class="load">
                        <div class="mb-3 flex-col input-container">
                            <label for="apertura" class="form-label">Apertura</label>
                            <input type="time" name="apertura" id="apertura" class="form-control">
                        </div>
                        <div class="mb-3 flex-col input-container">
                            <label for="cierre" class="form-label">Cierre</label>
                            <input type="time" name="cierre" id="cierre" class="form-control">
                        </div>
                    </div>
                </form>
                <hr>
            </div>
            <hr>
            <div class="buttons-reservacion buttons-servicio form-data">
                <router-link to="/horarios" class="btn btn-makers">
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
    name: "crearHorario",
    data() {
        return {

        }
    }
}

</script>