// requeriendo bcrpypt para verificar contraseña
const { compareSync } = require('bcryptjs')
// requeriendo jwt o jsonwebtoken, para crear token cuando se inicie sesión
const jwt = require('jsonwebtoken');
// importando método para hashear contraseñass
const { encrypt } = require('../helpers/encrypt');
const { execute } = require('../MySQL');
const { getBinary, convertToBinary } = require('../helpers/validateHelpers');
const { getError } = require('../helpers/errors');
const { sendMail } = require('../helpers/mailer');

let current = new Date;
const HOY = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();

// variable global para almacenar el id del usuario que se espera que restablezca la contraseña
let id;

// definiendo estructura básica del mensaje se que enviará cuando alguien haya ingresado algún dato perteneciente a otro usuario
const SUPLANTACION_MSG = 'Te saludamos de parte de Makers esperando que se encuentres bien, por este medio avisamos que alguien ha intentado iniciar sesión y ha agregado un dato perteneciente a tú usuario.\nTe recomendamos estar muy alerta a cualquier situación';
const SUPLANTACION_SUB = 'AVISO DE SUPLANTACIÓN...';
/**
 * Método para comprar la clave que front, con la clave de la database
 * @param {*} client clave que ingreso el cliente en el body de la petición
 * @param {*} db clave obtenida de la database
 * @returns 
 */
const compare = (client, db) => {
    return (compareSync(client, db))
}


const generatePIN = length => {
    // definiedo los caracteres que pueden ir en el pin
    let caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let result = '';

    // agregando al result un random de los caracteres, según la longitud
    for (let i = 0; i < length; i++) {

        // creando el indice que sea el resultado de un número random * la cantidad de caracteres que tiene caracters
        let index = Math.floor(Math.random() * caracters.length)

        // alamenando el indice según el index encontrado de caracters
        result += caracters.charAt(index);

    }
    // retornar PIN
    return result
}


const validatePIN = async (req, res) => {
    // variable para identificar sí el pin es correcto
    let auth = false, _pin, _id;
    // obtener el pin enviado por el cliente y los datos del usuario
    const { pin, dui, correo, alias } = req.body
    // obteniendo el pin de la db
    let db = await execute('SELECT PIN, id_empleado FROM empleados WHERE dui = ? AND correo = ? AND alias = ? AND estado = ?', [dui, correo, alias, 1])
    // recuperar de los arreglos los datos en seco
    for (let i = 0; i < db.length; i++) {
        // obteniendo el pin de la db
        _pin = db[i]['PIN'];
        // obteniedl id de la db
        _id = db[i]['id_empleado'];
    }
    // comparar pin
    if (db && compare(pin, _pin)) {
        // reinciar a 0 los intentos
        await execute('UPDATE empleados SET intentos = 0 WHERE dui = ? AND correo = ? AND alias = ? AND estado = ? AND id_empleado = ?', [dui, correo, alias, 1, _id])
        auth = true;
        res.status(200).json(auth);
    } else {
        res.status(500).json('Surgio un problema al buscar PIN');
    }
}

/**
 * Método para validar sí los datos que se envian del login existen
 */
