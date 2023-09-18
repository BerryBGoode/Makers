<template>
    <div class="container servicios component-servicio h-100">

        <button type="button" class="btn btn-makers" @click="start">Start</button>
        <button type="button" class="btn btn-makers" @click="stop">Stop</button>
    </div>
</template>
<script>

export default {
    data() {
        let audioctx = new AudioContext();

        let sample = audioctx.sampleRate;
        let frames ;
        return {

        }
    },
    created() {

    },
    methods: {
        start() {
            this.recognition.start();
        },
        stop() {
            this.recognition.stop();
        }
    }
}
</script>