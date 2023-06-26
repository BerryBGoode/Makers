//arcchivo con las validaciones para los datos de las reservaciones (entidad de la db)

//importar body para validar
const { body } = require('express-validator')

//expresión regular con la fecha
const fechaExpresionRegular = /^\d{2}\/\d{2}\/\d{4}$/;

//expresion regular con la hora
const horaExpresionRegular = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

//verificar dato por dato según lo que se desee

//validacion con fecha
const validarFecha = fecha => {
    if (fechaExpresionRegular.test(fecha)) {
        console.log("La fecha es válida.");
        // Continúa con el procesamiento de los datos recibidos del servidor
    } else {
        console.log("La fecha no cumple con el formato esperado.");
        // Realiza alguna acción en caso de que la fecha no sea válida
    }
}

const validarHora = hora => {
    if (horaExpresionRegular.test(hora)) {
        console.log("La hora es válida.");
        // Continúa con el procesamiento de los datos recibidos del servidor
    } else {
        console.log("La hora no cumple con el formato esperado.");
        // Realiza alguna acción en caso de que la hora no sea válida
    }
}


