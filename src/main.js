// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import bosui from '../lib/bos-ui.bundle.js'
import compass from '../static/libs/GeoBOS.orientation.min'
import lCalendar from '@/assets/js/lCalendar';
import myemojiPl from '@/assets/js/myemojiPl'
import '../lib/index.css'
import '@/assets/css/myemojiPl.css'
import '@/assets/css/lCalendar.css'

Vue.use(bosui);
Vue.use(compass);
Vue.use(lCalendar);
Vue.use(myemojiPl);
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  data:{
    hub:new Vue(),
  }
});

