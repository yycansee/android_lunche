// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import VueLazyImage from '../src/tool/lazyLoad/index.js'
import keyDo from '../src/components/keyCode/index.js'
import LFirm from '../src/tool/Firm/index.js'


Vue.use(keyDo);
Vue.use(VueLazyImage,{debounce:200});
Vue.use(LFirm);
// const isDebug_mode = process.env.NODE_ENV !== 'production';


const isDebug_mode = true;
Vue.config.debug = isDebug_mode;
Vue.config.devtools = isDebug_mode;
Vue.config.productionTip = isDebug_mode;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
