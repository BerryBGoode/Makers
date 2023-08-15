<style scoped>
.graph-lineal-sales {
    overflow: auto;
    height: 100%;
    /* border: solid 1px #b4b0af; */
    border-radius: 7px;
}
</style>
<template>
    <div class="container graph-lineal-sales">
        <span>Inicio</span>
        <div class="container-ventas-grap">
            <span>Ventas</span>
            <canvas id="ventas"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="categorias"></canvas>
        </div>
        <div class="container-mesordenes-grap">
            <span>Ordenes</span>
            <canvas id="mesorden"></canvas>
        </div>
        <div class="container-topprod-grap">
            <span>Popularidad</span>
            <canvas id="topp"></canvas>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { lineGraph, barGraph } from './charts';


export default {
    name: 'inicio',
    data() {
        return {
            title: '',
            venta: [],
            mes: []
        }
    },
    methods: {
        // método para obtener las ventas
        getVentasPromise() {
            axios.get('http://localhost:3000/api/graficas/ventas')
                .then(rows => {

                    let ventas = rows.data;
                    for (let i = 0; i < ventas.length; i++) {
                        this.mes.push(ventas[i].mes)
                        this.venta.push(ventas[i].venta)
                    }

                    lineGraph('ventas', this.mes, this.venta, 'Ventas')
                    barGraph()

                }).catch(e => { console.log(e) })
        },

        getPopularidad() {
            axios.get('http://localhost:3000/api/graficas/topp')
                .then(rows => {

                    let topp = rows.data;
                    for (let i = 0; i < topp.length; i++) {
                        this.servicio.push(topp[i].servicio)
                        this.cantidad.push(topp[i].cantidad)
                    }

                    barGraph('Top Productos', this.servicio, this.cantidad, 'Ventas')
                    ()

                }).catch(e => { console.log(e) })
        },

        getOrdenesby() {
            axios.get('http://localhost:3000/api/graficas/mesorden')
                .then(rows => {

                    let mesorden = rows.data;
                    for (let i = 0; i < mesorden.length; i++) {
                        this.mes.push(mesorden[i].mes)
                        this.orden.push(mesorden[i].orden)
                    }

                    lineGraph('Ordenes', this.mes, this.orden, 'Ordenes')

                }).catch(e => { console.log(e) })
        }

    },

    
    mounted() {
        this.getVentasPromise();
    }
}


</script>