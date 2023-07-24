/**
 * Método para obtener los errores al realizar query
 * aquí recibe el código del error
 * retornar mensaje de error
 */
const getError = (err = null) => {

    let msg;
    switch (err) {
        case 1062:
            msg = 'Dato unico ya registrado';
            break;
    
        case 1451:
            msg = 'No se puede eliminar debido a que tiene datos asociados';
            break;
        default:
            msg = null;
            break;
    }
    return msg;
}

module.exports = { getError }