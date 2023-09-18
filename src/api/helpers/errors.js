/**
 * Método para obtener los errores al realizar query
 * aquí recibe el código del error
 * retornar mensaje de error
 */
const getError = (err = null) => {

    console.log(err)
    err = err['errno'];
    let msg;
    switch (err) {
        case 1054:
            msg = 'Error al obtener dato/s especificado'
            break;
        case 1062:
            msg = 'Dato unico ya registrado';
            break;
        case 1451:
            msg = 'No se puede eliminar debido a que tiene datos asociados';
            break;
        // case 1064:
        //     msg = 'Error en la sentencia';
        //     break;
        // case 1146:
        //     msg = 'Entidad especificada inexistente';
        // break;
        // case 1065:
        //     msg = 'Consulta vacía';
        //     break;
        case -4078:
            msg = 'Error al conectar con el servidor de base de datos';
            break;
        default:
            msg = 'Surgio un problema en el servidor';
            break;
    }
    return msg;
}

module.exports = { getError }