const validateUsuario = async (req, res) => {
    // variables para enviar 1 mensaje al hacer la petición 
    let auth = false, msg, token, status = '', modif = false, clave_db, id, fecha;
    // obtener los datos
    const { dui, correo, clave, alias, autenticacion } = req.body;
    try {
        const CLAVE = await execute('SELECT clave, id_empleado, fecha_ingreso FROM empleados WHERE dui = ? AND correo = ? AND alias = ? AND estado = ?', [dui, correo, alias, 1])
        if (CLAVE) {

            // obtener clave cuando
            id = getBinary(CLAVE, 'id_empleado')[0];
            // enviando un id encriptado para tener un valor unico en el id
            for (let i = 0; i < CLAVE.length; i++) {
                // obtener la clave
                clave_db = CLAVE[i]['clave'];
                // obteniendo el id del empleado encontrado
                // obtener la fecha que se ingreso
                fecha = CLAVE[i]['fecha_ingreso']
            }
            // compara claves'
            if (clave_db && compare(clave, clave_db)) {

                // verificar sí el usuario ha deceado autenticarse otra vez
                if (autenticacion === true) {
                    // generar un pin random
                    const PIN = generatePIN(6);
                    // hacer un update con PIN hasheado
                    await execute('UPDATE empleados SET PIN = ? WHERE id_empleado = ?', [encrypt(PIN), id])
                    // enviando correo
                    sendMail(correo, 'Segunda autenticación', 'Te saludamos de parte de Makers esperando que se encuentres bien, por este medio enviamos tú PIN para seguir con tú autenticación. \nTú PIN es: ' + PIN);
                }


                // reinciar a 0 los intentos
                await execute('UPDATE empleados SET intentos = 0 WHERE dui = ? AND correo = ? AND alias = ? AND estado = ?', [dui, correo, alias, 1])
                // clave correcta
                // obtener los datos del empleado encontrado 
                // crear token
                token = await getToken(dui, correo, clave_db)
                // enviar el estado de la autenticación
                auth = true;


                // Crear dos objetos Date para representar las fechas que deseas comparar
                let today = new Date(HOY);
                let fechadb = new Date(fecha);

                // Calcular la diferencia en milisegundos
                let deltamls = today - fechadb;

                // Calcular la diferencia en días
                let deltadias = deltamls / (1000 * 60 * 60 * 24);
                // calculando diferencia
                (Math.round(deltadias) > 1) ? modif = true : modif = false;

                // verificar sí han pasado los días establecidos para cambiar la contraseña
                // 
            } else {
                // Apartir de aquí empizar los intentos 

                // obteniendo el dui y usuario a partir del dui, para verificar sí existe empleado con esos datos
                const DUI = await execute('SELECT alias, correo FROM empleados WHERE dui = ?', [dui])
                const CORREO = await execute('SELECT alias FROM empleados WHERE correo = ?', [correo])
                const USUARIO = await execute('SELECT alias, correo FROM empleados WHERE alias = ?', [alias])

                // veirficar cuando todos los datos estan agregandos ya a la db
                if (DUI.length > 0 && CORREO.length > 0 && USUARIO.length > 0) {
                    switch (true) {
                        // verficando cuando el alias del correo y dui son iguales
                        // pero el ingresado por el usuario no
                        case DUI[0].alias === CORREO[0].alias && DUI[0].alias !== USUARIO[0].alias:
                            // agregar suplantación
                            agregandoSuplantacionByAlias(alias);
                            // enviando correo de aviso de suplantación
                            sendMail(USUARIO[0].correo, SUPLANTACION_SUB, SUPLANTACION_MSG);
                            // agregar 1 intento por correo y dui
                            agregandoIntentoByNotAlias(correo, dui)
                            // Agregar intento fallido para el usuario con alias DUI[0].alias
                            break;

                        // cuando se puso el correo de un empleado o usuario existente direferente del que se quiere acceder
                        case DUI[0].alias === alias && CORREO[0].alias !== alias:
                            // agregar notificación de suplantación
                            agregandoSuplantacionByCorreo(correo);
                            // enviando avisao de suplantación al usuario
                            sendMail(correo, SUPLANTACION_SUB, SUPLANTACION_MSG);
                            // agregando 1 intento
                            agregarIntentoByDui(dui, alias);
                            break;

                        // cuando se puso el dui de un empleado existente (suplantación)
                        case CORREO[0].alias === alias && DUI[0].alias !== alias:
                            // agregando notificación de suplantación
                            agregandoSuplantacionByDui(dui);
                            // enviando notificación de suplantación
                            sendMail(DUI[0].correo, SUPLANTACION_SUB, SUPLANTACION_MSG);
                            // agregando 1 intento
                            agregarIntentoByCorreo(correo, alias);
                            break;
                        // cuando solamente la contraseña es incorrecta
                        case CORREO[0].alias === alias && DUI[0].alias === alias:
                            // agregar intento
                            agregarIntentoByDui(dui, alias);
                            break;

                        default:
                            console.log('Credenciales de distintos usuarios');
                            break;
                    }

                }
                // verificar sí se encontró usuario por medio del dui
                // cuando el correo no existe
                else if ((DUI.length > 0 && CORREO.length <= 0 && USUARIO.length <= 0) ||
                    (CORREO.length <= 0 && DUI.length > 0 && USUARIO.length > 0)) {
                    // agregar intentos a usuario según dui
                    (DUI[0].alias === alias) ? agregarIntentoByDui(dui, alias) : agregandoSuplantacionByDui(dui);
                }
                // cuando es dui inexistente
                // verificar sí se encontró usuario por medio del correo
                else if ((CORREO.length > 0 && DUI.length <= 0 && USUARIO.length <= 0) ||
                    (DUI.length <= 0 && CORREO.length > 0 && USUARIO.length > 0)) {
                    // agregar intentos a usuario según correo
                    (CORREO[0].alias === alias) ? agregarIntentoByCorreo(correo, alias) : agregandoSuplantacionByCorreo(correo);
                }
                // verificar sí se encontró un usuario por medio del nombre de usuario
                else if (USUARIO.length > 0 && CORREO.length <= 0 && USUARIO.length <= 0) {
                    // agregando intentos a usuario por medio del correo y dui
                    // haciendo referencia que
                    agregandoIntentoByAlias(alias)
                }
                // cuando el usuario no existe
                else if (USUARIO.length <= 0 && CORREO.length > 0 && DUI.length > 0) {
                    // agreando intento
                    agregandoIntentoByNotAlias(correo, dui)
                }
                msg = 'Usuario o contraseña incorrecta';
                auth = false;
                token = '';
            }
            res.status(200).send({ msg, auth, token, modif, id });
        }
    } catch (error) {
        res.status(500).send(getError(error))
    }
}

