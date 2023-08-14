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
        <div class="container-ventas-graph">
            <span>Ventas</span>
            <canvas id="ventas"></canvas>
        </div>
        <div class="container-graph">
            <select class="form-select mb-3" aria-label="Default select example" id="meses" v-if="meses.length > 0"
                @change="getOrdenesByMes" v-model="mes">
                <option v-for="(mes, i) in meses" :key="i" :value="i">{{ mes }}</option>
            </select>
            <canvas id="ordenesMes"></canvas>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import { lineGraph, barGraph } from './charts';


export default {
    name: 'inicio',
    created() {
        let month = new Date().getMonth();
        this.mes = month;
    },
    data() {
        let meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
            'Noviembre', 'Diciembre'
        ]
        console.log(document.getElementById('ordenesMes'))
        return {
            title: '',
            mes: '',
            meses
        }
    },
    methods: {
        // método para obtener las ventas
        getVentasPromise() {
            // realizar petición para obtener los meses y la cantidad de ventas por este tiempo
            axios.get('http://localhost:3000/api/graficas/ventas')
                // si la petición se realiza correctamente
                .then(rows => {
                    // crear arreglos para dividir o desagrupar en ordenes o ventas que se a realizado en el mes
                    // y los meses para 
                    let venta = [], mes = []
                    let ventas = rows.data;
                    // recorrer los datos encontrados
                    for (let i = 0; i < ventas.length; i++) {
                        // agregarlos a los arreglos para desagrupar cada uno
                        mes.push(ventas[i].mes)
                        venta.push(ventas[i].venta)
                    }
                    // con los arreglos con datos, crear la gráfica
                    lineGraph('ventas', mes, venta, 'Ventas')


                }).catch(e => { alert(e.response.data.error) })
        },
        getOrdenesByMes() {
            let req = (this.mes + 1)
            axios.get('http://localhost:3000/api/graficas/ordenesmes/' + req)
                .then(rows => {
                    let dia = [], ordenes = [], data = rows.data;
                    for (let i = 0; i < data.length; i++) {
                        dia.push(data[i].fecha);
                        ordenes.push(data[i].ordenes)
                    }

                    lineGraph('ordenesMes', dia, ordenes, 'Ordenes por día según mes')

                }).catch(e => alert(e))

        }
    },
    mounted() {
        this.getVentasPromise();
        this.getOrdenesByMes()
    }
}
</script>