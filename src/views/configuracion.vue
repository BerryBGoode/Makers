<style>
.mb-12vh{
    margin-bottom: 12vh;
}
</style>

<template>
    <div class="container servicios component-servicio">
        <div class="top">
            <h5 class="bold">
                Configuración
            </h5>
        </div>
        <hr>
        <div class="container">
            <div class="form-data">
                <span class="bold">
                    info.
                    Personal
                </span>
                <form action="" class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos">
                        </div>
                    </div>
                    <label for="dui">DUI</label>
                    <input type="text" class="form-control" id="dui">
                </form>
            </div>
            <hr>

            <div class="form-data">
                <span class="bold">
                    Contacto
                </span>
                <form action="" class="form-2 w-70">
                    <div class="load">
                        <div class="mb-3 input-container">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="telefono">
                        </div>
                        <div class="mb-3 input-container">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo">
                        </div>
                    </div>
                </form>
            </div>
            <hr>
            <div class="form-data mb-12vh">
                <span class="bold">
                    Cuenta
                </span>

                <form action="" class="form-2 w-70">

                    <div class="mb-3 mb-12-7vh">
                        <label for="clave">Contraseña</label>
                        <input type="password" class="form-control" id="clave">
                    </div>

                </form>

            </div>
            <hr>
            <div class="buttons-reservacion form-data">                
                <button type="button" class="btn btn-makers">Cerrar sesión</button>
                <button type="button" class="btn btn-makers">Agregar cambios</button>
            </div>
        </div>
    </div>
</template>

<script>
// exportar componente
export default {
    name: 'configuracion',
    data() {
        return {

        }
    }
} 
</script>