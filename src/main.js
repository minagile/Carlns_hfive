// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import VueResource from 'vue-resource'
import 'vant/lib/vant-css/index.css'
import { post, fetch, put } from './assets/js/http'
// import $ from 'jquery'

// 定义全局变量
Vue.prototype.$post = post
Vue.prototype.$fetch = fetch
Vue.prototype.$put = put

Vue.use(VueResource)
Vue.use(Vant)
// Vue.use($)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
