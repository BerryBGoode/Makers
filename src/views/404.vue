<style>
.error {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.status-error,
.other {
    font-weight: 600;
    font-size: 5.5rem;
}
</style>

<template>
    <div class="error">
        <div class="status-error">
            404
        </div>
        <div class="other">
            Not found
        </div>
    </div>
</template>
<script>

// exportar componente hijo
export default {
    // nombre del componente
    name: "404",
    // método que retorna el componente
    data() {
        return {

        }
    }
}

</script>