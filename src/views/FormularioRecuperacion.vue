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
export default {
    data() {
        return {
            correoElectronico: '',
            // Otros datos del formulario...
        };
    },
    methods: {
        async enviarFormulario() {
            // Lógica para enviar el formulario
            try {
                const response = await fetch('/recuperarcontracorreo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: this.email })
                });

                if (response.status === 200) {
                    // Password reset email sent successfully
                } else if (response.status === 404) {
                    // User not found
                } else {
                    // Other error
                }
            } catch (error) {
                alert(e.response.data.error)
            }

        }
    }
};
</script>