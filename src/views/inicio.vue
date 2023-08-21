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

        <div class="container-graph container-ventas-graph">
            <canvas id="ventas"></canvas>
        </div>

        <div class="container-graph">
            <select class="form-select mb-3" aria-label="Default select example" id="meses" v-if="meses.length > 0"
                @change="getOrdenesByMes" v-model="mesgraph">
                <option v-for="(mesgraph, i) in meses" :key="i" :value="i">{{ mesgraph }}</option>
            </select>
            <canvas id="ordenesMes"></canvas>
        </div>

        <div class="container-graph">
            <select class="form-select mb-3" aria-label="Default select example" id="meses" v-if="tipos.length > 0"
                @change="getServiciosTop" v-model="tipo">
                <option v-for="(tipo, i) in tipos" :key="i" :value="tipo.id_tipo_servicio">{{ tipo.tipo_servicio }}</option>
            </select>

            <canvas id="servicios"></canvas>
        </div>
        <div class="container-graph">
            <canvas id="clientes"></canvas>
        </div>
        <div class="container-graph">
            <select class="form-select mb-3" aria-label="Default select example" id="meses" v-if="meses.length > 0"
                v-model="mesgraphora" @change="getHoraMes">
                <option v-for="(mesgraph, i) in meses" :key="i" :value="i">{{ mesgraph }}</option>
            </select>
            <canvas id="horas"></canvas>
        </div>



        <div class="container-graph">

            <canvas id="cargos"></canvas>

        </div>
        <div class="container-graph">
            <div class="mb-3">
                <span>Próximas reservaciones</span>
                <button @click="proxReservaciones" class="btn btn-makers">Generar pdf</button>

            </div>
            <div class="mb-">
                <span>Reservaciones previas</span>
                <button @click="prevReservaciones" class="btn btn-makers">Generar pdf</button>
            </div>
            <div class="mb-3">
                <span>Productos a punto de agotarse</span>
                <button @click="lessProductos" class="btn btn-makers">Generar pdf</button>
            </div>

            <div class="mb-3">
                <span>Empleados</span>
                <button class="btn btn-makers" @click="EmpleadosCargos">Generar pdf</button>
            </div>

            <div class="mb-3 flex-col input-container">
                <input type="date" name="" id="" class="form-control" v-model="today">
                <div class="mb3">
                    <span>Ventas del día </span>
                    <button class="btn btn-makers" @click="getVentasDia">Generar pdf</button>
                </div>
            </div>
            <select class="form-select mb-3" aria-label="Default select example" id="meses" v-if="meses.length > 0"
                v-model="mesreportventas">
                <option v-for="(mesgraph, i) in meses" :key="i" :value="i">{{ mesgraph }}</option>
            </select>
            <div class="mb3">
                <span>Ventas del mes</span>
                <button class="btn btn-makers" @click="getVentasMes">Generar pdf</button>
            </div>

            <select class="form-select mb-3" id="meses" v-if="meses.length > 0" v-model="mesreportreserv">
                <option v-for="(mesgraph, i) in meses" :key="i" :value="i">{{ mesgraph }}</option>
            </select>

            <div class="mb-3">
                <span>Reservaciones del mes</span>
                <button class="btn btn-makers" @click="getReservacionesMes">Generar pdf</button>
            </div>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import { generateTablePDF } from './reports'
import { formatDateToYYYYMMDD } from '../validator';
import { lineGraph, barGraph, doughnutGraph, pieGraph } from './charts';

