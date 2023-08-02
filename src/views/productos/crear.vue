<style>
.component-render {
    height: 100%;
}


.form-1 {
    width: 100%;
}

.w-25 {
    width: 25%;
}

.mb-40vh {
    margin-bottom: 40vh !important;
}
</style>
<template>
    <div class="container servicios component-servicio component-render">
        <div class="top">
            <h5 class="bold">
                Producto
            </h5>
            <span>{{ msg }}</span>
        </div>
        <hr>
        <div class="container">
            <form @submit.prevent="agregarProducto">
                <div class="form-data mb-40vh">
                    <div class="form-1">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input v-model="producto.nombre" type="text" class="form-control" id="nombre" required>
                            </div>
                            <div class="mb-3 input-container w-25">
                                <label for="precio" class="form-label">Precio</label>
                                <input v-model="producto.precio" type="text" class="form-control" id="precio" required
                                    min="1">
                            </div>
                            <div class="mb-3 input-container w-25">
                                <label for="existencias" class="form-label">Existencias</label>
                                <input v-model="producto.existencias" min="1" type="number" class="form-control"
                                    id="existencias" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input v-model="producto.descripcion" type="text" class="form-control" id="descripcion"
                                required>
                        </div>
                    </div>
                    <hr>
                </div>
                <hr>
                <div class="buttons-reservacion form-data">
                    <router-link to="/productos" class="btn btn-makers">
                        Cancelar
                    </router-link>
                    <button type="submit" class="btn btn-makers">Agregar</button>
                </div>

            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
// definir componente 
export default {
    name: "crearProducto",
    data() {
        return {
            producto: {
                // entidades de la tabla, que se modificarán desde los inputs
                nombre: '',
                descripcion: '',
                precio: '',
                existencias: '',

            },
            msg: ''
        }
    },
    methods: {
        agregarProducto() {
            // verificar sí no hay campos vacíos
            if (this.producto.nombre && this.producto.descripcion && this.producto.precio && this.producto.existencias) {
                // realizar petición
                axios.post('http://localhost:3000/api/productos', this.producto)
                    .then(res => {
                        // verificar q no venga ningún error
                        if (res.status === 201) {
                            alert(res.data);
                            // limpiar campos
                            this.producto = {
                                // entidades de la tabla, que se modificarán desde los inputs
                                nombre: '',
                                descripcion: '',
                                precio: '',
                                existencias: '',

                            }
                            // redireccionar
                            this.$router.push('/productos')
                        }
                    })
                    .catch(e => { alert(e.response.data.error) });
            } else {
                this.msg = 'No se permiten campos vacíos'
            }
        }
    }


}

</script>