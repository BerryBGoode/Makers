<style>
.component-render {
    height: 100%;
}


.form-1 {
    width: 100%;
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
                <div class="form-data ">
                    <div class="form-1">
                        <div class="load">
                            <div class="mb-3 input-container">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input v-model="producto.nombre" autocomplete="off" type="text" class="form-control"
                                    id="nombre" required>
                            </div>
                            <div class="mb-3 input-container w-25">
                                <label for="precio" class="form-label">Precio</label>
                                <input v-model="producto.precio" autocomplete="off" type="text" class="form-control"
                                    id="precio" required min="1">
                            </div>
                            <div class="mb-3 input-container w-25">
                                <label for="existencias" class="form-label">Existencias</label>
                                <input v-model="producto.existencias" min="1" type="number" class="form-control"
                                    id="existencias" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <input v-model="producto.descripcion" autocomplete="off" type="text" class="form-control"
                                id="descripcion" required>
                        </div>
                        <div class="mb-3">
                            <label for="formFile" class="form-label">Producto</label>
                            <input class="form-control" autocomplete="off" type="file" id="formFile"
                                accept=".jpg,.png, .jpeg" @change="loadFile">
                            <span>*.jpg .png .jpeg</span>
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
import store from '../../store';
import { notificationError, notificationInfo, notificationSuccess } from '../../components/alert.vue';
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
                img: '',

            },
            format: [
                'image/png',
                'image/jpeg',
                'image/jpg'
            ],
            msg: ''
        }
    },
    methods: {
        loadFile(e) {
            // cargando el archivo a la propiedad que requiere un archivo
            this.producto.img = e.target.files[0];
        },
        agregarProducto() {

            // validando el formato de la imagen
            if (!this.format.includes(this.producto.img.type)) {
                notificationInfo('Formato de imagen inabilidatado');
            }
            // verificar sí no hay campos vacíos
            else if (this.producto.nombre && this.producto.descripcion && this.producto.precio && this.producto.existencias) {
                // realizar petición
                axios.post('http://localhost:3000/api/productos', this.producto, store.state.config)
                    .then(res => {
                        // verificar q no venga ningún error
                        if (res.status === 201) {
                            notificationSuccess(res.data);
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
                    .catch(e => { notificationError(e.response.data) });
            } else {
                notificationInfo('No se permiten campos vacíos');
            }
        }
    }


}

</script>