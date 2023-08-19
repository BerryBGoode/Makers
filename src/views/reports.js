/**
 * ! En este archivo se definin el formato de página para los reporte * 
 */
// importando jsPDF Para poder generar, modificar el pdf
import jsPDF from 'jspdf';
// importando jspdf-autotable para generar una tabla automatica
import 'jspdf-autotable';

export const generateTablePDF = (pdf, title, names, values) => {
    try {


        // a partir de aquí genera el reporte
        const PDF = new jsPDF();

        // definiendo el tamaño de letra para los reportes
        PDF.setFontSize(15);
        // ingresando el titulo del reporte
        PDF.text(title, 15, 20);
        // definiendo el logo de la empresa en la parte superior derecha
        PDF.addImage('/src/assets/img/logos/logo_gris.png', 'PNG', 155, 15, 40, 10)
        // a continuación se define la tabla y lo que contedrá dentro de ella
        // creando la tabla con los datos de cabeza, los datos de la petición y donde inicia
        PDF.autoTable({
            head: [names],
            body: values,
            startY: 45,
            didDrawCell: data => {
                if (data.row.index) {
                    data.cell.styles.fillColor = [255, 255, 255]
                }
            }
        })

        // definiendo el logo para water_mark de los reportes de la empresa
        let img = '/src/assets/img/logos/logo_gris_nav.png', width = 10, height = 10;
        // obteniendo la cantidad de páginas que se generaron
        const PAGE = PDF.internal.getNumberOfPages();
        // recorriendo la cantidad de páginas encontradas para agregar algunas configuraciones visuales
        // de la página
        for (let i = 0; i <= PAGE; i++) {
            // agregando la página
            PDF.setPage(i);
            // obteniendo la esquina inferior para agregarle algo visual en la parte del pie
            const X = (PDF.internal.pageSize.width - width) - 10;
            const Y = (PDF.internal.pageSize.height - height) - 10;
            // agregando la water mark al pie de la página
            PDF.addImage(img, 'PNG', X, Y, width, height);
            i = i + 1;
            // enviando el tamaño de la letra para el pie de la página
            PDF.setFontSize(12)
            // agregando el número de página
            PDF.text(i.toString(), (PDF.internal.pageSize.width - width) / 2, 282.5);
        }

        PDF.save(pdf + '.pdf');
    } catch (e) {
        console.log(e);
    }
}