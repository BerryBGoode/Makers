// importando método para poder manejar los estados
import { createStore } from 'vuex';
// instanciando createStore, para personalizar
// el manejo de estados
const store = createStore({
    state: {
        buscador: ''
    },

    mutations: {
        /**
         * Método para mutar el estado 'buscador'
         * @param {*} state estado de vuex (buscador)
         * @param {*} dato nuevo dato
         */
        setBuscador(state, dato) {
            state.buscador = dato
        }
    },
    actions: {  
        /**
         * Acción para settear el nuevo valor del buscador
         * @param {*} param0 objeto => acceder a commit => para acceder al método que settea el nuevo valor
         * @param {*} now nuevo valor
         */
        actionBuscador( { commit }, now){
            // llamar a la mutación
            commit('setBuscador', now)
        }
    },
    getters: {
        
    }
})

// exportando instancia
export default store;