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
            <canvas id="cantidad"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="clientes"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="clientesfecha"></canvas>
        </div>

    </div>



    
</template>
<script>
import axios from 'axios';
import { lineGraph, barGraph, graficalineal } from './charts';


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

    },
    mounted() {
        this.getVentasPromise();
    }
}
</script>

<script>
import axios from 'axios';
import { lineGraph, barGraph, graficalineal } from './charts';


export default {
    name: 'inicio',
    data() {
        return {
            title: '',
            ordenes: []
        }
    },
    methods: {
        // método para obtener los clientes con mas ordenes
        getClientesPromise() {
            axios.get('http://localhost:3000/api/graficas/clientes')
                .then(rows => {

                    let clientes = rows.data;
                    for (let i = 0; i < clientes.length; i++) {
                        this.mes.push(clientes[i].mes)
                    }

                    lineGraph()
                    barGraph('ventas', this.mes, this.venta, 'Ventas')

                }).catch(e => { console.log(e) })
        },

    },
    mounted() {
        this.getClientesPromise();
        this.getClientes
    }
}
</script>

<script>
import axios from 'axios';
import { lineGraph, barGraph, graficalineal } from './charts';


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
        getClientefechaPromise() {
            axios.get('http://localhost:3000/api/graficas/clientesfecha')
                .then(rows => {

                    let ventas = rows.data;
                    for (let i = 0; i < cliente.length; i++) {
                        this.mes.push(ventas[i].mes)
                        this.venta.push(ventas[i].venta)
                    }

                    graficalineal('cliente', this.mes, this.venta, 'fechas')
                    barGraph()

                }).catch(e => { console.log(e) })
        },

    },
    mounted() {
        this.getClientefechaPromise();
    }
}
</script>