import {parseJsonStrToNumbers} from '@/utils/main-scripts'
import Vue from 'vue'

export const state = () => ({
  menuItems: []
})

export const mutations = {
  setProduct (state, val) {
    console.log('setProduct: ',val)
    // if (val.content.status) Vue.set(val.rootState, 'status', val.content.status)
    // if (val.content.type) Vue.set(val.rootState, 'type', val.content.type)
    if (val.content.status) val.rootState.status = val.content.status
    if (val.content.type) val.rootState.type = val.content.type
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.content.data)) {
      // key==='breadcrumbs' || key==='name' ? Vue.set(val.rootState, key, v) : Vue.set(state, key, v)
      if ( key==='breadcrumbs' || key==='name') {
        val.rootState[key] = v 
      } else { 
        state[key] = v
      }
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
  product: s => s || null,
  getFeedbacks: s => s.feedbacks || null,
  feedbacks: s => s.feedbacks || null,
  alias: s => s.alias || null,
  art: s => s.art || null,
// case:0
// caseq:0
  category: s => s.category || null,
// category_id:53
  comment: s => s.comment || null,
// daytoday:1
  delivery: s=> s.delivery || null,
// econom:0
  filters: s=> s.filters || null,
// hit:0
// id:1246
  images: s => s.images || null,
  info_table: s => s.info_table || null,
  kupili: s=> s.kupili || null,
  labels: s => s.labels || null,
// menuItems:Array[0]
// new:0
// oldprice:159
// otzyvov:1
  params: s => s.params || null,
// price:119
  prices: s=> s.prices || null,
// prices_table:1
// prodano:260
// qsign:0
  razdel: s => s.razdel || null,
// razdel_id:4
// razdel_id1:0
  sameart: s => s.sameart || null,
  sizes: s => s.sizes || null,
// socks:1
  stars: s => s.stars || null,
// status:1
// thumbs:1
  title: s => s.title || null,
// tu:""


}
