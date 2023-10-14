<style>
.component-render {
    height: 100%;
}


.form-1 {
    width: 100%;
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
            <form @submit.prevent="modificarProducto">
                <div class="form-data">
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
                            <input class="form-control" autocomplete="off" type="file" id="formFile" name="productoimg"
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
                    <button type="submit" class="btn btn-makers">Agregar cambios</button>
                </div>

            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import store from '../../store'
import { notificationError, notificationSuccess, notificationInfo } from '../../components/alert.vue'
import { onlyDecimal } from '../../validator'
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
                img: ''
            },
            productoimg: '',
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
            // cargando el archivo seleccionado
            this.productoimg = e.target.files[0];
        },
        uploadFile() {
            // instanciando clase para empaquetar imagen
            let form = new FormData();
            // empaquetando imagen juntos con su nombre para guardarla en la api
            form.append('productoimg', this.productoimg)
            axios.post('http://localhost:3000/api/upload/imgproducto', form)
                .then(res => { console.log(res) })
                .catch(rej => { console.log(rej) })
        },
        unlinkImg(img) {
            if (img != 0) {
                // instanciando clase para empaquetar imagen
                let form = new FormData();
                // empaquetando imagen juntos con su nombre para guardarla en la api
                form.append('productoimg', img)
                axios.delete('http://localhost:3000/api/upload/imgproducto/' + img)
                    .then(res => { console.log(res) })
                    .catch(rej => { console.log(rej) })
            }
        },
        getProducto() {
            // realizar petición            
            axios.get('http://localhost:3000/api/productos/' + this.$route.params.id, store.state.config)
                .then(res => {
                    // cargar los datos
                    this.producto = {
                        nombre: res.data.nombre_servicio,
                        descripcion: res.data.descripcion,
                        existencias: res.data.existencias,
                        precio: res.data.precio,
                        img: res.data.imagen
                    }
                })
                .catch(e => notificationError(e.response.data))

        },
        modificarProducto() {
            // validando el formato de la imagen
            if (!this.format.includes(this.productoimg.type)) {
                notificationInfo('Formato de imagen no permitido');
            }
            else if (!onlyLtrs(this.producto.descripcion) || !onlyLtrs(this.producto.nombre)) {
                notificationInfo('Solo se permiten letras');
            }
            else if (!onlyNumb(this.producto.existencias)) {
                notificationInfo('Solo se permiten número para existencias');
            }
            // verificar sí no hay campos vacíos
            if (this.producto.nombre && this.producto.descripcion && this.producto.precio && this.producto.existencias) {
                // eliminar imagen
                this.unlinkImg(this.producto.img);
                // obteniendo el nombre de la imagen para guardar el nombre de la imagen
                this.producto.img = this.productoimg.name
                this.uploadFile();
                // realizar petición
                axios.put('http://localhost:3000/api/productos/' + this.$route.params.id, this.producto, store.state.config)
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
                this.msg = 'No se permiten campos vacíos'
            }
        }
    },
    mounted() {
        this.getProducto();
    }

}

</script>