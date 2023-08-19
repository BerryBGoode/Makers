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
            <button @click="generatePDF">Generar pdf</button>
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
        async generatePDF() {
            // realizar petición
            try {
                const RESERVACIONES = await axios.get('http://localhost:3000/api/reportes/proxreservaciones');
                const ROWS = RESERVACIONES.data;



                // a partir de aquí genera el reporte
                const PDF = new jsPDF();

                // titulo
                PDF.setFontSize(15);

                PDF.text('Próximas Rervaciones', 15, 20);
                PDF.addImage('/src/assets/img/logos/logo_gris.png', 'PNG', 155, 15, 40, 10)

                // declarar los nombres de la columnas de la tabla
                const colNames = ['Fecha', 'Hora', 'Cliente', 'DUI', 'Empleado', 'DUI'];
                // extraer los datos de la petición y separarlos según el nombre obteniedo de cada columna de la consulta
                // y separarlos en orden de colNames
                const colData = ROWS.map(row => [row.fecha, row.hora, row.cliente, row.duicliente, row.empleado, row.duiempleado]);
                // creando la tabla con los datos de cabeza, los datos de la petición y donde inicia
                PDF.autoTable({
                    head: [colNames],
                    body: colData,
                    startY: 45,
                    didDrawCell: data => {
                        if (data.row.index) {
                            data.cell.styles.fillColor = [255, 255, 255]
                        }
                    }
                })
                let img = '/src/assets/img/logos/logo_gris_nav.png';
                let width = 10, height = 10;

                const PAGE = PDF.internal.getNumberOfPages();

                for (let i = 0; i <= PAGE; i++) {
                    PDF.setPage(i);
                    const X = (PDF.internal.pageSize.width - width) - 10;
                    const Y = (PDF.internal.pageSize.height - height) - 10;
                    PDF.addImage(img, 'PNG', X, Y, width, height);
                    i = i + 1;
                    PDF.setFontSize(12)
                    PDF.text(i.toString(), (PDF.internal.pageSize.width - width) / 2, 282.5);
                }

                PDF.save('reporte.pdf');

            } catch (e) {
                alert(e)
            }
        }
    },
    mounted() {
        this.getVentasPromise();
        this.getOrdenesByMes()
    }
}
</script>