// requerir de un bcryptjs para aplicar un hash a la contraseña
const bcrypt = require('bcryptjs');

/**
 * Método para encryptar la contraseña aplicando un algoritmo que modifica
 * el string original, para después hashar el string
 */
const encrypt = clave => {
    try {
        // aplicar modificación de string a la clave
        const SALT = bcrypt.genSaltSync(10);
        // hashear contraseña
        return bcrypt.hashSync(clave, SALT);

    } catch (error) {
        console.log(error);
    }
}

/**
 * Método para convertir el binario de la consulta a binario
 */
const convertToBin = bin => {
    (bin) ? bin = Buffer.from(bin).toString('binary') : bin = null
    return bin
}

/**
 * Metodo para convertir a base64
 */
const convertToBase64 = string => {
    return Buffer.from(string).toString('base64');
}
/**
 * Metodo para decodificar base64
 */
const decodeBase64 = string => {
    const binString = atob(string);
    return convertToBin(Uint8Array.from(binString, (m) => m.codePointAt(0)));
}




// exportar modulo
module.exports = { encrypt, convertToBin, convertToBase64, decodeBase64 };