<style>
.container-buscador {
    padding: .5% 1.5%;
    height: 100%;
    width: 86%;
    cursor: text;
    background: #231F1E;
    border-radius: 7px;
    display: flex;
    align-items: center;
    gap: 1.5%;
}

.icon-buscar {
    cursor: pointer;
}

#buscar {
    background: transparent;
    border: transparent 0px;
    outline-offset: 0px;
    color: white;
    outline: none;
    width: 100%;
}

/* modificar el color de "x" del input tipo search */
::-webkit-search-cancel-button,
::-webkit-search-cancel-button {
    filter: invert(50%);
}

#buscar:focus-visible {
    border: transparent 0px;
}
</style>
<template>
    <div class="container-buscador">
        <svg width="20" height="20" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-buscar">
            <path
                d="M12.4046 21.5122C18.1509 21.5122 22.8092 17.1442 22.8092 11.7561C22.8092 6.36795 18.1509 2 12.4046 2C6.6583 2 2 6.36795 2 11.7561C2 17.1442 6.6583 21.5122 12.4046 21.5122Z"
                stroke="#B4B0AF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M26.711 27.0001L21.5087 22.1221" stroke="#B4B0AF" stroke-width="4" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        <input type="search" name="buscar" id="buscar" v-model="buscar" placeholder="Buscar">
    </div>
</template>
<script>
export default {
    name: 'buscador',
    data() {
        return {
            // dato que se obtiene del input
            buscar: '',
            route: this.$router.currentRoute
        }
    },
    watch: {
        buscar(now) {
            // enviar los datos donde está el buscador
            this.$emit('getBuscar', now)
        },
        // como route es igual a la ruta actual
        // entonces cada vez que cambie el valor de la ruta necesito limpiar el buscador
        route(now) {
            if (now) {
                // limpiar buscador
                this.buscar = '';
            }
        }
    }
}

</script>