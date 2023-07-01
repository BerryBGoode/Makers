<style>
.container-cuenta {
    cursor: pointer;
    width: 12%;
    background: #231f1e;
    border-radius: 7px;
    display: flex;
    padding: 0.5% 1%;
}

.ref {
    text-decoration: none;
    gap: 5%;
    display: flex;
    width: 100%;
    color: #b4b0af;
    align-items: center;
}
</style>
<template>
    <div class="container-cuenta">
        <RouterLink to="/configuracion" class="ref">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.5 13.5C16.6066 13.5 19.125 10.9816 19.125 7.875C19.125 4.7684 16.6066 2.25 13.5 2.25C10.3934 2.25 7.875 4.7684 7.875 7.875C7.875 10.9816 10.3934 13.5 13.5 13.5Z"
                    stroke="#B4B0AF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                <path
                    d="M23.1636 24.75C23.1636 20.3963 18.8324 16.875 13.4999 16.875C8.1674 16.875 3.83615 20.3963 3.83615 24.75"
                    stroke="#B4B0AF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ empleado.nombre }} </span>
            <span> {{ empleado.apellido }}</span>
        </RouterLink>
    </div>
</template>
<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';

// exportación del componente
export default {
    // nombre del componente
    name: "cuenta",
    components: { RouterLink },
    // funciones a retornar del componente
    data() {
        return {
            empleado: {
                nombre: '',
                apellido: '',
                id: ''
            },
            config: {
                headers: {
                    authorization: this.$cookies.get('auth')
                }
            }
        };
    },
    methods: {
        // método para obtener los datos del empleado loggeado
        getEmpleado() {
            // realizar petición
            axios.get('http://localhost:3000/api/auth/', this.config)
                .then(res => {
                    // separar en un arreglo los nombres
                    let nombre = res.data.nombres.split(' ');
                    let apellido = res.data.apellidos.split(' ')
                    this.empleado = {
                        nombre: nombre[0],
                        apellido: apellido[0],
                        id: res.data.id_empleado
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    },
    mounted() {
        this.getEmpleado();
    }
};
</script>
