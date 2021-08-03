import Vue from 'vue'
import vPaginate from 'vuejs-paginate'
const Paginate = {
  install(Vue, options) {
    Vue.component('Paginate', vPaginate)
  }
}
Vue.use(Paginate)
