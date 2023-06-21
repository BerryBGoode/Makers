<style>
.login-container {
    border: solid 2px #676767;
    background-color: #2c2828;
    border-radius: 7px;
    height: 75%;
}

.items-center {
    align-items: center;
}

.wrap {
    flex-wrap: wrap;
}
.children-form{
    display: flex;
    flex-direction: column;
    gap: 5px;
}
@media screen and (max-width: 725px) {
    .login {
        flex-direction: column;
    }

    .func,
    .form {
        height: 50%;
        width: 100% !important;
    }
}
</style>

<template>
    <section class="flex items-center w-100 h-100 ">
        <form class="container p-5 login-container">
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="dui" class="form-label">DUI</label>
                            <input type="text" class="form-control" id="dui" v-model="this.model.empleado.dui">
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Correo</label>
                            <input type="email" class="form-control" id="correo" v-model="this.model.empleado.correo">
                        </div>
                        <div class="mb-3">
                            <label for="clave" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="clave" v-model="this.model.empleado.clave"
                                maxlength="15" minlength="10">
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 func">
                    <img src="../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png" alt="Logo">
                </div>
            </div>
        </form>
    </section>
</template>
<script>


// exportar componente hijo
export default {
    // nombre del componente
    name: "login",

    // método que retorna el componente
    data() {
        return {
            model: {
                empleado: {
                    correo: '',
                    clave: '',
                    dui: ''
                }
            }
        }
    }
}

</script>