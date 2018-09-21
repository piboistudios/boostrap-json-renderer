// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css';
// import 'animate.css/animate.min.css';

Vue.use(BootstrapVue);

import BJsonRenderer from './components/BJsonRenderer.vue';
Vue.component('b-json-renderer', BJsonRenderer);
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
Vue.component('vue-bootstrap-typeahead', VueBootstrapTypeahead)

Vue.config.productionTip = false
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import icons from './icons';
icons.forEach(icon => {
  library.add(icon);
});
Vue.component('fa-icon', FontAwesomeIcon);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
