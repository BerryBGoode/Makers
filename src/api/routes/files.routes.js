const { Router } = require('express');

const { upload, handledAudio } = require('../queries/files');

const audio = Router();

audio.post('/audio', upload.single('file'), handledAudio);