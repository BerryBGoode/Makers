<style scoped></style>
<template>
    <video ref="video" width="720" height="560" autoplay muted></video>
    <canvas ref="canvas"></canvas>
</template>
<script>
// import '@tensorflow/tfjs-core';
// import * as faceapi from 'face-api.js';
// import * FaceDetection from 'face-api.js';
// import * as face from 'face-api.js';



export default {
    data() {
        return {
            video: '',
            canvas: '',
        }
    },
    mounted() {
        this.video = this.$refs.video;
        this.canvas = this.$refs.canvas;
        // this.start();
        // this.validateFace();
        // Promise.all([
        //     faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        //     faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        //     faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        //     faceapi.nets.faceExpressionNet.loadFromUri('./models')
        // ]).then(this.start)
    },
    methods: {
        async start() {
            // obtener y activar la media o los servicios de la refencia a la video, y esa utilice como recurso
            // a mostrar la camara del hardware
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;
        },
        models() {

        }
        // async validateFace() {
        //     const video = this.video;
        //     const canvas = this.canvas;
        //     const display = { width: video.width, height: video.height };

        //     face.matchDimensions(canvas, display);
        //     const detections = await face.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        //     const resize = face.resizeResults(detections, display);

        //     canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        //     face.draw.drawDetections(canvas, resize);
        //     face.draw.drawFaceLandmarks(canvas, resize);
        // }
    }
}
</script>