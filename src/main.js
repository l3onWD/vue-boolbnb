import { createApp } from 'vue';
import { createPinia } from 'pinia'
// Bootstrap JS
import 'bootstrap/js/index.esm';
// Router
import { router } from '@/router/';
// Custom Directives
import { clickOutside } from '@/directives/';
// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Icons
import { faMagnifyingGlass, faUser, faBars, faGlobe, faSliders, faFilter, faArrowDown, faChevronLeft, faLocationDot, faX, faThumbsUp, faQuestion, faAnglesUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons'
library.add(faMagnifyingGlass, faUser, faBars, faGlobe, faSliders, faFacebook, faInstagram, faXTwitter, faFilter, faArrowDown, faChevronLeft, faLocationDot, faX, faThumbsUp, faQuestion, faAnglesUp)


//*** COMPONENTS ***//
import App from "@/App.vue";


//*** INIT ***//
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.directive('click-outside', clickOutside);

app.mount("#app");