export default {
    name: 'inicio',
    created() {
        let month = new Date().getMonth();
        this.mesgraph = month;
        this.mesreportventas = month;
        this.mesreportreserv = month;
        this.mesgraphora = month;
    },
    data() {
        let meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
            'Noviembre', 'Diciembre'
        ];

        let date = new Date();
        let today = formatDateToYYYYMMDD(date).toString()
        return {
            title: '',
            mesgraph: '',
            meses,
            mesreportventas: '',
            today,
            mesreportreserv: '',
            mesgraphora: '',
            tipos: [],
            tipo: 0
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
                    lineGraph('ventas', mes, venta, 'Ventas de año')


                }).catch(e => { (e.response.data.error) ? alert(e.response.data.error) : alert(e) })
        },
        getOrdenesByMes() {
            // como mes enero es 0, al mes seleccionado sumarle uno
            let req = (this.mesgraph + 1)
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
        getEmpleadosCargos() {
            axios.get('http://localhost:3000/api/graficas/cargos')
                .then(rows => {
                    let cargo = [], count = [], data = rows.data;
                    for (let i = 0; i < data.length; i++) {
                        cargo.push(data[i].cargo);
                        count.push(data[i].count)
                    }
                    barGraph('cargos', 'Cargos', cargo, count);
                }).catch(e => { (e.response.data.error) ? alert(e.response.data.error) : alert(e) })
        },
        getClientesTop() {
            axios.get('http://localhost:3000/api/graficas/clientestop')
                .then(rows => {
                    let ordenes = [], clientes = [], data = rows.data;
                    for (let i = 0; i < data.length; i++) {
                        ordenes.push(data[i].ordenes);
                        clientes.push(data[i].cliente);
                    }
                    doughnutGraph('clientes', 'Clientes frecuentes', 'Frecuencia', clientes, ordenes);
                })
                .catch(e => { (e.response.data.error) ? alert(e.response.data.error) : alert(e) })
        },
        getHoraMes() {

            // como mes enero es 0, al mes seleccionado sumarle uno
            let req = (this.mesgraphora + 1)
            axios.get('http://localhost:3000/api/graficas/hora/' + req)
                .then(rows => {
                    let hora = [], ventas = [], data = rows.data;
                    for (let i = 0; i < data.length; i++) {
                        hora.push(data[i].hora);
                        ventas.push(data[i].ventas);
                    }
                    pieGraph('horas', 'Top 7 horas pico del mes', hora, 'ventas', ventas);
                })
        },
        getTiposServicios() {
            axios.get('http://localhost:3000/api/servicios/tipos')
                .then(res => {
                    this.tipos = res.data;
                    this.tipo = res.data[0].id_tipo_servicio;
                    this.getServiciosTop();
                })
                .catch(e => console.log(e));
        },
        getServiciosTop() {
            axios.get('http://localhost:3000/api/graficas/servicosvendido/' + this.tipo)
                .then(res => {
                    let servicio = [], cantidad = [], data = res.data;
                    for (let i = 0; i < data.length; i++) {
                        servicio.push(data[i].nombre_servicio);
                        cantidad.push(data[i].cantidad)
                    }
                    barGraph('servicios', 'Servicios más vendidos', servicio, cantidad);
                })
                .catch(e => { alert(e) })
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
                (e.response.data.error) ? alert(e.response.data.error) : alert(e)
            }
        },
        async proxReservaciones() {
            // realizar petición según el reporte
            try {
                // llamar la función asicrona para obtener los datos de la petición
                const RESERVACIONES = await axios.get('http://localhost:3000/api/reportes/proxreservaciones');
                // obtener la 'data' de la función asicrona
                const ROWS = RESERVACIONES.data;
                // declarando datos para poner en el header de la tabla
                let names = ['Fecha', 'Hora', 'Cliente', 'DUI', 'Empleado', 'DUI'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.fecha, row.hora, row.cliente, row.duicliente, row.empleado, row.duiempleado]);
                // llamando al método para generar reportes
                generateTablePDF('proxReservaciones', 'Próximas Reservaciones', names, colData)

            } catch (e) {
                (e.response.data.error) ? alert(e.response.data.error) : alert(e)
            }
        },
        async prevReservaciones() {
            try {
                // realiza la petición para obtener las reservaciones antes del día que se generé el reporte
                const RESERVACIONES = await axios.get('http://localhost:3000/api/reportes/prevreservaciones');
                // obtener los datos de la petición
                const ROWS = RESERVACIONES.data;
                // declarando un arreglo para guardar los nombres de la columnas de la tabla
                let names = ['Fecha', 'Hora', 'Cliente', 'DUI', 'Empleado', 'DUI'];
                // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
                // o la obtenido en la petición (Network)
                const colData = ROWS.map(row => [row.fecha, row.hora, row.cliente, row.duicliente, row.empleado, row.duiempleado]);
                // llamando al método para generar reportes
                generateTablePDF('prevReservaciones', 'Reservaciones Previas', names, colData);
            } catch (error) {
                (error.response.data.error) ? alert(error.response.data.error) : alert(error)
            }
        },
        async lessProductos() {
            try {
                // realizar petición para obtener los datos para llenar el reporte
                const PRODUCTOS = await axios.get('http://localhost:3000/api/reportes/lessproductos');
                // extraer los datos de la petición
                const ROWS = PRODUCTOS.data;
                // definiendo el nombre de la columnas para la tabla del reporte
                let names = ['Sucursal', 'Servicio', 'Cantidad', 'Precio'];
                // obteniendo los datos resultados de la petición y mapear (crear un arreglo copia 
                // con los datos recuperados de la petición y separlas según el nombre obtenido en .data)
                const VALUES = ROWS.map(row => [row.nombre_sucursal, row.nombre_servicio, row.cantidad, '$' + row.precio])
                // generar el reporte con la tabla
                generateTablePDF('casi-agotados', 'Servicios a punto de agotarse', names, VALUES);
            } catch (error) {
                (error.response.data.error) ? alert(error.response.data.error) : alert(error)
            }
        },
        async getVentasDia() {
            try {
                // realizar petición para obtener las ventas del dia actual
                const VENTAS = await axios.get('http://localhost:3000/api/reportes/ventadia/' + this.today)
                // extraer la data de la petición
                const ROWS = VENTAS.data;
                // definiendo los headers para la tabla del reporte
                let names = ['Nombres', 'Apellidos', 'Dui', 'Fecha', 'Hora'];
                // extrayendo la date de manera individual de la petición            
                const VALUES = ROWS.map(row => [row.nombres, row.apellidos, row.dui, row.fecha, row.hora]);
                // invocando el método para generar el reporte 
                generateTablePDF('ventas de ' + this.today, 'Ventas de ' + this.today, names, VALUES)
            } catch (error) {
                (error.response.data.error) ? alert(error.response.data.error) : alert(error)
            }
        },
        async getReservacionesMes() {
            try {
                // como los meses estan dentro de un arreglo y recordando teoria de arreglo n1 = 0
                // se le suma +1 al número del mes seleccionado por el usuario
                let req = this.mesreportreserv + 1;
                // realizando la petición para obtener los datos para llenar el reporte
                const RESERVACIONES = await axios.get('http://localhost:3000/api/reportes/reservacionesmes/' + req);
                // obteniendo la data de la respuesta de la petición
                const ROWS = RESERVACIONES.data;
                // definiendo los headers del reporte
                let names = ['Cliente', 'Dui', 'Empleado', 'Dui', 'Fecha', 'Hora'];
                // extrayendo la data y diviendola en porciones más pequeñas según las col diferentes
                const VALUES = ROWS.map(row => [row.Cliente, row.DuiCliente, row.Empleado, row.DuiEmpleado, row.fecha, row.hora])
                // generando el pdf 
                generateTablePDF(
                    'reservaciones de ' + this.meses[this.mesreportreserv].toLowerCase(),
                    'Reservaciones de ' + this.meses[this.mesreportreserv], names, VALUES
                );
            } catch (error) {
                (error.response.data.error) ? alert(error.response.data.error) : alert(error)
            }
        },
        async getVentasMes() {
            try {
                // como mes enero es 0, al mes seleccionado sumarle uno
                let req = this.mesreportventas + 1;
                // realizar la petición para obtener las ventas del reporte
                const VENTAS = await axios.get('http://localhost:3000/api/reportes/ventasmes/' + req);
                // obtener la data de la respuesta del servidor
                const ROWS = VENTAS.data;
                // definiendo nombres para llenar la tabla 
                let names = ['Nombres', 'Apellidos', 'Dui', 'Fecha', 'Hora'];
                // extrayendo los valores para el reporte de la data de la petición
                const VALUES = ROWS.map(row => [row.nombres, row.apellidos, row.dui, row.fecha, row.hora]);
                // generando el pdf 
                generateTablePDF('ventas de ' + this.meses[this.mesreportventas].toLowerCase(), 'Ventas de ' + this.meses[this.mesreportventas], names, VALUES)
            } catch (error) {
                (error.response.data.error) ? alert(error.response.data.error) : alert(error)
            }
        },
    },
    mounted() {
        this.getVentasPromise();
        this.getOrdenesByMes();
        this.getEmpleadosCargos();
        // this.tipoServicios;
        this.getClientesTop();
        this.getTiposServicios();
        this.getHoraMes();
        // this.getServiciosTop();
    }
}
</script>