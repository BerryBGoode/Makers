<style>

</style>

<template>
    <span>{{text}}</span>
</template>
<script>

// exportar componente hijo
export default  {
    // nombre del componente
    name : "404",
    // método que retorna el componente
    data () {
        return {
            text : '404:Not found'
        }
    }
}

</script>