// Método para obtener el cargo del empleado registrados
const getCargo = async (req, res) => {
    // verificar autenticación
    if (req.headers.authorization) {
        // obtener id del token
        const ID = jwt.decode(req.headers.authorization);
        // obtener el cargo
        let cargo = await execute('SELECT cargo FROM empleados_view WHERE id_empleado = ?', [ID])
        // verificar sí realizo la petición
        if (cargo) {
            // retornar respuesta
            res.status(200).json(cargo[0].cargo)
        }
    } else {
        res.status(401).json('Debe auntenticarse antes');
    }
}

/**
 * Método que agrega 1 a los intentos, por correo (UPDATE)
 * @param {*} correo correo del usuario que se agrega un intento
 * @param {*} alias alias del usuario que se agrega un intento
 */
const agregarIntentoByCorreo = async (correo, alias) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE correo = ? AND alias = ?', [correo, alias]);
        let origin = {
            correo: correo,
            alias: alias,
            case: 1
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE correo = ? AND alias = ?', [correo, alias]);
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Método para agregar intentos por medio del dui
 * @param {*} dui dui del usuario a agregar inteto
 * @param {*} alias alias del usuario a agregar inteto
 */
const agregarIntentoByDui = async (dui, alias) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE dui = ? AND alias = ?', [dui, alias]);
        let origin = {
            alias: alias,
            dui: dui,
            case: 2
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE dui = ? AND alias = ?', [dui, alias]);
        }
    } catch (error) {
        throw error;
    }
}
/**
 * Método para agregar 1 intento cuando el alias sea el incorrecto
 * @param {*} correo correo del usuario
 * @param {*} dui dui del usuario
 */
