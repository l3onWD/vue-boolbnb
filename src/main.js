import { createApp } from 'vue';
import App from "@/App.vue";

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


const app = createApp(App);

app.use(router);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.directive('click-outside', clickOutside);

app.mount("#app");

