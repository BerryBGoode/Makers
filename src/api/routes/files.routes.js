const { Router } = require('express');

const file = Router();

const { upload } = require('../queries/files');

file.post('/imgproducto', upload.single('productoimg'), (req, res) => {
    if (!req.file) {
        return res.status(400).json('No se encontrado la imagen')
    }

    res.json('Imgen subida').status(201);
})



module.exports = file