const agregandoIntentoByNotAlias = async (correo, dui) => {
    try {
        await execute('UPDATE empleados SET intentos = intentos + 1 WHERE correo = ? AND dui = ?', [correo, dui]);
        let origin = {
            correo: correo,
            dui: dui,
            case: 3
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE correo = ? AND dui = ?', [correo, dui]);
        }
    } catch (error) {
        throw error;
    }
}
/**
 * Método para agregar intento solamente por el alias
 * @param {*} alias alias del usuario
 */
const agregandoIntentoByAlias = async alias => {
    try {
        await execute('UPDATE empledos SET intentos = intentos + 1 WHERE alias = ?', [alias]);
        let origin = {
            alias: alias,
            case: 4
        }
        // verificar la cantidad de intetos para bloquear
        if (await getIntentos(origin) > 3) {
            execute('UPDATE empleados SET estado = 2 WHERE alias = ?', [alias]);
        }
    } catch (error) {
        throw error;
    }
}

const getIntentos = async origin => {
    let intentos;
    switch (origin.case) {
        case 1:
            intentos = await execute('SELECT intentos FROM empleados WHERE correo = ? AND alias = ?',
                [origin.correo, origin.alias]);
            break;
        case 2:
            intentos = await execute('SELECT intentos FROM empleados WHERE dui = ? AND alias = ?',
                [origin.dui, origin.alias]);
            break;
        case 3:
            intentos = await execute('SELECT intentos FROM empleados WHERE correo = ? AND dui = ?',
                [origin.correo, origin.dui]);
            break;

        case 4:
            intentos = await execute('SELECT intentos FROM empleados WHERE alias = ?', [origin.alias])
            break;
        default:
            intentos = 0;
            break;
    }
    return intentos[0].intentos;
}

const agregandoSuplantacionByAlias = async alias => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE alias = ?', [alias])
    } catch (error) {
        throw error;
    }
}

/**
 * Método para agregar uno a la cantidad de veces que se ha intentado ingresar a una cuenta
 * y casualmente puso el correo de un usuario existente
 * @param {*} correo 
 */
const agregandoSuplantacionByCorreo = async correo => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE correo = ?', [correo]);
    } catch (error) {
        throw error;
    }
}

/**
 * Método para agregar 1 a la cantidad de veces que se ha probado un dato existente diferente a la credencia
 * @param {*} dui 
 */
const agregandoSuplantacionByDui = async dui => {
    try {
        await execute('UPDATE empleados SET suplantaciones = suplantaciones + 1 WHERE dui = ? ', [dui])
    } catch (error) {
        throw error;
    }
}

/**
 * Método para obtener el cliente según los parametros especificados por el método
 * @param {*} dui dui del empleado a buscar
 * @param {*} correo correo del empleado a buscar
 * @param {*} clave clave del empleado a buscar
 * @returns retornar un arreglo de obj con los datos del cliente
 */
const getToken = async (dui, correo, clave) => {
    // realizar consulta
    let token, id;
    const EMPLEADO = await execute('SELECT id_empleado, nombres FROM empleados WHERE dui = ? AND correo = ? AND clave = ?', [dui, correo, clave])
    if (EMPLEADO) {
        // obtener binario del id
        let _empleado = getBinary(EMPLEADO, 'id_empleado');
        // recorrer los registros encontrados
        for (let i = 0; i < EMPLEADO.length; i++) {
            // crear obj con el nuevo id
            let id = {
                id_empleado: _empleado[i]
            }
            // funsionar obj con los datos recuperados con el de los ids limpiados
            Object.assign(EMPLEADO[i], id);
            // obtener id del empleado encontrado
        }
        // convertir id a base 64
        id = EMPLEADO[0]['id_empleado'];
        token = jwt.sign(id, process.env.SECRET, { algorithm: 'HS512' })
        return token
    }
}

/**
 * Método para obtener los datos del empleado según token para poder modificar
 */
