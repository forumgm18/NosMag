import Vue from 'vue'
// import vLoading from '~/components/common/loading.vue'
import vLoading from '~/components/common/preloader/preloader.vue'

const Loading = {
  install(Vue, options) {
    Vue.component('Loading', vLoading)
  }
}

Vue.use(Loading)
