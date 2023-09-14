<style>
.msm-container {
    width: 50%;
}

.input-pin {
    height: 100%;
    width: 15%;
    background: #393534;
    border: solid 1px #b4b0af;
    border-radius: 5px;
    color: #fff;
    font-size: large;
}

.form-pin {
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    height: 25%;
}

.view-pin {
    display: flex;
    gap: 110px;
    flex-direction: column;
}
</style>

<template>
    <section class="flex items-center w-100 h-100 ">
        <!-- agregar evento para verificar pin -->
        <form class="msm-container container p-5 login-container ">
            <span class="msg">{{ msg }}</span>
            <div class="col h-100 flex wrap">
                <div class="row-6 p-3 w-100 h-100 align-center view-pin">
                    <div class="text-center">
                        <h3>Revisa el buzón de mensajes</h3>
                        <!-- sustituir por el número recuperado según la verificación anterior -->
                        <span>al número {{ numero }}</span>
                    </div>
                    <div class="form-pin">
                        <input type="number" min="0" id="" class="input-pin">
                        <input type="number" min="0" id="" class="input-pin">
                        <input type="number" min="0" id="" class="input-pin">
                        <input type="number" min="0" id="" class="input-pin">
                        <input type="number" min="0" id="" class="input-pin">
                    </div>
                    <div class="button-pin">
                        <button type="submit" class="btn btn-makers w-100 bold">Verificar</button>
                    </div>
                </div>
            </div>
        </form>
    </section>
</template>
<script>
export default {
    name: 'msm',
    data() {
        let numero = '5453 4343';

        return {
            msg: null,
            numero
        }
    },
    mounted() {
        this.onMounted()
    },
    methods: {
        onMounted() {
            // agregar este código en el backend para retornar ese número 
            // separar las primeros 4 dígitos y sustituirlos
            for (let i = this.numero.length; i > 5; i--) {
                console.log(i)
                let first = this.numero.slice(0, -4);
                this.numero = first + '****'

            }
            this.numero = this.numero.replace(/.{1}$/, '*')
            console.log(this.numero)
        }

    }
}
</script>