const { Router } = require('express');

const file = Router();

const { upload } = require('../queries/files');

// requiriendo path para definir ruta donde guardar se quiere guardar el archivo
const path = require('path');
// requiriendo fs para poder eliminar los archivos
const fs = require('fs');
const { getError } = require('../helpers/errors');

file.post('/imgproducto', upload.single('productoimg'), (req, res) => {
    if (!req.file) {
        return res.status(400).json('No se recibio la imagen');
    }

    res.json('Imgen subida').status(201);
})

file.delete('/imgproducto/:filename', (req, res) => {
    // validar que se obtiene la imagen
    if (req.params.filename == 0) {
        return res.status(400).json('No se recibio la imagen');
    }
    // definiendo la ruta de donde se borrará
    let dir = path.join(__dirname, '../audios/');
    // eliminar la imagen
    fs.unlink(dir + req.params.filename, (e) => {
        // verificar sí hubo un error
        if (e) {
            console.log(e);
            res.status(500).json(getError(e));
        } else {
            res.status(200).json('Archivo eliminado')
        }
    })

})

module.exports = file