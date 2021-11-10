import Vue from 'vue'
import vBtnGoBack from '~/components/common/btn-go-back'
const BtnGoBack = {
  install(Vue, options) {
    Vue.component('BtnGoBack', vBtnGoBack)
  }
}
Vue.use(BtnGoBack)
