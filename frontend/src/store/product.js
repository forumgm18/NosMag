import {parseJsonStrToNumbers} from '@/utils/main-scripts'
import Vue from 'vue'

export const state = () => ({
  menuItems: []
})

export const mutations = {
  setProduct (state, val) {
    console.log('setProduct: ',val)
    if (val.content.status) Vue.set(val.rootState, 'status', val.content.status)
    if (val.content.type) Vue.set(val.rootState, 'type', val.content.type)
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.content.data)) {
      key==='breadcrumbs' || key==='name' ? Vue.set(val.rootState, key, v) : Vue.set(state, key, v)
    }
    
  }
}

export const actions = {
  async fetchProduct({ commit, rootState }, queryParams) {
    // console.log('fetchProductList (queryParam): ', queryParam)
    const qParams = typeof queryParams === 'string' ? {alias: queryParams} : queryParams
    const c = await this.$axios.$get(`/get_content`, {
      params: {
        ...qParams,
        session_id: rootState.token.session_id
      }
    })
    if (c.status === 'ok' && c.type != '404') {
      // Преобразуем строковые числа в числа
      const content = parseJsonStrToNumbers(c)
      commit('setProduct', {content, rootState})  
      return 'ok'
    }
    if (c.type === '404') {
        // commit('setError', c)  
        return 'error'
    }
    


    
  },
}

export const getters = {
  getProduct: s => s || null,
  getFeedbacks: s => s.feedbacks || null,
}