const getConfig = async (req, res) => {
    const TOKEN = req.headers.authorization;
    if (TOKEN) {
        try {
            // obtener id del empleado
            const ID = jwt.decode(TOKEN);
            // realizar query
            const EMPLEADO = await execute('SELECT nombres, apellidos, dui, telefono, correo, alias  FROM empleados_view WHERE id_empleado = ?', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes')
    }
}

const restablecer = async (req, res) => {
    const ID = req.headers.authorization;
    if (ID) {
        try {
            // realizar query
            const EMPLEADO = await execute('SELECT nombres, apellidos, dui, telefono, correo, alias  FROM empleados_view WHERE id_empleado = ?', [ID])
            // retornar los datos sí la respuesta es la esperada
            if (res.status(200)) res.send(EMPLEADO[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

const cambiarClave = async (req, res) => {
    // obtener la clave del body de la petición
    let { clave, id } = req.body;
    // verificar sí se ha enviado algo para autenticarse
    if (req.headers.authorization) {
        // decodficar id
        id = convertToBinary(id)
        if (!compareSync(clave, await getClaveDB(id))) {
            clave = encrypt(clave);
            // modificar datos del empleado
            //  * nueva clave
            //  * nueva fecha de contraseña
            //  * intentos a 0
            //  * cambio de estado a desbloqueado
            execute('UPDATE empleados SET clave = ?, fecha_ingreso = ?, estado = ?, intentos = ? WHERE id_empleado = ?',
                [clave, HOY, 1, 0, id])
                .then(() => {
                    res.status(201).send('Datos modificados');
                }).catch(rej => {
                    res.status(500).send(getError(rej));
                })
        } else {
            res.status(500).send('La nueva contraseña debe ser diferente a la actual');
        }
    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}

const validateUsuarioBloqueado = async (req, res) => {
    // objeto para guardar al empleado encontrado y después retornar como respuesta
    let $2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC = {};
    // variable que cambia cuando el id de la db coincide con el extraido de la request
    let found = false;
    // verificar sí se obtiene el token
    if (req.headers.authorization) {
        // obtener los ids de los empleados que estan bloqueados
        let empleados = await execute('SELECT id_empleado, nombres, apellidos, dui, telefono, correo, alias, fecha_ingreso, estado FROM empleados', [2])
        // verificar sí existen empleados bloqueados
        if (empleados.length > 0) {
            //      verificar por cada id encontrado sí coincide con el obtenido del frontend
            // decodificar todos id a binary
            let id = getBinary(empleados, 'id_empleado')
            let token;
            // dependiendo sí venga en formato de jwt extraer del token o no
            // extrayendo el token a string
            (jwt.decode(req.headers.authorization)) ? token = jwt.decode(req.headers.authorization).id : token = req.headers.authorization
            for (let i = 0; i < empleados.length; i++) {
                // guardando en otra propieda el valor del id del empleado para no enviar la col de manera cruda
                empleados[i].GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC = empleados[i].id_empleado;
                // eliminando la propiedad id de objeto con los empleados encontrados con estado bloqueado
                delete empleados[i].id_empleado;
                // asginando id a esta variable para que sea un string y 'compaseSync' no generé conflictos
                // verificando la coincidencia de id de la db con el obtenido del frontend
                // asignando el encontrado a la variable q busca
                found = compareSync(id[i].toString(), token.toString())
                // vericar sí se encontró usuario bloqueado y con el id que viene del request
                if (found === true) {
                    // al objeto vacío asignar los datos que tiene el objeto que coincidio la comparación
                    // del id que viene del request con el de la db
                    Object.assign($2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC, empleados[i])
                    // y romper el ciclo for, sí se encontró empleado bloqueado con el que coincida el id del request
                    break;
                }
            }
            // Crear dos objetos Date para representar las fechas que deseas comparar
            let today = new Date(HOY);
            let fechadb = new Date($2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC.fecha_ingreso);

            // Calcular la diferencia en milisegundos
            let deltamls = today - fechadb;

            // Calcular la diferencia en días
            let deltadias = deltamls / (1000 * 60 * 60 * 24);
            // // calculando diferencia
            // (Math.round(deltadias) > 1) ? modif = true : modif = false;

            // verificar el estado del empleado es bloqueado o que la fecha para cambio de contraseña pasé la fecha establecida
            ($2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC.estado === 2 || Math.round(deltadias >= 1)) ?
                res.status(200).json($2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC)
                :
                res.status(200).json({ msg: 'Usuario no encontrado', found: false });

            // verificar sí se encontró un usuario con ese id y que este bloqueado
            // para mandar respuesta para mandar a otro lado o dejar que restablezca la contraseña
            // sí se encuntra usuario mandar datos para que sean diferentes a sus datos personales     
        } else {
            res.status(404).json('Usuario no encontrado');
        }

    } else {
        res.status(401).json('Debe autenticarse antes');
    }
}

const validateRecuperación = async (req, res) => {
    // obtener los datos
    const { dui, alias, correo } = req.body;
    // verfiicar sí existe usuario
    const EMPLEADO = await execute('SELECT id_empleado FROM empleados WHERE alias = ? AND dui = ? AND correo = ?', [alias, dui, correo])
    if (EMPLEADO.length > 0) {
        // obtener id
        let objid = {
            id_empleado: getBinary(EMPLEADO, 'id_empleado')[0]
        }
        // almancenando id esperado para poder modificar la contraseña
        id = objid.id_empleado;
        objid.id_empleado = encrypt(objid.id_empleado);
        // creando token con algoritmo HS256 con el tiempo definido en segundos
        const token = jwt.sign({ id: objid.id_empleado }, process.env.SECRET, { algorithm: 'HS256', expiresIn: 1800 });
        // enviar url para restablecer contraseña con id hasheado
        // enviando token hasheado para poder acceder a restablecer contraseña:
        /**
         * * Dentro de restablecer contraseña
         * 1: en el mounted mandar id al servidor
         * 1.1 servidor: decodificar token
         * 1.2           obtener id del token y comparar con el id que se esperaba obtener   
         */
        let url = 'http://localhost:5173/#/restablecer=' + token
        // enviar correo con url
        sendMail(correo, 'Recuperación de contraseña', 'Te saludamos de parte de Makers esperando que se encuentres bien, por este medio te enviamos la direccionar para poder restablecer contraseña\n' + url)
        res.status(200).json('Verificar correo');

    } else {
        res.status(500).json('Usuario no encontrado');
    }
}

/**
 * Método para mostrar datos pequeños del usuario
 */
const getInfo = async (req, res) => {
    const TOKEN = req.headers.authorization;
    if (TOKEN) {
        try {
            // obtener id del empleado (deficando base64)
            const ID = jwt.decode(TOKEN);
            // realizar query
            execute('SELECT alias,cargo FROM empleados_view WHERE id_empleado = ?', [ID])
                // retornar los datos sí la respuesta es la esperada
                .then(rows => { res.send(rows[0]); })
                .catch(rej => { console.log(rej); res.send(getError(rej)) })

        } catch (error) {
            console.log(error);
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes')
    }
}

/**
 * Método para obtener la contraseña anterior para validar que la nueva sea diferente que la antiguaß
 */
const getClaveDB = async (id_empleado) => {
    // obtener la clave de la db cuando el id_empleado sea al que se decea actualizar
    const CLAVE = await execute(`SELECT clave FROM empleados WHERE id_empleado = ?`, [id_empleado]);
    // retornar la clave   
    return CLAVE[0].clave;
}

/**
 * Método para modificar los datos en la vista de configuración
 */
const change = async (req, res) => {
    // obtener token
    const TOKEN = req.headers.authorization;
    // verificar token
    if (TOKEN) {
        try {
            // obtener usuario
            const ID = jwt.decode(TOKEN);
            // obtener los datos del cuerpo de la petición
            let { nombres, apellidos, dui, telefono, correo, clave, alias } = req.body;
            // verificar no sí viene clave nueva,  asignar la clave no midificada
            if (!clave) {
                execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, alias = ? WHERE id_empleado = ?',
                    [nombres, apellidos, dui, telefono, correo, alias, ID])
                    .then(() => {
                        res.status(201).send('Datos modificados')
                    }).catch(rej => {
                        console.log(rej); res.status(500).send(getError(rej));
                    })

            }
            else {
                if (!compareSync(clave, await getClaveDB(ID))) {
                    clave = encrypt(clave);

                    execute('UPDATE empleados SET nombres = ?, apellidos = ?, dui = ?, telefono = ?, correo = ?, clave = ?, alias = ?, fecha_ingreso = ? WHERE id_empleado = ?',
                        [nombres, apellidos, dui, telefono, correo, clave, alias, HOY, ID])
                        .then(() => {
                            res.status(201).send('Datos modificados');
                        }).catch(rej => {
                            res.status(500).send(getError(rej));
                        })
                } else {
                    res.status(500).send('La nueva contraseña debe ser diferente a la actual');
                }

            }
        } catch (error) {
            res.status(500).send('Surgio un problema en el servidor');
        }

    } else {
        res.status(401).send('Debe autenticarse antes');
    }
}

/**
 * Método asincrono para verificar sí hay Sucursales registradas para verificar el primer uso
 * @param {*} req datos de la petición (vienen de la del cliente
 * @param {*} res respuesta del servidor
 */
const verificarSucursales = async (req, res) => {
    try {
        // obtener las Sucursales para verificar sí existen registradas
        let sucursales = await execute(`SELECT count(nombre_sucursal) as '$2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC' FROM sucursales`);
        // retornar en la respuesta las sucursales encontradas

        res.status(200).json(sucursales[0]['$2a$10$$2a$10$GyJH60Pu2zB42dQQDtVq5OzWprfImpzcw5lSqaNvoQgaQLs4KNkfC']);
    } catch (error) {
        res.status(500).send(getError(error));
    }
}

/**
 * Método ascricrono para verificar sí hay empleados registrados para el método de primer uso
 * @param {*} req datos de la petición
 * @param {*} res respuesta del servidor
 */
const verificarEmpleados = async (req, res) => {
    try {
        // obtener los empleados registrados
        let empleados = await execute(`SELECT count(id_empleado) as '$2a$10$23bWlWgaHrD/uBy4p6Sj/eC0U73vpDJXkOs7KLmtpQxdF5nrasgdK' FROM empleados`);
        // retornar los empleados registrados
        res.status(200).json(empleados[0]['$2a$10$23bWlWgaHrD/uBy4p6Sj/eC0U73vpDJXkOs7KLmtpQxdF5nrasgdK'])
    } catch (error) {
        res.status(500).send(getError(error));
    }
}

/**
 * Método para obtener la primera sucursal, el primer horario y el primer cargo para asignar al primer empleado
 * @param {*} req datos que se envia de la petición
 * @param {*} res respues del servidor o (return de este método)
 */
const getDataPrimerEmpleado = async (req, res) => {
    try {
        // obtener los cargos, horarios y sucursal para despues formatear 
        let cargo = await execute('SELECT id_cargo FROM cargos');
        let horario = await execute('SELECT id_horario FROM horarios');
        let sucursal = await execute('SELECT id_sucursal FROM sucursales');

        // declarar un objeto para retornar al cliente un objetos con los ids
        let id = {
            cargo: getBinary(cargo, 'id_cargo')[0],
            horario: getBinary(horario, 'id_horario')[0],
            sucursal: getBinary(sucursal, 'id_sucursal')[0]
        }

        res.status(200).json(id);
    } catch (error) {
        res.status(500).send(getError(error));
    }
}
// exportar modulos
module.exports = {
    validateUsuario, getInfo, getConfig, change, verificarSucursales,
    verificarEmpleados, getDataPrimerEmpleado, validatePIN,
    validateRecuperación, restablecer, cambiarClave, getCargo,
    validateUsuarioBloqueado
};