// requiriendo multer para el manejo de archivos
const multer = require('multer');
// requiriendo path para definir ruta donde guardar se quiere guardar el archivo
const path = require('path');
// requiriendo fs para poder eliminar los archivos
const fs = require('fs');

const dir = path.join(__dirname, '../audios')
// configurando multer
const storage = multer.diskStorage({
    // definiendo ruta donde se guardarán los archivos
    destination: (req, res, cb) => {
        cb(null, dir);
    },
    // definiendo el nombre con el que se guardarán
    filename: (req, file, cb) => {
        let unique = Date.now().toString().substring(0, 9);
        cb(null, `${unique}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

module.exports = { upload }