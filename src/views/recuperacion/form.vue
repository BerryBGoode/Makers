<template>
    <section class="flex w-100 h-100 ">
        <form class="container p-5 login-container h-100" @submit.prevent="checkEmpleado">
            <span class="msg">{{ msg }}</span>
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="dui" class="form-label">DUI</label>
                            <input type="text" class="form-control" id="dui" required>
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" required>
                        </div>
                        <div class="mb-3">
                            <label for="clave" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="clave" maxlength="15" minlength="10" required>
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 func">
                    <div class="img-fun align-center">
                        <img alt="Logo" draggable="false">
                    </div>

                    <div class="buttons-login">
                        <button type="submit" class="btn btn-makers w-100 bold">Iniciar Sesión</button>
                        <a @click="selectMetodo" class="href-makers">Restablecer contraseña</a>
                    </div>
                </div>
            </div>
        </form>
    </section>
</template>
<script>
// options api
export default {

}
</script>