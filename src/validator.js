// archivo con las funciones para validar
// ! VALIDA DATOS DEL FRONTEND

// variable con las letras
let ltrs = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s']+$/;
// variable con los números
let nums = /^[0-9]+$/;
// exp. reg. dui
let dui = /^[0-9]{8}[-][0-9]{1}$/;
// exp. regular para correo
let mail = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
// variable con la expresión regular para contraseña
let clave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?!.*\s).{8,72}$/;

let decimal = /^([0-9]{1,10}(\.[0-9]{1,2})?)$/
/**
 * Método para validar que la cadena de texto solamente tenga letras
 */
export const onlyLtrs = value => {
    // verificar sí el valor es una cadena de texto  
    return (ltrs.test(value));
}
/**
 * Método para validar sí la contraseña cumple el formato 8-72 caracteres,
 * min: 1 minscula, 1 mayuscula, 1 digito, 1 caracter especial, 
 * 0 espacios
 * @param {*} value 
 */
export const password = value => {
    // verificar sí la contraseña coincide
    return (clave.test(value));
}

export const onlyDecimal = value => {
    return (decimal.test(value))
}

export const onlyNumb = value => {
    // verificar sí coincide
    return (nums.test(value));
}

export const formatDui = value => {
    // validar sí coincide con la expresión regular
    return (dui.test(value));
}

export const formatEmail = value => {
    // validar sí coincide con la presión regular
    // console.log((mail.test(value)));
    return (mail.test(value));
}

export const formatDateToDDMMYYYY = date => {
    // obtener los días en base a la fecha obtenida
    const day = String(date.getDate()).padStart(2, '0');
    // extraer mes del parametro
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en Date empiezan desde 0
    // obtener el año con los 4 digitos de la fecha obtenida
    const year = date.getFullYear();
    // retornar la fecha en formato dd/mm/yyyy
    return `${day}/${month}/${year}`;
}
export const formatDateToYYYYMMDD = date => {
    // obtener los días en base a la fecha obtenida
    const day = String(date.getDate()).padStart(2, '0');
    // extraer mes del parametro
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // obtener el año con los 4 digitos de la fecha obtenida
    const year = date.getFullYear();
    // retornar la fecha en formato yyyy-mm-dd
    return `${year}-${month}-${day}`;
}

/**
 * Método para convertir el binario de la consulta a binario
 */
export const convertToBin = bin => {
    (bin) ? bin = Buffer.from(bin).toString('binary') : bin = null
    return bin
}

/**
 * método para obtener id en formato binario
 * de los datos obtenidos
 * @param {*} data respuesta con los datos recuperados
 * @param {*} col  campo 'Buffer' extraido de la db, la col debe existir en el parametro data
 * @returns binary
 */
export const getBinary = (data, col = null) => {
    let id = [];
    // recorrer los datos obtenidos
    if (col) {
        data.forEach(element => {
            // convertir a binario el elemento que se este recorriendo
            id.push(convertToBin(element[col]));
        });
    } else {
        id.push(convertToBin(data))
    }
    return id;
}