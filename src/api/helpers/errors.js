/**
 * Método para obtener los errores al realizar query
 * aquí recibe el código del error
 * retornar mensaje de error
 */
const getError = (err = null) => {

    let msg;
    switch (err) {
        case '23505':
            msg = 'Dato unico ya registrado';
            break;
    
        case '23503':
            msg = 'No se puede modificar o eliminar debido a pedidos asociados';
            break;
        default:
            msg = null;
            break;
    }
    return msg;
}

module.exports = { getError }