export const state = () => ({
  // products: []
})

export const mutations = {
  setProductList (state, val) {
    state.status = val.status
    state.type = val.type
  // цикл по ключам и значениям
    for (let [key, v] of Object.entries(val.data)) {
      state[key] = v 
    }
  },
  updateProductList (state, val) {
    console.log('updateProductList (val)', val)
    // console.log('updateProductList (isFilter)', isFilter)
    if (state.items && state.items.length && !val.isFilter) {
      console.log('updateProductList (update items)', val)

    // цикл по ключам и значениям
      for (let [key, v] of Object.entries(val.data)) {
        if (key != 'items') { 
          state[key] = v 
        } else {
          state[key] = [...state[key], ...v]
        }
    }
    } else {
      console.log('updateProductList (update all)', val)
    // цикл по ключам и значениям
      for (let [key, v] of Object.entries(val.data)) {
        state[key] = v 
      }
  }
  }
}

export const actions = {
  async fetchProductList({ commit, rootState }, queryParam) {
    console.log('fetchProductList (queryParam): ', queryParam)

    const c = await this.$axios.$get(`/get_content`, {
      params: {
        ...queryParam.params,
        session_id: rootState.token.session_id
      }
    })
    console.log('fetchProductList (content): ',c)

    if (c.status === 'ok' && c.type === 'razdel') {
    // Преобразуем строковые числа в числа
      const content = JSON.parse(JSON.stringify(c),function (key, value) {
        if (value === (+value).toString()) return +value
        return value
      } )
      if (queryParam.params.items_only) {
        console.log('fetchProd isFilter' , queryParam.isFilter)
        commit('updateProductList', {...content, isFilter: queryParam.isFilter})  
      } else {
        commit('setProductList', content)  
      }
    }

    
  },
}

export const getters = {
  getProductList: s => s.items || null,
  getFilters: s => s.filters || null,
  getSortmdes: s => s.sortmodes || null,
  getQuantityPerPage: s => s.items_page_q || null,
  getProductsTotal: s => s.items_total_q || null,
  // getTitle: s => s.title || '',
  getTitle: s => s.name || '',
  getSublinksMenu: s => s.sublinks_menu || null,


}
