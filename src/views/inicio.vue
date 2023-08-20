<style scoped>
.graph-lineal-sales {
    overflow: auto;
    padding: 0;
    height: 100%;
    /* border: solid 1px #b4b0af; */
    border-radius: 7px;
}

.container-graph {
    background: #231f1e;
    border-radius: 7px;
}
</style>
<template>
    <div class="container graph-lineal-sales">
        <div class="container-graph">
            <button @click="EmpleadosCargos">Generar pdf</button>
        </div>

        <div class="container-graph container-ventas-graph">
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { generateTablePDF } from './reports'

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

        },
        async EmpleadoOrdenes() {
            // realizar petición según el reporte
            try {
                // llamar la función asicrona para obtener los datos de la petición
                const EMPLEADOS = await axios.get('http://localhost:3000/api/reportes/empleadoordenes');
                // obtener la 'data' de la función asicrona
                const ROWS = EMPLEADOS.data;
                // declarando datos para poner en el header de la tabla
                const colNames = ['Empleados','Nombres', 'Apellidos', 'cantidad_ordenes'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.empleados,row.nombres, row.apellidos,row.cantidad_ordenes]);
                // llamando al método para generar reportes
                generateTablePDF('EmpleadoOrdenes', 'Empleados con mas ordenes', colNames, colData)

            } catch (e) {
                alert(e.response.data.error)
            }
        },
        async tipoServicios() {
            // realizar petición según el reporte
            try {
                // llamar la función asicrona para obtener los datos de la petición
                const SERVICIOS = await axios.get('http://localhost:3000/api/reportes/tiposervicios');
                // obtener la 'data' de la función asicrona
                const ROWS = SERVICIOS.data;
                // declarando datos para poner en el header de la tabla
                const colNames = ['Servicio','Nombre_Servicio', 'Tipo_Servicio'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.servicio,row.nombre_servicio, row.tipo_servicio]);
                // llamando al método para generar reportes
                generateTablePDF('tipoServicios', 'Servicios por tipo servicios', colNames, colData)

            } catch (e) {
                alert(e.response.data.error)
            }
        }
    },
    mounted() {
        this.getVentasPromise();
        this.getOrdenesByMes()
        this.EmpleadoOrdenes()
        this.tipoServicios

    }
}
</script>