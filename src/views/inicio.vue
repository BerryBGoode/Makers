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
        <div class="container-grap">
            <canvas id="facturas-sucursales"></canvas>
        </div>
        <div class="container-grap">
            <canvas id="servicios-vendidos"></canvas>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { lineGraph, barGraph, barGraphic, GraficaDeBarra } from './charts';


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

        //método para obtener cuantas facturas tiene cada sucursal
        getFacturasSucursal() {
            axios.get('http://localhost:3000/api/graficas/facturasS')
            .then(rows => {

                let facturas = rows.data;
                for (let i = 0; i < facturas.length; i++) {
                    this.nombre_sucursal.push(facturas[i].nombre_sucursal)
                    this.cantidad_facturas.push(facturas[i].cantidad_facturas)
                }

                barGraphic('facturas', this.nombre_sucursal, this.cantidad_facturas, 'Facturas')
            }).catch(e => { console.log(e) })
        },

        getServiciosVendidos()  {
            axios.get('http://localhost:3000/api/graficas/servicosV')
            .then(rows => {

                let servicios = rows.data;
                for (let i = 0; i < servicios.length; i++) {
                    this.nombre_servicio.push(facturas[i].nombre_sucursal)
                    this.cantidad_ventas.push(facturas[i].cantidad_facturas)
                }

                GraficaDeBarra('vista_productos_mas_vendidos', this.nombre_servicio, this.cantidad_ventas, 'Servicios')
            }).catch(e => { console.log(e) })
        },
        async EmpleadosCargos() {
            // realizar petición según el reporte
            try {
                // llamar la función asicrona para obtener los datos de la petición
                const EMPLEADOS = await axios.get('http://localhost:3000/api/reportes/empleadoscargos');
                // obtener la 'data' de la función asicrona
                const ROWS = EMPLEADOS.data;
                // declarando datos para poner en el header de la tabla
                const colNames = ['Nombres', 'Apellidos', 'Cargo'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.nombres, row.apellidos, row.cargo]);
                // llamando al método para generar reportes
                generateTablePDF('EmpleadosCargos', 'Empleados por cargo', colNames, colData)

            } catch (e) {
                alert(e.response.data.error)
            }
        }
    },
    mounted() {
        this.getVentasPromise();
        this.getFacturasSucursal();
        this.getServiciosVendidos();
    }
}
</script>

