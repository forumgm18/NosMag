import {parseJsonStrToNumbers} from '@/utils/main-scripts'
import Vue from 'vue'

export const state = () => ({
  // products: []
})

export const mutations = {
  setError (state, val) {
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val)) {
      // state[key] = v 
      Vue.set(state, key, v)
    }
  },
  setProductList (state, val) {
    console.log('setProductList', val)
    // Vue.set(state, 'status', val.content.status)
    // Vue.set(state, 'type', val.content.type)
    if (val.content.status) Vue.set(val.rootState, 'status', val.content.status)
    if (val.content.type) Vue.set(val.rootState, 'type', val.content.type)
    // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.content.data)) {
      // key==='breadcrumbs' || key==='name' ? Vue.set(val.rootState, key, v) : Vue.set(state, key, v)
      if (key==='breadcrumbs' || key==='name') {
        Vue.set(val.rootState, key, v) 
      } else {
        // Vue.set(state, key, v)
        if (key === 'filters') { // добавляем поле active в фильтры
          let tmp = [...v]
          tmp.forEach(t => {
            if (Array.isArray(t.values)) {
              t.values = t.values.map((item) => {
                return item.hasOwnProperty('active') // если поле active уже есть
                  ? item                             // возвращаем как есть
                  : { ...item, active: 0 }           // если поля active нет то добавляем
              })
            }

          })
          state[key] = tmp
        } else {
          state[key] = v
        }
        
      }
    }
    // console.log('setProductList state', state)
  },
  updateProductList (state, val) {
    console.log('updateProductList', val)
    // console.log('updateProductList (isFilter)', isFilter)
    // debugger
    if (val.isFilter && val.isNewFilter) {
      // цикл по ключам и значениям
        for (let [key, v] of Object.entries(val.data)) {
          // state[key] = v
          Vue.set(state, key, v)
        }
        return
    }
      if (state.items && state.items.length) {
        // if (state.items && state.items.length && !val.isFilter) {
        // console.log('updateProductList (items)', val)
        // цикл по ключам и значениям
        for (let [key, v] of Object.entries(val.data)) {
          if (key != 'items') {
            // state[key] = v
            Vue.set(state, key, v)
          } else {
            state[key] = [...state[key], ...v]
          }
        }
      } 
    // else {
    //   // console.log('updateProductList (all)', val)
    // // цикл по ключам и значениям
    //   for (let [key, v] of Object.entries(val.data)) {
    //     // state[key] = v 
    //     Vue.set(state, key, v)
    //   }
    // }
  }
}

export const actions = {
  async fetchProductList({ commit, rootState }, queryParam) {
    // console.log('fetchProductList (queryParam): ', queryParam)

    const c = await this.$axios.$get(`/get_content`, {
      params: {
        ...queryParam.params,
        session_id: rootState.token.session_id
      }
    })
    // console.log('fetchProductList (content): ',c)

    if (c.status === 'ok') {
      if (c.type === 'razdel') {
      // Преобразуем строковые числа в числа
        // const content = JSON.parse(JSON.stringify(c),function (key, value) {
        //   return (value === (+value).toString()) ? +value : value
        // } )
        // const content = JSON.parse(JSON.stringify(c), 
        //                           (key, value) => (value === (+value).toString()) ? +value : value )
        const content = parseJsonStrToNumbers(c)

        if (queryParam.params.items_only) {
          // console.log('fetchProd isFilter' , queryParam.isFilter)
          commit('updateProductList', {...content, isFilter: queryParam.isFilter, isNewFilter: queryParam.isNewFilter})  
        } else {
          commit('setProductList', {content, rootState})  
        }
        return 'ok'
      }
      if (c.type === '404') {
        commit('setError', c)  
        return 'error'
      }
    }


    
  },

}

export const getters = {
  // getTitle: s => s.title || '',
  // getPageTitle: s => s.name || null,
  getBreadcrumbs: s => s.breadcrumbs || null,
  getProductList: s => s.items || null,
  getFilters: s => s.filters || null,
  getSortmdes: s => s.sortmodes || null,
  getQuantityPerPage: s => s.items_page_q || null,
  getProductsTotal: s => s.items_total_q || null,
  getSublinksMenu: s => s.sublinks_menu || null,


}
