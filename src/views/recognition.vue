<template>
    <div class="container servicios component-servicio h-100">

        <button type="button" class="btn btn-makers" @click="start">Start</button>
        <button type="button" class="btn btn-makers" @click="stop">Stop</button>
    </div>
</template>
<script setup>
// const recognition = new webkitSpeechRecognition();


// console.log(recognition)



const recognition = new webkitSpeechRecognition();

recognition.lang = 'es-ES';
recognition.continuos = true;
recognition.interimResult = false;

const start = () => {
    recognition.start();
}

const stop = () => {
    recognition.abort();
}
recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);

    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.onend = () => {
        const pitch = utterance.pitch;
        console.log(pitch);
        // Aquí puedes utilizar el valor de pitch para identificar patrones únicos en la voz del usuario
    };
    window.speechSynthesis.speak(utterance);
};

</script>