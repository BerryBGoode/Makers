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
        case 1064:
            msg = 'Error en la sentencia';
            break;
        case 1146:
            msg = 'Entidad especificada inexistente'; 
            break;
        case 1065:
            msg = 'Consulta vacía';
            break;
        default:
            msg = null;
            break;
    }
    return msg;
}

module.exports = { getError }