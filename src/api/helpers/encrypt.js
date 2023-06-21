// requerir de un bcryptjs para aplicar un hash a la contraseña
const bcrypt = require('bcryptjs');

/**
 * Método para encryptar la contraseña aplicando un algoritmo que modifica
 * el string original, para después hashar el string
 */
const encrypt = (clave) => {
    try {
        // aplicar modificación de string a la clave
        const SALT = bcrypt.genSaltSync(10);
        // hashear contraseña
        return bcrypt.hashSync(clave, SALT);
        
    } catch (error) {
        console.log(error);
    }
}

// exportar modulo
module.exports = encrypt;