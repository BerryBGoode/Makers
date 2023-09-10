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
            <span>Hora con mas ordenes</span>
            <canvas id="ordenes"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="hora"></canvas>
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
            ordenes: [],
            mes: []
        }
    },
    methods: {
        // método para obtener la hora de una orden
        getVentasPromise() {
            axios.get('http://localhost:3000/api/graficas/ordenes')
                .then(rows => {

                    let ventas = rows.data;
                    for (let i = 0; i < ordenes.length; i++) {
                        this.mes.push(ordenes[i].mes)
                        this.venta.push(ordenes[i].ordenes)
                    }

                    lineGraph('ordenes', this.mes, this.ordenes, 'Ordenes')
                    barGraph()

                }).catch(e => { console.log(e) })
        },

    },
    mounted() {
        this.getOrdenes();
    }
}
</script>