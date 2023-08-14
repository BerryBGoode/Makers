// importando método para poder manejar los estados
import { createStore } from 'vuex';
// instanciando createStore, para personalizar
// el manejo de estados
const store = createStore({
    state: {
        buscador: '',
        usuario: '',
    },

    mutations: {
        /**
         * Método para mutar el estado 'buscador'
         * @param {*} state estado de vuex (buscador)
         * @param {*} dato nuevo dato
         */
        setBuscador(state, dato) {
            state.buscador = dato
        },
        /**
         * Método para mutar el estado del nombre de usuario del componente cuenta
         * @param {*} state estado de vuex (usuario) 
         * @param {*} dato nuevo dato
         */
        setUsuario(state, dato) {
            state.usuario = dato;
        },
    },
    actions: {
        /**
         * Acción para settear el nuevo valor del buscador
         * @param {*} param0 objeto => acceder a commit => para acceder al método que settea el nuevo valor
         * @param {*} now nuevo valor
         */
        actionBuscador({ commit }, now) {
            // llamar a la mutación
            commit('setBuscador', now)
        },
        /**
         * Acción para setter el nuevo nombre de usuario
         * @param {*} param0 obj => acceder a commit => para acceder al método que sette el nuevo nombre
         * @param {*} now nuevo valor
         */
        actionUsuario({ commit }, now) {
            // llamar método para mutar el estado
            commit('setUsuario', now)
        },

    },
})

// exportando instancia
export default store;