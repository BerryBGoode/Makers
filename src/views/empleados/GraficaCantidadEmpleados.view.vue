<template>
    <div class="row mt-3">
        <div class="col-md-6 offset-3">
            <div class="card border border-dark">
                <div class="card-header bg-dark">
                    <div class="card-body">
                        <Bar :chart-options="charOptions" :chart-data="chartData"></Bar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    components: { Bar },
    props: {
        chartId: {
            type: String,
            default: 'bar-chart'
        }
    },

    data() {
        return {
            etiquetas: [], valores: [], chartData: [],
            chartOptions: {
                responsive: true
            }
        }
    },
    async mounted() {
        const empleados = await axios.get('');
        totales.data.map((row)=>(
            this.etiquetas.pus(row.empleados),
            this.etiquetas.pus(row.total)
        ))
        this.chartData =  {
            labels: this.etiquetas,
            datasets:[
                    {label:'Empleados',data: this.valores, backgroundColor: '#f87979' }
            ]
            }
        }
    }



</script>