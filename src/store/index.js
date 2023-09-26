// importando método para poder manejar los estados
import { createStore } from 'vuex';
// instanciando createStore, para personalizar
// el manejo de estados
const store = createStore({
    state: {
        buscador: '',
        usuario: '',
        empleados: null,
        sucursales: null,
        cargo: '',
        cambio_clave: false,
        config: {
            headers: {
                authorization: localStorage.getItem('auth')
            }
        },
        empleadosload: false,
        sucursalesload: false

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
        /**
         * Método para setear o mutar el estado global y poder realizar una acción
         * @param {*} state estado global a modificar
         * @param {*} data valor a setear
         */
        setEmpleado(state, data) {
            state.empleados = data;
        },

        setAccess(state, data) {
            state.config.headers = data;
        },
        setSucursal(state, data) {
            state.sucursales = data;
        }
    },
    actions: {
        /**
         * Acción para settear el nuevo valor del buscador
         * @param {*} param0 objeto => acceder a commit => para acceder al método que settea el nuevo valor
         * @param {*} now nuevo valor
         */
        actionBuscador({ commit }, now) {
            // llamar a la mutación
            commit('setBuscador', now);
        },
        /**
         * Acción para setter el nuevo nombre de usuario
         * @param {*} param0 obj => acceder a commit => para acceder al método que sette el nuevo nombre
         * @param {*} now nuevo valor
         */
        actionUsuario({ commit }, now) {
            // llamar método para mutar el estado
            commit('setUsuario', now);
        },
        /**
         *  Acción para acceder al setter para modificar la cantidad de empleados
         * @param {*} param0 obj => acceder a commit => para acceder al método que sette el nuevo nombre
         * @param {*} now nuevo valor
         */
        actionEmpleado({ commit }, now) {
            // llamar el método q realizar la mutación del estado y mandarle el nuevo valor
            commit('setEmpleado', now);
        },
        actionAccess({ commit }, now) {
            commit('setAccess', now);
        },
        actionSucursal({ commit }, now) {
            commit('setSucursal', now);
        }

    },
})

// exportando instancia
export default store;