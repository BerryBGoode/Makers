<style scoped>
.graph-lineal-sales {
    overflow: auto;
    height: 100%;
    border-radius: 7px;
}
</style>
<template>
    <div class="container graph-lineal-sales">
        <span>Inicio</span>
        <div class="container-ventas-grap">
            <span>Cantidad empleados segun cargos</span>
            <canvas id="cargos"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="cantidad"></canvas>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import { lineGraph, barGraph } from './charts';


export default {
    name: 'Home',
    data() {
        return {
            title: '',
            cargo: [],
            cantidad: []
        }
    },
    methods: {
        // método para obtener la cantidad cargos que tiene un empleado
        getVentasPromise() {
            axios.get('http://localhost:3000/api/graficas/cargos')
                .then(rows => {

                    let ventas = rows.data;
                    for (let i = 0; i < empleados.length; i++) {
                        this.mes.push(empleados[i].cantidad)
                        this.venta.push(empleados[i].cargo)
                    }

                    lineGraph('empleados', this.cargo, this.cantidad, 'Empleados')
                    barGraph()

                }).catch(e => { console.log(e) })
        },

    },
    mounted() {
        this.getEmpleadoPromise();
    }
}
</script>