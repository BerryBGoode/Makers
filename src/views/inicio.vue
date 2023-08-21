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
      <button @click="proxReservaciones" class="btn btn-makers">
        Generar pdf
      </button>
      <button @click="prevReservaciones" class="btn btn-makers">
        Generar pdf
      </button>
      <button @click="lessProductos" class="btn btn-makers">Generar pdf</button>
      <button @click="EmpleadoPlace" class="btn btn-makers">Generar pdf
    </button>
      <button @click="EmpleadoTime" class="btn btn-makers">Generar pdf
    </button>
    </div>
    <div class="container-ventas-graph">
      <canvas id="ventas"></canvas>
    </div>
    <div class="container-graph">
      <canvas id="categorias"></canvas>
    </div>
    <div class="container-mesordenes-graph">
      <canvas id="mesorden"></canvas>
    </div>
    <div class="container-topprod-graph">
      <canvas id="topp"></canvas>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { lineGraph, barGraph } from "./charts";
import { generateTablePDF } from "./reports";

export default {
  name: "inicio",
  created() {
    let month = new Date().getMonth();
    this.mes = month;
  },
  data() {
    let meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return {
      title: "",
      mes: "",
      meses,
    };
  },
  methods: {
    // método para obtener las ventas
    getVentasPromise() {
      // realizar petición para obtener los meses y la cantidad de ventas por este tiempo
      axios
        .get("http://localhost:3000/api/graficas/ventas")
        // si la petición se realiza correctamente
        .then((rows) => {
          // crear arreglos para dividir o desagrupar en ordenes o ventas que se a realizado en el mes
          // y los meses para
          let venta = [],
            mes = [];
          let ventas = rows.data;
          // recorrer los datos encontrados
          for (let i = 0; i < ventas.length; i++) {
            // agregarlos a los arreglos para desagrupar cada uno
            mes.push(ventas[i].mes);
            venta.push(ventas[i].venta);
          }
          // con los arreglos con datos, crear la gráfica
          lineGraph("ventas", mes, venta, "Ventas");
        })
        .catch((e) => {
          alert(e.response.data.error);
        });
    },
    getOrdenesByMes() {
      let req = this.mes + 1;
      axios
        .get("http://localhost:3000/api/graficas/ordenesmes/" + req)
        .then((rows) => {
          let dia = [],
            ordenes = [],
            data = rows.data;
          for (let i = 0; i < data.length; i++) {
            dia.push(data[i].fecha);
            ordenes.push(data[i].ordenes);
          }

          lineGraph("ordenesMes", dia, ordenes, "Ordenes por día según mes");
        })
        .catch((e) => alert(e));
    },
    getPopularidad() {
      axios
        .get("http://localhost:3000/api/graficas/topp")
        .then((rows) => {
          let topp = rows.data;
          for (let i = 0; i < topp.length; i++) {
            this.servicio.push(topp[i].servicio);
            this.cantidad.push(topp[i].cantidad);
          }

          barGraph("Top Productos", this.servicio, this.cantidad, "Ventas")();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getOrdenesby() {
      axios
        .get("http://localhost:3000/api/graficas/mesres")
        .then((rows) => {
          let mesorden = rows.data;
          for (let i = 0; i < mesorden.length; i++) {
            this.mes.push(mesorden[i].mes);
            this.orden.push(mesorden[i].orden);
          }

          lineGraph("Ordenes", this.mes, this.orden, "Ordenes");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async proxReservaciones() {
      // realizar petición según el reporte
      try {
        // llamar la función asicrona para obtener los datos de la petición
        const RESERVACIONES = await axios.get(
          "http://localhost:3000/api/reportes/proxreservaciones"
        );
        // obtener la 'data' de la función asicrona
        const ROWS = RESERVACIONES.data;
        // declarando datos para poner en el header de la tabla
        const colNames = ["Fecha", "Hora", "Cliente", "DUI", "Empleado", "DUI"];
        // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
        // o la obtenido en la petición (Network)
        const colData = ROWS.map((row) => [
          row.fecha,
          row.hora,
          row.cliente,
          row.duicliente,
          row.empleado,
          row.duiempleado,
        ]);
        // llamando al método para generar reportes
        generateTablePDF(
          "proxReservaciones",
          "Próximas Reservaciones",
          colNames,
          colData
        );
      } catch (e) {
        e.response.data.error ? alert(e.response.data.error) : alert(e);
      }
    },
    async prevReservaciones() {
      try {
        // realiza la petición para obtener las reservaciones antes del día que se generé el reporte
        const RESERVACIONES = await axios.get(
          "http://localhost:3000/api/reportes/prevreservaciones"
        );
        // obtener los datos de la petición
        const ROWS = RESERVACIONES.data;
        // declarando un arreglo para guardar los nombres de la columnas de la tabla
        const colNames = ["Fecha", "Hora", "Cliente", "DUI", "Empleado", "DUI"];
        // obteniendo los datos para mostrar en la tabla del reporte, este tiene que ir de acuerdo al nombre del campo en la db
        // o la obtenido en la petición (Network)
        const colData = ROWS.map((row) => [
          row.fecha,
          row.hora,
          row.cliente,
          row.duicliente,
          row.empleado,
          row.duiempleado,
        ]);
        // llamando al método para generar reportes
        generateTablePDF(
          "prevReservaciones",
          "Reservaciones Previas",
          colNames,
          colData
        );
      } catch (error) {
        error.response.data.error
          ? alert(error.response.data.error)
          : alert(error);
      }
    },
    async lessProductos() {
      try {
        // realizar petición para obtener los datos para llenar el reporte
        const PRODUCTOS = await axios.get(
          "http://localhost:3000/api/reportes/lessproductos"
        );
        // extraer los datos de la petición
        const ROWS = PRODUCTOS.data;
        // definiendo el nombre de la columnas para la tabla del reporte
        const NAMES = ["Sucursal", "Servicio", "Cantidad", "Precio"];
        // obteniendo los datos resultados de la petición y mapear (crear un arreglo copia
        // con los datos recuperados de la petición y separlas según el nombre obtenido en .data)
        const VALUES = ROWS.map((row) => [
          row.nombre_sucursal,
          row.nombre_servicio,
          row.cantidad,
          "$" + row.precio,
        ]);
        // generar el reporte con la tabla
        generateTablePDF(
          "casi-agotados",
          "Servicios a punto de agotarse",
          NAMES,
          VALUES
        );
      } catch (error) {
        error.response.data.error
          ? alert(error.response.data.error)
          : alert(error);
      }
    },
    async EmpleadoTime() {
      try {
        const EMPLEADO = await axios.get(
          "http://localhost:3000/api/reportes/empleadoshorario"
        );
        const ROWS = EMPLEADO.data;
        const colNames = ["Fecha", "Hora", "Cliente", "DUI", "Empleado", "DUI"];
        const colData = ROWS.map((row) => [
          row.fecha,
          row.hora,
          row.cliente,
          row.duicliente,
          row.empleado,
          row.duiempleado,
        ]);
        generateTablePDF(
          "empleado-time",
          "Empleados por horario",
          colNames,
          colData
        );
      } catch (e) {
        e.response.data.error ? alert(e.response.data.error) : alert(e);
      }
    },
    async EmpleadoPlace() {
      try {
        // llamar la función asicrona para obtener los datos de la petición
        const EMPLEADO = await axios.get(
          "http://localhost:3000/api/reportes/empleadossucursal"
        );
        const ROWS = EMPLEADO.data;
        const colNames = ["Fecha", "Hora", "Cliente", "DUI", "Empleado", "DUI"];
        const colData = ROWS.map((row) => [
          row.fecha,
          row.hora,
          row.cliente,
          row.duicliente,
          row.empleado,
          row.duiempleado,
        ]);
        generateTablePDF(
          "empleado-place",
          "Empleados por Sucursal",
          colNames,
          colData
        );
      } catch (e) {
        e.response.data.error ? alert(e.response.data.error) : alert(e);
      }
    },
  },
  mounted() {
    this.getVentasPromise();
    this.getOrdenesByMes();
    this.getOrdenesby();
    this.getPopularidad();
  },
};
</script>
