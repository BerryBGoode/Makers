import './assets/main.css'
// importación de bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// componente nativo de vue
import { createApp } from 'vue'
// componente definido en ese directorio
import App from './App.vue'

// componente definido en ese directorio
import ROUTER from './routes';

// componente nativo de cors (depencia)
import cors from 'cors';

import VueCookies from 'vue-cookies';
import store from './store';
import alert from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.all';
import '@sweetalert2/theme-dark';
// instancia del componente
const APP = createApp(App)

APP.use(cors);
// usar el enrutado
APP.use(ROUTER);
APP.use(store)
// usando vue-cookies, cada cookie durará 1 día
APP.use(VueCookies, { expires: '1d' });
APP.use(alert);
// montar lo recuperado del componente principal
// al contenedor con id="app"
APP.mount('#app')
