<style>
.btn-makers {
    background: #393534;
    color: white;
}

.btn-makers:hover {
    background: #504c4a;
}

.btn-makers:active {
    border-color: #b4b0af !important;
    color: #b4b0af !important;
}
</style>

<template>
    <section class="flex items-center w-100 h-100 ">
        <form class="container p-5 login-container" @submit.prevent="checkEmpleado">
            <span class="msg">{{ msg }}</span>
            <div class="col h-100 flex wrap login">
                <div class="row-6 p-3 w-50 form align-center">
                    <div class="children-form">
                        <div class="mb-3">
                            <label for="dui" class="form-label">Nueva Contraseña</label>
                            <input type="text" class="form-control" id="dui" v-model="this.model.empleado.dui" required>
                        </div>
                        <div class="mb-3">
                            <label for="correo" class="form-label">Confirmar Contraseña</label>
                            <input type="email" class="form-control" id="correo" v-model="this.model.empleado.correo"
                                required>
                        </div>
                    </div>

                </div>
                <div class="row-6 p-3 w-50 func">
                    <div class="img-fun align-center">
                        <img :src="model.logo_lc" alt="Logo" draggable="false">
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
// importar axios para hacer peticiones
import axios from 'axios';
// importar para configurar rutas
import dashboard from '../dashboard.vue';
import logo from '../../assets/img/logos/manual_de_marca_Makers_va_con_detalles-1-removebg-preview.png'
import { alertQuestion, notificationInfo, notificationSuccess } from '../../components/alert.vue';
import { mapActions, mapState } from 'vuex';


export default {
    // nombre del componente
    name: "formulario contraseña",
    components: { logo },
    // método que retorna el componente
    data() {
        return {
            model: {
                logo_lc: logo, 
                empleado: {
                    clave: '',
                   
                },
                auth: {
                    state: '',
                    token: '',
                }
            },
            msg: '',

        }
    },
   
        // método para buscar a un empleado con esos datos
        async changePassword() {
  // Get the values of the two input fields
  const newPassword = this.model.empleado.clave;
  const confirmPassword = this.model.empleado.confirmarClave;

  // Validate that both fields are not empty and that they match
  if (!newPassword || !confirmPassword) {
    this.msg = 'No se permiten campos vacíos';
  } else if (newPassword !== confirmPassword) {
    this.msg = 'Las contraseñas no coinciden';
  } else {
    try {
      // Call an API to update the user's password
      const res = await axios.post('http://localhost:3000/api/change-password', {
        newPassword,
        confirmPassword,
      });
      if (res.data.success) {
        // Show a success message to the user
        this.msg = 'Contraseña actualizada correctamente';
      } else {
        // Show an error message to the user
        this.msg = res.data.msg;
      }
    } catch (error) {
      // Show an error message to the user
      this.msg = 'Ocurrió un error al actualizar la contraseña';
    }
  }
}
}

</script>