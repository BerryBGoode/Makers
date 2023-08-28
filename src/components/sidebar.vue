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
                <source srcset="../assets/img/logos/logo_blanco.png" type="image/png">
                <img :src="logo" srcset="../assets/img/logos/logo_blanco.png" draggable="false" />
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
import { RouterLink, RouterView } from "vue-router";
// funcionalidades del componente
export default {
    // nombre del componente
    name: "sidebar",
    data() {
        return {
            // lista con las optiones que puede acceder el usuario
            options: [
                { option: "Inicio", route: "/inicio" },
                { option: "Servicios", route: "/servicios" },
                { option: "Productos", route: "/productos" },
                { option: "Clientes", route: "/clientes" },
                { option: "Empleados", route: "/empleados" },
                { option: "Reservaciones", route: "/reservaciones" },
                { option: "Ordenes", route: "/ordenes" },
                { option: "Sucursales", route: "/sucursales" },
                { option: "Horarios", route: "/horarios" },
            ],
            logo: './../src/assets/img/logos/logo_blanco.png'
        };
    },
};
</script>