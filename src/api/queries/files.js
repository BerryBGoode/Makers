const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../audios');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const handledAudio = (req, res) => {
    res.json('Archivo subido');
}
const upload = multer({ storage });

module.exports = { upload, handledAudio }