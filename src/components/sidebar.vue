<!-- estilos del componente -->
<style scoped>
/* el scoped funciona para aplicar los estilos de manera local al componente*/
.container-sidebar {
    /* display: flex;
  flex-direction: column; */

    height: 100%;
    transition: 0.3s ease;
}

.ul-lista {
    padding: 0;
}

.li-lista {
    list-style: none;
    margin: 10% 0;
    width: 120%;
    border-radius: 7px 0 0 7px;
}

.li-lista:hover {
    background-color: #393534;
    /* width: 117%; */
    /* cursor: pointer; */
    transition: ease 0.5s;
}

.item {
    font-weight: 600;
    font-size: medium;
    color: white;
    text-decoration: none;
    /* cursor: pointer; */
    width: 100%;
    display: block;
    padding: 5% 0;
}

.logo-sidebar {
    margin: 0.5%;
}

@media screen and (max-width: 1280px) {
    .li-lista {
        width: 100%;
    }
}
</style>

<template>
    <div class="container-sidebar">
        <div class="logo-sidebar">
            <picture>
                <source type="image/png">
                <img :src="logo" draggable="false" />
            </picture>
        </div>
        <ul class="ul-lista">
            <li class="li-lista" v-for="(item, index) in this.options" :key="index">
                <!-- 
              <span class="item">{{ item }}</span> -->
                <!-- <i>icon</i> -->
                <router-link class="item" :to="item.route">{{ item.option }} </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
// importando componentes para enrutar
import { RouterLink, RouterView } from 'vue-router';
import store from '../store';
import { notificationError } from '../components/alert.vue';
import axios from 'axios';

// funcionalidades del componente
export default {
    // nombre del componente
    name: 'sidebar',
    data() {
        return {
            // lista con las optiones que puede acceder el usuario
            options: [],
            logo: '',
            // logomin: './../src/assets/img/logos/logo_blanco_nav.png',
            cargo: ''
        };
    },
    methods: {
        // método para obtener los datos del empleado loggeado
        getEmpleado() {
            // realizar petición
            axios.get('http://localhost:3000/api/auth/', store.state.config)
                .then(res => {
                    store.state.cargo = res.data.cargo;

                    switch (store.state.cargo) {
                        case 'Gerente':
                            this.options = [
                                { option: 'Inicio', route: '/inicio' },
                                { option: 'Servicios', route: '/servicios' },
                                { option: 'Productos', route: '/productos' },
                                { option: 'Clientes', route: '/clientes' },
                                { option: 'Empleados', route: '/empleados' },
                                { option: 'Reservaciones', route: '/reservaciones' },
                                { option: 'Ordenes', route: '/ordenes' },
                                { option: 'Sucursales', route: '/sucursales' },
                                { option: 'Horarios', route: '/horarios' },
                            ]

                            break;

                        case 'Cajero':
                            this.options = [
                                { option: 'Inicio', route: '/inicio' },
                                { option: 'Servicios', route: '/servicios' },
                                { option: 'Productos', route: '/productos' },
                                { option: 'Clientes', route: '/clientes' },
                                { option: 'Reservaciones', route: '/reservaciones' },
                                { option: 'Ordenes', route: '/ordenes' },
                                { option: 'Sucursales', route: '/sucursales' }
                            ]
                            break;

                        case 'Barbero':
                            this.options = [
                                { option: 'Inicio', route: '/inicio' },
                                { option: 'Servicios', route: '/servicios' },
                                { option: 'Productos', route: '/productos' },
                                { option: 'Clientes', route: '/clientes' },
                                { option: 'Reservaciones', route: '/reservaciones' },
                                { option: 'Ordenes', route: '/ordenes' },

                            ]
                            break;
                        default:
                            break;
                    }

                })
                .catch(e => {
                    notificationError(e.response.data);
                })
        },
        validateWindow(width) {
            // verificar el width para asignar el valor a logo, iconos, lado del sidabar etc
            if (width >= 1280) {
                this.logo = './../src/assets/img/logos/logo_blanco.png'
            } else if (width >= 1280 || width < 1280) {
                this.logo = './../src/assets/img/logos/logo_blanco_nav.png'
            }

            if (width <= 930) {
                this.options.forEach(elements => {
                    console.log(elements)
                })
            }
            // eva
        }
    },
    created() {
        // crear evento cuando se cambia de ancho la pantalla
        window.addEventListener('resize', event => {
            this.validateWindow(document.documentElement.clientWidth)
        })
        this.validateWindow(document.documentElement.clientWidth);
    },
    mounted() {
        this.getEmpleado();
        // console.log(store.state.cargo)
    }
};
</script>