<template>
    <div class="row-6 p-3 w-50 form align-center">
        <!-- Contenido del formulario de recuperación -->
        <form>
            <!-- Campos del formulario -->
            <input type="text" v-model="correoElectronico" placeholder="Correo Electrónico" />
            <button @click="enviarFormulario">Enviar</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            correoElectronico: '',
            // Otros datos del formulario...
        };
    },
    methods: {
        async enviarFormulario() {
            console.log(this.correoElectronico);
            // limpiar mensaje
            this.msg = '';
            // validar datos vacíos
            if (!this.correoElectronico) {
                this.msg = 'No se permiten campos vacíos';
            } else {
                try {
                    const res = await axios.post('http://localhost:3000/api/auth/recuperarContrasenia', {
                        correo: this.correoElectronico
                    });
                    if (res) return alert('Correo enviado exitosamente');
                } catch (error) {
                    alert(error);
                }
            }
        }
    }
};
</script>