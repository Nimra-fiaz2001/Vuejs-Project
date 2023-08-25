import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add the Font Awesome icon to the library
library.add(faComment);

const app = createApp(App);

// Register the Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.use(store);

app.mount('#app');
